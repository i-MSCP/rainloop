<?php
/**
 * Copyright (C) 2015-2017 Laurent Declercq <l.declercq@nuxwin.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Class ImscpChangePasswordPlugin
 */
class ImscpChangePasswordPlugin extends \RainLoop\Plugins\AbstractPlugin
{
    /**
     * Initialization
     *
     * @return void
     */
    public function Init()
    {
        $this->addHook('main.fabrica', 'MainFabrica');
    }

    /**
     * Check for requirements
     *
     * @return string
     */
    public function Supported()
    {
        if (!extension_loaded('pdo') || !class_exists('PDO')) {
            return 'The PHP extension PDO (mysql) must be installed to use this plugin';
        }

        $aDrivers = \PDO::getAvailableDrivers();
        if (!is_array($aDrivers) || !in_array('mysql', $aDrivers)) {
            return 'The PHP extension PDO (mysql) must be installed to use this plugin';
        }

        return '';
    }

    /**
     * Setup
     *
     * @param string $sName
     * @param mixed $oProvider
     */
    public function MainFabrica($sName, &$oProvider)
    {
        switch ($sName) {
            case 'change-password':
                $sDsn = \trim($this->Config()->Get('plugin', 'pdo_dsn', ''));
                $sUser = (string)$this->Config()->Get('plugin', 'user', '');
                $sPassword = (string)$this->Config()->Get('plugin', 'password', '');

                if (!empty($sDsn) && 0 < \strlen($sUser) && 0 < \strlen($sPassword)) {
                    include_once __DIR__ . '/ImscpChangePasswordDriver.php';

                    $oProvider = new ImscpChangePasswordDriver();
                    $oProvider->SetLogger($this->Manager()->Actions()->Logger());
                    $oProvider->SetConfig($sDsn, $sUser, $sPassword);
                    $oProvider->SetAllowedEmails(\strtolower(\trim($this->Config()->Get('plugin', 'allowed_emails', ''))));
                }

                break;
        }
    }

    /**
     * Configuration mapping
     *
     * @return array
     */
    public function configMapping()
    {
        return array(
            \RainLoop\Plugins\Property::NewInstance('pdo_dsn')
                ->SetLabel('i-MSCP PDO dsn')
                ->SetType(\RainLoop\Enumerations\PluginPropertyType::STRING)
                ->SetDefaultValue('mysql:host=localhost;port=3306;dbname=imscp'),
            \RainLoop\Plugins\Property::NewInstance('user')
                ->SetLabel('i-MSCP DB User')
                ->SetType(\RainLoop\Enumerations\PluginPropertyType::STRING)
                ->SetDefaultValue('rainloop_user'),
            \RainLoop\Plugins\Property::NewInstance('password')
                ->SetLabel('i-MSCP DB Password')
                ->SetType(\RainLoop\Enumerations\PluginPropertyType::PASSWORD)
                ->SetDefaultValue(''),
            \RainLoop\Plugins\Property::NewInstance('allowed_emails')
                ->SetLabel('Allowed emails')
                ->SetType(\RainLoop\Enumerations\PluginPropertyType::STRING_TEXT)
                ->SetDescription('Allowed emails, space as delimiter, wildcard supported. Example: user1@domain1.net user2@domain1.net *@domain2.net')
                ->SetDefaultValue('*')
        );
    }
}
