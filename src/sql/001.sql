CREATE TABLE IF NOT EXISTS `rainloop_system` (
  `sys_name` varchar(50) NOT NULL,
  `value_int` int UNSIGNED NOT NULL DEFAULT 0,
  `value_str` varchar(128) NOT NULL DEFAULT '',
  INDEX `sys_name_rainloop_system_index` (`sys_name`)
) /*!40000 ENGINE=INNODB *//*!40101 CHARACTER SET utf8 COLLATE utf8_general_ci */;

CREATE TABLE IF NOT EXISTS `rainloop_users` (
  `id_user` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `rl_email` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY(id_user),
  INDEX `rl_email_rainloop_users_index` (`rl_email`)
) /*!40000 ENGINE=INNODB */;

CREATE TABLE IF NOT EXISTS `rainloop_ab_contacts` (
  `id_contact` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_contact_str` varchar(128) NOT NULL DEFAULT '',
  `id_user` int UNSIGNED NOT NULL,
  `display` varchar(255) NOT NULL DEFAULT '',
  `changed` int UNSIGNED NOT NULL DEFAULT 0,
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `etag` varchar(128) /*!40101 CHARACTER SET ascii COLLATE ascii_general_ci */ NOT NULL DEFAULT '',
  PRIMARY KEY (`id_contact`),
  INDEX `id_user_rainloop_ab_contacts_index` (`id_user`)
)/*!40000 ENGINE=INNODB *//*!40101 CHARACTER SET utf8 COLLATE utf8_general_ci */;

CREATE TABLE IF NOT EXISTS `rainloop_ab_properties` (
  `id_prop` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_contact` bigint UNSIGNED NOT NULL,
  `id_user` int UNSIGNED NOT NULL,
  `prop_type` tinyint UNSIGNED NOT NULL,
  `prop_type_str` varchar(255) /*!40101 CHARACTER SET ascii COLLATE ascii_general_ci */ NOT NULL DEFAULT '',
  `prop_value` varchar(255) NOT NULL DEFAULT '',
  `prop_value_custom` varchar(255) NOT NULL DEFAULT '',
  `prop_frec` int UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY(`id_prop`),
  INDEX `id_user_rainloop_ab_properties_index` (`id_user`),
  INDEX `id_user_id_contact_rainloop_ab_properties_index` (`id_user`, `id_contact`),
  INDEX `id_contact_prop_type_rainloop_ab_properties_index` (`id_contact`, `prop_type`)
)/*!40000 ENGINE=INNODB *//*!40101 CHARACTER SET utf8 COLLATE utf8_general_ci */;

DELETE FROM `rainloop_system` WHERE `sys_name` = 'mysql-ab-version_version' AND value_int <= 1;
INSERT INTO `rainloop_system` (`sys_name`, `value_int`) VALUES ('mysql-ab-version_version', 1);
