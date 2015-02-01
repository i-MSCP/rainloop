<?php
/**
 * Copyright (C) 2015 Laurent Declercq <l.declercq@nuxwin.com>
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
	private $oLogger = null;

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
		if($oLogger instanceof \MailSo\Log\Logger) {
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
		return $oAccount && $oAccount->Email() && \RainLoop\Plugins\Helper::ValidateWildcardValues(
			$oAccount->Email(), $this->sAllowedEmails
		);
	}

	/**
	 * Change password
	 *
	 * @param \RainLoop\Account $oAccount
	 * @param string $sPrevPassword
	 * @param string $sNewPassword
	 * @return bool
	 */
	public function ChangePassword(\RainLoop\Account $oAccount, $sPrevPassword, $sNewPassword)
	{
		if($this->oLogger) {
			$this->oLogger->Write('iMSCP: Try to change password for ' . $oAccount->Email());
		}

		$bResult = false;

		if(!empty($this->sDsn) && 0 < \strlen($this->sUser) && 0 < \strlen($this->sPassword) && $oAccount) {
			try {
				$oPdo = new \PDO($this->sDsn, $this->sUser, $this->sPassword);
				$oPdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

				$oStmt = $oPdo->prepare('SELECT mail_pass, mail_addr FROM mail_users WHERE mail_addr = ? LIMIT 1');

				if($oStmt->execute(array($oAccount->IncLogin()))) {
					$aFetchResult = $oStmt->fetchAll(\PDO::FETCH_ASSOC);

					if (\is_array($aFetchResult) && isset($aFetchResult[0]['mail_pass'], $aFetchResult[0]['mail_addr'])) {
						$sDbPassword = \stripslashes($aFetchResult[0]['mail_pass']);

						if (\stripslashes($sPrevPassword) === $sDbPassword) {
							$oStmt = $oPdo->prepare('UPDATE mail_users SET mail_pass = ? WHERE mail_addr = ?');
							$bResult = (bool)$oStmt->execute(array($sNewPassword, $aFetchResult[0]['mail_addr']));
						}
					}
				}
			} catch(\Exception $oException) {
				if($this->oLogger) {
					$this->oLogger->WriteException($oException);
				}
			}
		}

		return $bResult;
	}
}
