<?php 
//print '<pre>';
//print_r($variables);

  global $base_url, $user;
  if(is_numeric(arg(1))) {
	  $uid = arg(1);
  }
  else {
	  $name = str_replace("-", " ", arg(1));
	  $uid = get_user_id($name);
  }
  $account = user_load($variables[0]->comment_by_member_id);
  $name = '';
  if(isset($account->field_first_name['und'][0]['value'])) {
	$name = $account->field_first_name['und'][0]['value'].' '.$account->field_last_name['und'][0]['value'];
  }
  if (empty($name)) {
     $name = $account->name;
  }
  if(isset($account->picture->uri)) {
	$picture = theme('image_style', array('style_name' => '50x50', 'path' => $account->picture->uri));
  }
  else {
	$picture = '<img typeof="foaf:Image" src="/sites/default/files/pictures/default-user-image.png" width="50" height="50" alt="">';
  }
?>
<div id="pp-comment-entry-<?php echo $variables[0]->comment_id ?>" class="pp-mini-content-entry-noheight">
	<div class="pp-tiny-text">
		<div class="pp-image-mini-wrap-floatright">
			<?php echo $picture; ?>
		</div>
		<img border="0" alt="" style="vertical-align:top" id="pp-entry-gender-img-2" src="<?php echo $base_url.'/'.path_to_theme()?>/images/gender_male.png">
		<a href="<?php echo $base_url?>/user/<?php echo $variables[0]->comment_by_member_id ?>"><?php echo $name ?></a>
		<br>
		<?php echo $variables[0]->comment_content ?>
		<br>
		<?php if($uid == $user->uid || $user->uid == 1) { ?>
			<a onclick="delete_comment('<?php echo $variables[0]->comment_id ?>', <?php echo $uid; ?>); return false" href="#"><img border="0" title="Delete Comment" id="pp-comment-delete-34" style="vertical-align:bottom;" src="<?php echo $base_url.'/'.path_to_theme()?>/images/comment_remove.gif"></a>
		<?php } ?>
		<?php echo date('F j, Y', $variables[0]->comment_date)?>
	</div>
</div>

