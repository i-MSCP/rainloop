ALTER TABLE `rainloop_ab_properties` CHANGE `prop_value` `prop_value` TEXT NOT NULL;
ALTER TABLE `rainloop_ab_properties` CHANGE `prop_value_custom` `prop_value_custom` TEXT NOT NULL;
ALTER TABLE `rainloop_ab_properties` CHANGE `prop_value_lower` `prop_value_lower` TEXT NOT NULL;

DELETE FROM `rainloop_system` WHERE `sys_name` = 'mysql-ab-version_version' AND value_int <= 3;
INSERT INTO `rainloop_system` (`sys_name`, `value_int`) VALUES ('mysql-ab-version_version', 3);
