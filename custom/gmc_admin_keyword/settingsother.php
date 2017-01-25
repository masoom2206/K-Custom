<?php
function generate_lessonviewer_xml() {
header("Pragma: public", false);
header("Expires: Thu, 19 Nov 1981 08:52:00 GMT", false);
header("Cache-Control: must-revalidate, post-check=0, pre-check=0", false);
header("Cache-Control: no-store, no-cache, must-revalidate", false);
header("Content-Type: text/xml");
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<options videoPath="/sites/all/modules/custom/gmc_admin_keyword/videos/You_ready_song_collaboration_at_Guitar_Masterclass.flv" logoX="10" logoY="170" buffer_time="5">

	<!-- IF FALSE, YOU NEED TO PASS AN IMAGE TO THE SWF FILE-->
	<autostart>true</autostart>	
		
	<logo></logo>
	
	<!-- SET VOLUME: 0 to 100 -->
	<volume>50</volume>
	
	<!-- SET THE TEXT AT THE END -->
	<text><![CDATA[Thank you for watching!]]></text>		

</options>
<?php exit; 
}
?>