ALTER TABLE `rainloop_ab_properties` ADD `prop_value_lower` varchar(255) NOT NULL DEFAULT '' AFTER `prop_value_custom`;

DELETE FROM `rainloop_system` WHERE `sys_name` = 'mysql-ab-version_version' AND value_int <= 2;
INSERT INTO `rainloop_system` (`sys_name`, `value_int`) VALUES ('mysql-ab-version_version', 2);
