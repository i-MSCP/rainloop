=head1 NAME

 Package::WebmailClients::RainLoop::Handler - i-MSCP RainLoop package handler

=cut

# i-MSCP - internet Multi Server Control Panel
# Copyright (C) 2010-2019 Laurent Declercq <l.declercq@nuxwin.com>
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA

package Package::WebmailClients::RainLoop::Handler;

use strict;
use warnings;
use File::Spec;
use iMSCP::Boolean;
use iMSCP::Crypt qw/ decryptRijndaelCBC encryptRijndaelCBC randomStr /;
use iMSCP::Cwd '$CWD';
use iMSCP::Database;
use iMSCP::Debug qw/ debug error /;
use iMSCP::Dir;
use iMSCP::EventManager;
use iMSCP::Execute qw/ escapeShell execute /;
use iMSCP::File;
use iMSCP::Stepper qw/ startDetail endDetail step /;
use iMSCP::TemplateParser qw/ getBloc replaceBloc process /;
use Servers::sqld;
use Scalar::Defer;
use parent 'Common::Object';

=head1 DESCRIPTION

 i-MSCP RainLoop package handler.

=head1 PUBLIC METHODS

=over 4

=item preinstall( )

 Pre-installation tasks

 Return int 0 on success, other on failure

=cut

sub preinstall
{
    my ( $self ) = @_;

    local $CWD = $::imscpConfig{'GUI_ROOT_DIR'};

    $self->{'events'}->register(
        'afterFrontEndBuildConfFile', \&afterFrontEndBuildConfFile
    );
}

=item install( )

 Installation tasks

 Return int 0 on success, other on failure

=cut

sub install
{
    my ( $self ) = @_;

    local $CWD = $::imscpConfig{'GUI_ROOT_DIR'};

    my $rs = $self->_applyPatches();
    $rs ||= $self->_installDataFiles();
    $rs ||= $self->_buildConfigFiles();
    $rs ||= $self->_buildHttpdConfigFile();
    $rs ||= $self->_setupDatabase();
    $rs ||= $self->_setupSqlUser();
}

=item postinstall( )

 Post-installation tasks

 Return int 0 on success, other on failure

=cut

sub postinstall
{
    local $CWD = $::imscpConfig{'GUI_ROOT_DIR'};

    if ( -l "$CWD/public/tools/rainloop" ) {
        my $rs = iMSCP::File->new(
            filename => "$CWD/public/tools/rainloop"
        )->delFile();
        return $rs if $rs;
    }

    unless ( symlink( File::Spec->abs2rel(
        "$CWD/vendor/imscp/rainloop/rainloop", "$CWD/public/tools"
    ),
        "$CWD/public/tools/rainloop"
    ) ) {
        error( sprintf( "Couldn't create symlink for the RainLoop webmail" ));
        return 1;
    }

    0;
}

=item uninstall( )

 Uninstallation tasks

 Return int 0 on success, other on failure

=cut

sub uninstall
{
    my ( $self ) = @_;

    local $CWD = $::imscpConfig{'GUI_ROOT_DIR'};

    if ( -l "$CWD/public/tools/rainloop" ) {
        my $rs = iMSCP::File->new(
            filename => "$CWD/public/tools/rainloop"
        )->delFile();
        return $rs if $rs;
    }

    if ( -f '/etc/nginx/imscp_rainloop.conf' ) {
        my $rs = iMSCP::File->new(
            filename => '/etc/nginx/imscp_rainloop.conf'
        )->delFile();
        return $rs if $rs;
    }

    local $@;
    eval {
        local $self->{'dbh'}->{'RaiseError'} = TRUE;

        $self->{'dbh'}->do(
            "DROP DATABASE IF EXISTS `@{ [ $::imscpConfig{'DATABASE_NAME'} . '_rainloop' ] }`"
        );

        my ( $databaseUser ) = @{ $self->{'dbh'}->selectcol_arrayref(
            "SELECT `value` FROM `config` WHERE `name` = 'RAINLOOP_SQL_USER'"
        ) };

        if ( defined $databaseUser ) {
            $databaseUser = decryptRijndaelCBC(
                $::imscpDBKey, $::imscpDBiv, $databaseUser
            );

            for my $host (
                $::imscpOldConfig{'DATABASE_USER_HOST'},
                $::imscpConfig{'DATABASE_USER_HOST'}
            ) {
                next unless length $host;
                Servers::sqld->factory()->dropUser( $databaseUser, $host );
            }
        }

        $self->{'dbh'}->do(
            "DELETE FROM `config` WHERE `name` LIKE 'RAINLOOP_%'"
        );

        iMSCP::Dir->new(
            dirname => "$CWD/data/persistent/rainloop"
        )->remove();
    };
    if ( $@ ) {
        error( $@ );
        return 1;
    }

    0;
}

=item deleteMail( \%data )

 Delete any RainLoop data that belong to the given mail account

 Param hashref \%data Data as provided by the Mail module
 Return int 0 on success, other on failure 

=cut

sub deleteMail
{
    my ( $self, $data ) = @_;

    return 0 unless $data->{'MAIL_TYPE'} =~ /_mail/;

    local $@;
    eval {
        local $self->{'dbh'}->{'RaiseError'} = TRUE;

        my $database = $::imscpConfig{'DATABASE_NAME'} . '_rainloop';

        $self->{'dbh'}->do(
            "
                DELETE u, c, p
                FROM `$database`.`rainloop_users` AS u
                LEFT JOIN `$database`.`rainloop_ab_contacts` AS c USING(`id_user`)
                LEFT JOIN `$database`.`rainloop_ab_properties` AS p USING(`id_user`)
                WHERE u.`rl_email` = ?
            ",
            undef,
            $data->{'MAIL_ADDR'}
        );

        # Remove unwanted characters from the email (Mimic RainLoop behavior)
        ( my $email = $data->{'MAIL_ADDR'} ) =~ s/[^a-z0-9\-\.@]+/_/i;
        my $storageRootDir = "$CWD/data/persistent/rainloop/imscp/storage";

        for my $storageType ( qw/ data cfg files / ) {
            # Apply a right padding on the storage subdirectory with underscore
            # character. Storage subdirectory must be 2 characters long.
            # (Mimic RainLoop behavior)
            my $storageSubDir = substr( $email, 0, 2 ) =~ s/\@$//r;
            $storageSubDir .= ( '_' x ( 2-length( $storageSubDir ) ) );
            my $storagePath = $storageRootDir . '/' . $storageType . '/'
                . $storageSubDir . '/' . $email . '/';

            iMSCP::Dir->new( dirname => $storagePath )->remove();
            my $dir = iMSCP::Dir->new( dirname => $storageRootDir . '/'
                . $storageType . '/' . $storageSubDir );
            next unless $dir->isEmpty();
            $dir->remove();
        }
    };
    if ( $@ ) {
        error( $@ );
        return 1;
    }

    0;
}

=back

=head1 EVENT LISTENERS

=over 4

=item afterFrontEndBuildConfFile( )

 Event listener that injects Httpd configuration for RainLoop into the i-MSCP
 control panel Nginx vhost files

 Return int 0 on success, other on failure

=cut

sub afterFrontEndBuildConfFile
{
    my ( $tplContent, $tplName ) = @_;

    return 0 unless grep (
        $_ eq $tplName, '00_master.nginx', '00_master_ssl.nginx'
    );

    ${ $tplContent } = replaceBloc(
        "# SECTION custom BEGIN.\n",
        "# SECTION custom END.\n",
        "    # SECTION custom BEGIN.\n"
            . getBloc(
                "# SECTION custom BEGIN.\n",
                "# SECTION custom END.\n",
                ${ $tplContent }
            )
            . "    include imscp_rainloop.conf;\n"
            . "    # SECTION custom END.\n",
        ${ $tplContent }
    );

    0;
}

=back

=head1 PRIVATE METHODS

=over 4

=item _init( )

 Initialize instance

 Return Package::WebmailClients::RainLoop::Handler

=cut

sub _init
{
    my ( $self ) = @_;

    $self->{'events'} = iMSCP::EventManager->getInstance();
    $self->{'dbh'} = lazy { iMSCP::Database->factory()->getRawDb(); };
    $self;
}

=item _applyPatches( )

 Apply patches on the RainLoop sources
 
 Return int 0 on success, other on failure

=cut

sub _applyPatches
{
    return 0 if -f './vendor/imscp/rainloop/src/patches/.patched';

    local $CWD = './vendor/imscp/rainloop';

    for my $patch ( sort { $a cmp $b } iMSCP::Dir->new(
        dirname => './src/patches'
    )->getFiles() ) {
        my $rs = execute(
            [
                '/usr/bin/git',
                'apply',
                '--verbose',
                '-p0',
                "./src/patches/$patch"
            ],
            \my $stdout,
            \my $stderr
        );
        debug( $stdout ) if length $stdout;
        error( $stderr || 'Unknown error' ) if $rs;
        return $rs if $rs;
    }

    iMSCP::File->new( filename => './src/patches/.patched' )->save();
}

=item _installDataFiles

 Install RainLoop data files

 Return int 0 on success, other on failure

=cut

sub _installDataFiles
{
    my ( $self ) = @_;

    my $rs = $self->{'events'}->trigger(
        'onBeforeRainLoopInstallDataFiles', "$CWD/data/persistent/rainloop"
    );
    return $rs if $rs;

    local $@;
    eval {
        iMSCP::Dir->new(
            dirname => "$CWD/vendor/imscp/rainloop/src/data"
        )->rcopy(
            "$CWD/data/persistent/rainloop", { preserve => 'no' }
        );
    };
    if ( $@ ) {
        error( $@ );
        return 1;
    }

    $self->{'events'}->trigger(
        'onAfterRainLoopInstallDataFiles', "$CWD/data/persistent/rainloop"
    );
}

=item _buildConfigFiles( )

 Build RainLoop  configuration files

 Return int 0 on success, other on failure
  
=cut

sub _buildConfigFiles
{
    my ( $self ) = @_;

    local $@;
    my $rs = eval {
        local $self->{'dbh'}->{'RaiseError'} = TRUE;

        my %config = @{ $self->{'dbh'}->selectcol_arrayref(
            "
                SELECT `name`, `value`
                FROM `config`
                WHERE `name` LIKE 'RAINLOOP_%'
            ",
            { Columns => [ 1, 2 ] }
        ) };

        ( $config{'RAINLOOP_APP_SALT'} = decryptRijndaelCBC(
            $::imscpDBKey, $::imscpDBiv, $config{'RAINLOOP_APP_SALT'} // ''
        ) || lc( randomStr( 96, iMSCP::Crypt::ALNUM )) );

        ( $config{'RAINLOOP_SQL_USER'} = decryptRijndaelCBC(
            $::imscpDBKey, $::imscpDBiv, $config{'RAINLOOP_SQL_USER'} // ''
        ) || 'rainloop_' . randomStr( 7, iMSCP::Crypt::ALPHA64 ) );

        ( $config{'RAINLOOP_SQL_USER_PASSWD'} = decryptRijndaelCBC(
            $::imscpDBKey,
            $::imscpDBiv,
            $config{'RAINLOOP_SQL_USER_PASSWD'} // ''
        ) || randomStr( 16, iMSCP::Crypt::ALPHA64 ) );

        (
            $self->{'_rainloop_sql_user'},
            $self->{'_rainloop_control_user_passwd'}
        ) = (
            $config{'RAINLOOP_SQL_USER'}, $config{'RAINLOOP_SQL_USER_PASSWD'}
        );

        # Save generated values in database (encrypted)
        $self->{'dbh'}->do(
            '
                INSERT INTO `config` (`name`,`value`)
                VALUES (?,?),(?,?),(?,?)
                ON DUPLICATE KEY UPDATE `name` = `name`
            ',
            undef,
            'RAINLOOP_APP_SALT',
            encryptRijndaelCBC(
                $::imscpDBKey, $::imscpDBiv, $config{'RAINLOOP_APP_SALT'}
            ),
            'RAINLOOP_SQL_USER',
            encryptRijndaelCBC(
                $::imscpDBKey, $::imscpDBiv, $config{'RAINLOOP_SQL_USER'}
            ),
            'RAINLOOP_SQL_USER_PASSWD',
            encryptRijndaelCBC(
                $::imscpDBKey,
                $::imscpDBiv,
                $config{'RAINLOOP_SQL_USER_PASSWD'}
            )
        );

        # RainLoop SALT file

        my $file = iMSCP::File->new(
            filename => "$CWD/data/persistent/rainloop/SALT.php"
        );
        $file->set( '<php //' . $config{'RAINLOOP_APP_SALT'} ); # No EOL (expected)
        my $rs = $file->save();
        return $rs if $rs;

        # Rainloop main configuration file
        # i-MSCP plugin change password configuration file

        for my $conffile ( 'application.ini', 'plugin-imscp-change-password.ini' ) {
            my $data = {
                DATABASE_HOSTNAME => ::setupGetQuestion( 'DATABASE_HOST' ),
                DATABASE_PORT     => ::setupGetQuestion( 'DATABASE_PORT' ),
                DATABASE_NAME     => $conffile eq 'application.ini'
                    ? ::setupGetQuestion( 'DATABASE_NAME' ) . '_rainloop'
                    : ::setupGetQuestion( 'DATABASE_NAME' ),
                DATABASE_USER     => $config{'RAINLOOP_SQL_USER'},
                DATABASE_PASSWORD => $config{'RAINLOOP_SQL_USER_PASSWD'},
                DISTRO_CA_BUNDLE  => $::imscpConfig{'DISTRO_CA_BUNDLE'},
                DISTRO_CA_PATH    => $::imscpConfig{'DISTRO_CA_PATH'}
            };

            $rs = $self->{'events'}->trigger(
                'onLoadTemplate', 'rainloop', $conffile, \my $cfgTpl, $data
            );
            return $rs if $rs;

            unless ( defined $cfgTpl ) {
                return 1 unless defined(
                    $cfgTpl = iMSCP::File->new(
                        filename => "$CWD/data/persistent/rainloop/imscp/configs/$conffile"
                    )->get()
                );
            }

            $cfgTpl = process( $data, $cfgTpl );

            $file = iMSCP::File->new(
                filename => "$CWD/data/persistent/rainloop/imscp/configs/$conffile"
            );
            $file->set( $cfgTpl );
            $rs = $file->save();
            return $rs if $rs;
        }

        # RainLoop custom include file

        $file = iMSCP::File->new(
            filename => "$CWD/vendor/imscp/rainloop/rainloop/include.php"
        );
        return 1 unless defined( my $fileC = $file->getAsRef());

        ${ $fileC } = process( { GUI_ROOT_DIR => $CWD }, ${ $fileC } );

        $file->save();
    };
    if ( $@ ) {
        error( $@ );
        $rs = 1;
    }

    $rs;
}

=item _buildHttpdConfigFile( )

 Build httpd configuration file for RainLoop 

 Return int 0 on success, other on failure

=cut

sub _buildHttpdConfigFile
{
    my $rs = iMSCP::File->new(
        filename => "$CWD/vendor/imscp/rainloop/src/nginx.conf"
    )->copyFile( '/etc/nginx/imscp_rainloop.conf' );
    return $rs if $rs;

    my $file = iMSCP::File->new(
        filename => '/etc/nginx/imscp_rainloop.conf'
    );
    return 1 unless defined( my $fileC = $file->getAsRef());

    ${ $fileC } = process( { GUI_ROOT_DIR => $CWD }, ${ $fileC } );

    $file->save();
}

=item _setupDatabase( )

 Setup datbase for RainLoop

 Return int 0 on success, other on failure

=cut

sub _setupDatabase
{
    my ( $self ) = @_;

    local $@;
    my $rs = eval {
        local $self->{'dbh'}->{'RaiseError'} = TRUE;

        my $database = ::setupGetQuestion( 'DATABASE_NAME' ) . '_rainloop';

        $self->{'dbh'}->do(
            "
                CREATE DATABASE IF NOT EXISTS `$database`
                CHARACTER SET utf8 COLLATE utf8_unicode_ci
            "
        );

        my $schemaVersion = 0;

        if ( $self->{'dbh'}->selectrow_hashref(
            "SHOW TABLES FROM `$database` LIKE 'rainloop_system'"
        ) ) {
            my $row = $self->{'dbh'}->selectrow_hashref(
                "
                    SELECT `value_int`
                    FROM `$database`.`rainloop_system`
                    WHERE `sys_name` = 'mysql-ab-version_version'
                "
            );
            $schemaVersion = $row->{'value_int'} if $row;
        }

        for my $schemaUpdate (
            sort { $a cmp $b } iMSCP::Dir->new(
                dirname => "$CWD/vendor/imscp/rainloop/src/sql"
            )->getFiles()
        ) {
            ( my $schemaUpdateVersion ) = $schemaUpdate =~ /^0+(.*)\.sql$/;

            next if $schemaVersion >= $schemaUpdateVersion;

            my $rs = execute(
                '/usr/bin/mysql ' . escapeShell( $database ) . ' < '
                    . escapeShell( "$CWD/vendor/imscp/rainloop/src/sql/$schemaUpdate" ),
                \my $stdout,
                \my $stderr
            );
            debug( $stdout ) if length $stdout;
            error( $stderr || 'Unknown error' ) if $rs;
            return $rs if $rs;

            $schemaVersion = $schemaUpdateVersion;
        }
    };
    if ( $@ ) {
        error( $@ );
        $rs = 1;
    }

    $rs;
}

=item _setupSqlUser( )

 Setup SQL user for RainLoop 

 Return int 0 on success, other on failure

=cut

sub _setupSqlUser
{
    my ( $self ) = @_;

    local $@;
    eval {
        my $database = ::setupGetQuestion( 'DATABASE_NAME' ) . '_rainloop';
        my $databaseUserHost = ::setupGetQuestion( 'DATABASE_USER_HOST' );
        my $sqlServer = Servers::sqld->factory();

        for my $host (
            $::imscpOldConfig{'DATABASE_USER_HOST'},
            $databaseUserHost
        ) {
            next unless length $host;
            $sqlServer->dropUser( $self->{'_rainloop_sql_user'}, $host );
        }

        $sqlServer->createUser(
            $self->{'_rainloop_sql_user'},
            $databaseUserHost,
            $self->{'_rainloop_control_user_passwd'}
        );

        local $self->{'dbh'}->{'RaiseError'} = TRUE;

        # Grant 'all' privileges on the imscp_rainloop database
        $self->{'dbh'}->do(
            "
                GRANT ALL PRIVILEGES ON `@{ [ $database =~ s/([%_])/\\$1/gr ] }`.*
                TO ?\@?
            ",
            undef,
            $self->{'_rainloop_sql_user'},
            $databaseUserHost
        );

        # Grant 'select' privileges on the imscp.mail table
        # No need to escape wildcard characters.
        # See https://bugs.mysql.com/bug.php?id=18660
        $self->{'dbh'}->do(
            "
                GRANT SELECT (`mail_addr`, `mail_pass`), UPDATE (`mail_pass`)
                ON `@{ [ ::setupGetQuestion( 'DATABASE_NAME' ) ] }`.`mail_users`
                TO ?\@?
            ",
            undef,
            $self->{'_rainloop_sql_user'},
            $databaseUserHost
        );
    };
    if ( $@ ) {
        error( $@ );
        return 1;
    }

    0;
}

=back

=head1 AUTHOR

 Laurent Declercq <l.declercq@nuxwin.com>

=cut

1;
__END__
