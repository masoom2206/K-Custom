<?php
function generate_lick_xml($nid,$part) {
header("Pragma: public", TRUE);
header("Cache-Control: must-revalidate, post-check=0, pre-check=0", false);
header("Cache-Control: no-store, no-cache, must-revalidate", false);
header("Content-Type: text/xml");
echo '<?xml version="1.0" encoding="UTF-8"?>';
$user_agent = strtolower ( $_SERVER['HTTP_USER_AGENT'] );
$f = file_load($part);
$url = file_create_url($f->uri);


$node_data = node_load($nid);
?>
<lesson>
	<memberaccess>true</memberaccess>
	<lotd>true</lotd>
	<settings>
		<volume>80</volume>
		<bufferTime>7</bufferTime>
		<borderless>true</borderless>
	</settings>
	<video>
	<?php
	foreach($node_data->field_video_upload['und'] as $files) {
		$url_video = file_create_url($files['uri']);
	?>
		<clip quality="medium" width="896" height="504"><?php echo $url_video;  ?></clip>
	<?php } ?>
	</video>
	<backingtracks>
	<?php
	foreach($node_data->field_backtrack_upload['und'] as $files) {
		$url_backtrack = file_create_url($files['uri']);
	?>
		<track title="" downloadable="false"><?php echo $url_backtrack; ?></track>
		<!--<track title="" downloadable="false"><?php //echo file_create_url('backingtrack/'.$nid."/".$files['fid']."/"); ?></track>-->
	<?php } ?>
	</backingtracks>
	<tools>
	</tools>
</lesson>
<?php } ?>