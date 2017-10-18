<?php

if (!defined('APP_VERSION'))
{
	define('APP_VERSION', '1.9.0.325');
	define('APP_INDEX_ROOT_FILE', __FILE__);
	define('APP_INDEX_ROOT_PATH', str_replace('\\', '/', rtrim(dirname(__FILE__), '\\/').'/'));
}

if (!file_exists(APP_INDEX_ROOT_PATH.'rainloop/v/'.APP_VERSION.'/include.php'))
{
	echo '[105] Missing version directory';
	exit(105);
}

include APP_INDEX_ROOT_PATH.'rainloop/v/'.APP_VERSION.'/include.php';
