<?
header("Pragma: public", false);
header("Expires: Thu, 19 Nov 1981 08:52:00 GMT", false);
header("Cache-Control: must-revalidate, post-check=0, pre-check=0", false);
header("Cache-Control: no-store, no-cache, must-revalidate", false);
header("Content-Type: text/xml");

?>
<playlist>
	<item>
		<filename>/<?=$_GET["film"]>/<?=substr($_GET["file"],0,strlen($_GET["file"]))?>.flv</filename>
		<title><?=substr($_GET["rub"],0,strlen($_GET["rub"])-4)?></title>
	</item>
</playlist>