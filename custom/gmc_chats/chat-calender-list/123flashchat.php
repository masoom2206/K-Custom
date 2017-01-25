<?php

define( 'IPB_THIS_SCRIPT', 'public' );
define( 'IPB_LOAD_SQL'   , 'queries' );


require_once( '123flashchat/init.php' );
require_once "123flashchat/ipsclass.php";
require_once "123flashchat/class_session.php";
//require_once "conf_global.php";

require_once "123flashchat/functions_chat.php";
require_once('123flashchat/flashchatconf/config.php');
$browser	= App::request_browser() ;
$q	= App::orig_request() ;

$browser	= App::request_browser() ;
print "browser";
print "<pre>";print_r($browser);exit;

if( isset($q['query']['open_url']) ) {
	$url	= $q['query']['open_url'] ;
?><html>
<head>
<title>Gmc Chat</title>
<style type="text/css">
html, body, iframe{
	width:100%;
	height:100%;
	overflow:hidden;
	margin:0px;
	padding:0px;
}
</style>
</head>
<body>
<iframe src="<?php echo $url;?>"  marginwidth=0 marginheight=0 frameborder=0></iframe>
</body>
</html>
<?php
exit;
}

/*$ipsclass    = new ipsclass();
$ipsclass->vars = $INFO;
$ipsclass->init_db_connection();
$ipsclass->sess             =  new session();
$ipsclass->sess->ipsclass   =& $ipsclass;
$ipsclass->member     = $ipsclass->sess->authorise();

if( isset($_GET['online']) ){
	$list	= chat_getChattersFromLocalServer( $chat_data_path ) ;
	var_dump($list) ;
	exit;
}

if( !empty($INFO['sql_port']) ) {
    $INFO['sql_host']   .= ':' . $INFO['sql_port'] ;
}

$tableprefix = $INFO['sql_tbl_prefix'];

$conn = mysql_connect($INFO['sql_host']	, $INFO['sql_user'], $INFO['sql_pass']);
mysql_select_db($INFO['sql_database'],$conn);
$sql = "SELECT converge_pass_salt, converge_pass_hash FROM " . $tableprefix . "members_converge c Join " . $tableprefix . "members m ON c.converge_id=m.id and name = '".$ipsclass->member['name']."'";
$rs = mysql_query($sql);
$result = mysql_fetch_assoc($rs);
$password = $result['converge_pass_hash'];

if($ipsclass->member['name'] !=''){
	$user = "&init_user=".rawurlencode($ipsclass->member['name'])."&init_password=".rawurlencode($password);
}

if($running_mode==1){
	$chat_params = "init_room=1&init_group=".$chat_group.$user;
} else if($running_mode==2){
	exit;
}

if( 0 && App::is_local() ) {
	$host	= 'http://chat.jundee.2288.org:35555/htmlchat/123flashchat.html' ;
} else {
	$host	= 'http://guitarmasterclass.net:35555/htmlchat/123flashchat.html' ;
}
$html5_url	= $host . '?init_host=' . $primary_server_host . 'init_port=' . $primary_server_port . '&init_host_s=' . $primary_server_host . '&init_host_h=' . $primary_server_host . '&' . $chat_params ;
$swf_url	= $chat_client_root_path . $swf_file_name . '?init_root=' . $chat_client_root_path . '&init_host=' . $primary_server_host . '&init_port=' . $primary_server_port . '&' . $chat_params ;

$_rq		= App::orig_referer();
if(  $browser['mobile']  ) {
	echo '(function(path){ var el = new Element("iframe", {src: path, width:"100%", height:500, marginwidth:0, marginheight:0, frameborder:0 }); el.inject("gmc_123flash_box"); })(', json_encode($html5_url) ,');';
	exit;
} 

if( $browser['name'] == 'ie' || isset($q['query']['use_flash_chat']) ) {
	$url	= $swf_url ;
	//echo '(function(path){ var swf = new Swiff(path , {width:"100%" ,  height:500}); swf.inject("gmc_123flash_box");})(', json_encode($swf_url ) ,');';
} else {
	$url	= $html5_url ;
	//echo '(function(path){ var el = new Element("iframe", {src: path, width:"100%", height:500, marginwidth:0, marginheight:0, frameborder:0 }); el.inject("gmc_123flash_box"); })(', json_encode($url) ,');';
}*/

if( isset($q['query']['embed']) ){
	echo '(function(path){
		var el = new Element("iframe", {src: path, width:"100%", height:500, marginwidth:0, marginheight:0, frameborder:0 }); el.inject("gmc_123flash_box"); 
		document.id("chat_new_win").addEvent("click", function(evt){
			try{ document.id("gmc_123flash_box").destroy() ; } catch(e){};
			window.open ( path , "newwindow", "height=600,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=yes, location=no, status=no");
		});
	})(', json_encode($url) ,');';
	exit;
}
?>
window.addEvent('domready', function(){
	var chat_url	= <?php echo json_encode( $_SERVER['REQUEST_URI'] . '?open_url=' . urlencode($url) ) ; ?>;
	var el	= document.id('open_gmc_123flash_box');
	el.setStyle('display', '');
	el.addEvent('click', function(){
		window.open ( chat_url , "newwindow", "height=600,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=yes, location=no, status=no");
	});
});


