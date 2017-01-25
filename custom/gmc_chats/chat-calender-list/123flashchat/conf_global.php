<?php
$INFO['admin_group']			=	'4';
$INFO['auth_group']			=	'1';
$INFO['board_start']			=	'1161091254';
$INFO['board_url']			=	'http://' . $_SERVER['HTTP_HOST'] . '/guitar_forum';
$INFO['conv_chosen']			=	'phpbb2';
$INFO['conv_configured']			=	'1';
$INFO['conv_forums']			=	'1';
$INFO['conv_members']			=	'1';
$INFO['conv_pms']			=	'1';
$INFO['conv_polls']			=	'1';
$INFO['conv_posts']			=	'1';
$INFO['conv_ranks']			=	'1';
$INFO['conv_topics']			=	'1';
$INFO['default_language']			=	'en';
$INFO['guest_group']			=	'2';
$INFO['hb_attach_dir']			=	'';
$INFO['hb_server_path']			=	'/home/admin/domains/guitarmasterclass.net/phpBB2_2/';
$INFO['hb_sql_database']			=	'admin_gmc';
$INFO['hb_sql_host']			=	'localhost';

$INFO['hb_sql_tbl_prefix']			=	'phpbb_';
$INFO['hb_upload_dir']			=	'';
$INFO['installed']			=	'1';
$INFO['member_group']			=	'3';
$INFO['mysql_tbl_type']			=	'MyISAM';
$INFO['per_attach']			=	'100';
$INFO['per_members']			=	'2000';
$INFO['per_posts']			=	'1500';
$INFO['per_topics']			=	'2000';
$INFO['php_ext']			=	'php';
$INFO['safe_mode']			=	'0';
$INFO['sql_host']			=	'localhost';
$INFO['sql_database']			=	'admin_gmc';
$INFO['sql_debug']			=	'1';
$INFO['sql_driver']			=	'mysql';
$INFO['sql_tbl_prefix']			=	'ibf_';
$INFO['upload_dir']			=	'';

if(is_file($_SERVER['DOCUMENT_ROOT'] . '/../internals/dbsettings.php')) {

	global $SQLsettings;
	include($_SERVER['DOCUMENT_ROOT'] . '/../internals/dbsettings.php');
	if(isset($SQLsettings) && isset($SQLsettings['user']) && isset($SQLsettings['pass'])) {

		$INFO['hb_sql_user']	=	$SQLsettings['user'];
		$INFO['hb_sql_pass']	=	$SQLsettings['pass'];

		$INFO['sql_user']		=	$SQLsettings['user'];
		$INFO['sql_pass']		=	$SQLsettings['pass'];
		$INFO['sql_port']		=	$SQLsettings['port'];

		if(isset($SQLsettings['host'])) {
			$INFO['hb_sql_host']	=	$SQLsettings['host'];
			$INFO['sql_host']		=	$SQLsettings['host'];
		}
		if(isset($SQLsettings['port'])) {
			$INFO['hb_sql_host_port'] = $SQLsettings['port'];
			$INFO['sql_host_port'] = $SQLsettings['port'];
		}

	} else {
		throw new Exception('Forum found file but not db settings values', 1);
	}
} else {
	throw new Exception('Forum unable to find db settings file', 2);
}

?>