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
 * Class ImscpChangePasswordDriver
 */
class ImscpChangePasswordDriver implements \RainLoop\Providers\ChangePassword\ChangePasswordInterface
{
    const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    /**
     * @var string
     */
    private $sDsn = '';

    /**
     * @var string
     */
    private $sUser = '';

    /**
     * @var string
     */
    private $sPassword = '';

    /**
     * @var string
     */
    private $sAllowedEmails = '';

    /**
     * @var \MailSo\Log\Logger
     */
    private $oLogger = NULL;

    /**
     * Set config
     *
     * @param string $sDsn
     * @param string $sUser
     * @param string $sPassword
     * @return \ImscpChangePasswordDriver
     */
    public function SetConfig($sDsn, $sUser, $sPassword)
    {
        $this->sDsn = $sDsn;
        $this->sUser = $sUser;
        $this->sPassword = $sPassword;
        return $this;
    }

    /**
     * Set allowed emails
     *
     * @param string $sAllowedEmails
     * @return \ImscpChangePasswordDriver
     */
    public function SetAllowedEmails($sAllowedEmails)
    {
        $this->sAllowedEmails = $sAllowedEmails;
        return $this;
    }

    /**
     * Set logger
     *
     * @param \MailSo\Log\Logger $oLogger
     * @return \ImscpChangePasswordDriver
     */
    public function SetLogger($oLogger)
    {
        if ($oLogger instanceof \MailSo\Log\Logger) {
            $this->oLogger = $oLogger;
        }

        return $this;
    }

    /**
     * Check for password change possibility
     *
     * @param \RainLoop\Account $oAccount
     * @return bool
     */
    public function PasswordChangePossibility($oAccount)
    {
        return $oAccount
            && $oAccount->Email()
            && \RainLoop\Plugins\Helper::ValidateWildcardValues($oAccount->Email(), $this->sAllowedEmails);
    }

    /**
     * Change password
     *
     * @param \RainLoop\Account $oAccount
     * @param string $sPrevPassword Previous password
     * @param string $sNewPassword New password
     * @return bool TRUE on success, FALSE on failure
     */
    public function ChangePassword(\RainLoop\Account $oAccount, $sPrevPassword, $sNewPassword)
    {
        if ($this->oLogger) {
            $this->oLogger->Write('iMSCP: Try to change password for ' . $oAccount->Email());
        }

        $bResult = false;

        if (!empty($this->sDsn) && 0 < \strlen($this->sUser) && 0 < \strlen($this->sPassword) && $oAccount) {
            try {
                $oPdo = new \PDO($this->sDsn, $this->sUser, $this->sPassword);
                $oPdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
                $oStmt = $oPdo->prepare('SELECT mail_pass, mail_addr FROM mail_users WHERE mail_addr = ? LIMIT 1');

                if ($oStmt->execute(array($oAccount->IncLogin())) && $oStmt->rowCount()) {
                    $aFetchResult = $oStmt->fetch(\PDO::FETCH_ASSOC);
                    $sDbPassword = \stripslashes($aFetchResult['mail_pass']);
                    $sPrevPassword = \stripslashes($sPrevPassword);

                    if ($this->PasswordVerify($sPrevPassword, $sDbPassword)) { # sha512 password (i-MSCP >= 1.4.x)
                        $sNewPassword = $this->HashPassword($sNewPassword);
                    } elseif ($sDbPassword !== $sDbPassword) { # Plain password ( iMSCP < 1.4.x)
                        return $bResult;
                    }

                    $oStmt = $oPdo->prepare('UPDATE mail_users SET mail_pass = ? WHERE mail_addr = ?');
                    $bResult = (bool)$oStmt->execute(array($sNewPassword, $aFetchResult['mail_addr']));
                }
            } catch (\Exception $oException) {
                if ($this->oLogger) {
                    $this->oLogger->WriteException($oException);
                }
            }
        }

        return $bResult;
    }

    /**
     * Generates a secure random string
     *
     * @throws \InvalidArgumentException|\RuntimeException
     * @param int $length Expected string length
     * @param string $charList character list to use for string generation (default is Base 64 character set)
     * @return string
     */
    private function RandomStr($length, $charList = self::BASE64)
    {
        if (!\extension_loaded('openssl')) {
            throw new \RuntimeException('OpenSSL extension is not available');
        }

        $length = (int)$length;
        if ($length < 1) {
            throw new \InvalidArgumentException('Length parameter value must be >= 1');
        }

        $listLen = \strlen($charList);
        if ($listLen == 1) {
            return \str_repeat($charList, $length);
        }

        $bytes = \openssl_random_pseudo_bytes($length);
        $pos = 0;
        $str = '';

        for ($i = 0; $i < $length; $i++) {
            $pos = ($pos + \ord($bytes[$i])) % $listLen;
            $str .= $charList[$pos];
        }

        return $str;
    }

    /**
     * Create a hash of the given password using the SHA-512 algorithm
     *
     * @param string $password The password to be hashed
     * @return string
     */
    private function HashPassword($password)
    {
        return \crypt($password, '$6$rounds=' . \sprintf('%1$04d', \rand(3000, 5000)) . '$' . static::RandomStr(16));
    }

    /**
     * Timing attack safe string comparison
     *
     * @see hash_equals()
     * @param string $knownString The string of known length to compare against
     * @param string $userString The user-supplied string
     * @return bool
     */
    private function HashEqual($knownString, $userString)
    {
        $knownString = (string)$knownString;
        $userString = (string)$userString;

        if (\function_exists('hash_equals')) {
            return \hash_equals($knownString, $userString);
        }

        $lenExpected = \strlen($knownString);
        $lenActual = \strlen($userString);
        $len = \min($lenExpected, $lenActual);
        $result = 0;

        for ($i = 0; $i < $len; $i++) {
            $result |= \ord($knownString[$i]) ^ \ord($userString[$i]);
        }

        $result |= $lenExpected ^ $lenActual;
        return ($result === 0);
    }

    /**
     * Verify the given password against the given hash
     *
     * @throws \InvalidArgumentException
     * @param string $password The password to be checked
     * @param string $hash The hash to be checked against
     * @return bool
     */
    private function PasswordVerify($password, $hash)
    {
        return $this->HashEqual($hash, \crypt($password, $hash));
    }
}
