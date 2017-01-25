<?php
	$node_detail = node_load($nid);
	$backing_track = $node_detail->field_backing_track;
?>
<table border="1" align="center" cellspacing="0" class="gulram">
	<tbody>
		<tr>
			<td width="143" bgcolor="#F9EFBA">
				<div id="wimpyTarget">
					<embed type="application/x-shockwave-flash" src="/sites/all/modules/custom/gmc_user_signup/flash/wimpy.swf?cachebust=1396433167037" width="200" height="15" style="undefined" id="wimpy" name="wimpy" bgcolor="#000000" quality="high" scale="noscale" salign="lt" allowscriptaccess="always" allowfullscreen="true" menu="false" flashvars="wimpyReg=NyUzQVpseUwlMjRfJTdEJTgwUGJiUWxlJTQwJTI5WSU4NTFMcVklN0NXWUtDQjQlM0Itd3BLS3MlM0I4&amp;wimpyApp=wimpy.php&amp;wimpySkin=/sites/all/modules/custom/gmc_user_signup/flash/skin_simple_bar.xml&amp;playlist=/sites/all/modules/custom/gmc_user_signup/flash/Marty_arpeggios_fast.mp3">
				</div>
				<script language="JavaScript">
					makeWimpyPlayer("/sites/all/modules/custom/gmc_user_signup/flash/Marty_arpeggios_fast.mp3");
				</script>
			</td>
		</tr>
		<tr>
			<td bgcolor="#FEFDF3">
			<?php
				foreach($backing_track['und'] as $file) {
					$url = file_create_url($file['uri']);
					$filename = substr($file['filename'], 0, -4);
					$filename = ucwords(str_replace("-", " ", $filename));
			?>
				<p>
					<span class="huvudtext14">
						<img src="/sites/all/themes/gmc_v2/images/play.gif" width="36" height="31" align="absbottom">
						<a href="javascript:nothing();" onclick="wimpy_clearPlaylist();wimpy_loadAndPlay('<?php print $url;?>', '', 'Backing ', '', '');"><?php print $filename;?></a></span>
				</p>
			<?php
				}
			?>
			</td>
		</tr>
	</tbody>
</table>

