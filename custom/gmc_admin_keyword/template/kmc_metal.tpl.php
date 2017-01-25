<?php
	$nid = 75116;
	$node_data = node_load($nid);
	global $user,$base_url;
	//print "<pre>";print_r($node_data);exit;
?>

<!--File List-->
<table width="679" height="29" border="0" align="center" cellspacing="0">
	<tbody>
		<tr>
			<td>
				<p>&nbsp;</p>
				<p align="center">You may freely spread these files as long as credit is given to KMC Metal</p>
				<table width="651" height="309" border="0" cellspacing="0" bgcolor="#F3F3F3" style="margin-left:30px; padding:6px;">
					<tbody>
						<tr>
							<td width="291" valign="top">
								<table width="238" border="0" align="left" cellspacing="0" style="padding:5px;">
									<tbody>
										<tr>
											<td width="236" bgcolor="#D5D5D5" style="padding:10px;"><p><strong>Downloadable MP3s</strong></p></td>
										</tr>
										<?php
										foreach($node_data->field_upload_files['und'] as $files) {
											$filesize = number_format($files['filesize']/(1024*1024), 2, '.', '');
											$type = $filename = substr($files['filename'], -3);
											if($type == 'zip') {
												$filename = 'All Songs, ZIP file';
											}
											else {
												$filename = substr($files['filename'], 0, -4);
												$filename = str_replace('_', ' ', $filename);
												$filename = str_replace('  ', ' ', $filename);
											}
											$filepath = file_create_url($files['uri']);
										?>
										<tr>
											<td style="padding:10px;"><a href="<?php print $filepath; ?>"><?php print $filename; ?></a> ( <?php print $filesize; ?>MB )</td>
										</tr>
										<?php
										}
										?>
									</tbody>
								</table>
							</td>
							<td width="318"><img src="/sites/all/themes/gmc_v2/images/kmc-metal.jpg" width="200" height="200" border="2" align="right"></td>
						</tr>
						<tr>
							<td valign="top">&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						<tr bgcolor="#E5E5E5">
							<td colspan="2" valign="top" style="padding:10px;">
								<p><strong>Don't miss:</strong></p>
								<p><a href="http://www.myspace.com/kmcmetalmusic">Myspace</a> - <a href="http://www.youtube.com/user/kmcmetal">Youtube</a> - <a href="#">KMC Metal Blog</a> - <a href="/gmc-search?title=&tags_tid=&uid=Marcus Lavendell">Marcus Lessons</a> - <a href="/personal-board/23776">Marcus Board</a> - <a href="/gmc-search?title=&tags_tid=&uid=Kristofer Dahl">Kris Lessons</a> - <a href="/personal-board/23710">Kris Board </a></p>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>
<!--Comment List Label-->
<table width="674" height="39" border="0" align="center" cellpadding="0" cellspacing="0">
	<tbody>
		<tr>
			<td background="/sites/all/themes/gmc_v2/images/bar_lang.gif">
				<h2><span class="huvudtext18"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lesson Questions, Feedback &amp; Comments </strong></span></h2>
			</td>
		</tr>
	</tbody>
</table>
<br/><br/>
<!--Comment List-->
<table width="674" height="39" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
	<tbody>
		<tr>
			<td valign="top">
				<br><br>
				<table>
					<tbody>
						<tr>
							<td>
								<table class="ipbtable" cellspacing="1">
									<tbody>
									<?php 
									$comment_detail = kmc_comment_load($nid);
									foreach($comment_detail as $comments) {
										if(trim($comments->comment_body_value) != '' && trim($comments->comment_body_value) != '---') {
										$comments->comment_body_value = str_replace('style_emoticons/<#EMO_DIR#>', '../sites/all/themes/gmc_v2/images/smile', $comments->comment_body_value);
										$comments->comment_body_value = str_replace('<img border="0" alt="smile.gif" emoid=":)" style="vertical-align:middle" src="style_emoticons/&lt;#EMO_DIR#&gt;/smile.gif">', '*smile*', $comments->comment_body_value);
										$comments->comment_body_value = str_replace('/guitar_forum/style_emoticons/default', '../sites/all/themes/gmc_v2/images/smile', $comments->comment_body_value);

										$user_detail = user_load($comments->uid);
										if(isset($user_detail->picture->uri)) {
											$user_picyure = file_create_url($user_detail->picture->uri);
										}
										else {
											$user_picyure = '/sites/default/files/pictures/default-user-image.png';
										}
									?>
										<tr>
											<td valign="middle" class="row2" width="1%">
												<span class="normalname"><a href="user/<?php print $comments->uid; ?>" style="color:#bbb;"><?php print $user_detail->name; ?></a></span>
											</td>
											<td class="row2" valign="top" width="99%">
												<div style="float: left;">
													<span class="postdetails"> <img src="/sites/all/themes/gmc_v2/images/to_post_off.gif" alt="post" border="0" style="padding-bottom:2px; padding-right: 3px;"><?php print date("jS F Y", $comments->created); ?></span>
												</div>
											</td>
										</tr>
										<tr>
											<td valign="top" class="post2" width="25%">
												<span class="postdetails"> <img src="<?php print $user_picyure;?>" border="0" width="90" height="90" alt=""><br><br>Member<br></span><br>
												<img src="/sites/all/themes/gmc_v2/images/spacer.gif" alt="" width="160" height="1" style=" width: 160px; height: 1px; "><br>
											</td>
											<td width="75%" valign="top" class="post2" id="post-main-16989">
												<div class="postcolor"><?php print $comments->comment_body_value; ?></div>						  
											</td>
										</tr>
									<?php
										}
									}
									?>
									</tbody>
								</table>
								<?php if($user->uid == 0) {?>
								<br><br>
								<strong style="text-decoration:underline;">Login in the top right corner </strong> to write a comment.
								<?php } else {
									//print drupal_render(drupal_get_form("comment_node_forum_form", (object) array('nid' => $nid)));
									$form = drupal_get_form('kmc_metal_comment_form');
									print drupal_render($form);
								 } ?>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>