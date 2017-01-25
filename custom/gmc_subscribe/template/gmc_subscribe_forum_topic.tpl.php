<?php
	global $user;
	$today_date = date('jS F Y - H:i A');
	if(isset($_GET['tid']) && $_GET['tid'] != ''){
		$id = $_GET['tid'];
		$link = '/guitar_forum?showforum='.$id;
		$term_detail = taxonomy_term_load($id);
		$subscribe_title = $term_detail->name;
	}
	else if(isset($_GET['nid']) && $_GET['nid'] != ''){
		$id = $_GET['nid'];
		$link = '/guitar_forum_topic/'.$id;
		$node_detail = node_load($id);
		$subscribe_title = $node_detail->title;
	}
?>
<?php if($user->uid > 0) {?>
<div class="subscribe_forum_topic">
	<div id="ucpcontent">
		<div class="maintitle">Welcome to your control panel </div>
		<div class="formsubtitle">Subscription Information<div id="gfooter_time">Time is now: <?php print $today_date; ?></div></div>
		<div style="padding:4px">
			<b>Forum Subscription: <?php print $subscribe_title; ?></b>
			<div class="desc">Please choose your notification method.<br>Forum subscriptions will notify when new topics have been made and topic subscriptions notify when a reply has been made.</div>
		</div>
		<?php $form = drupal_get_form('gmc_subscribe_forum_topic_form'); print drupal_render($form);?>
	</div>
</div>
<?php } else {?>
<div class="borderwrap error-borderwrap">
	<h3><img src="/sites/all/themes/gmc_v2/images/nav_m.gif" border="0" alt="&gt;" width="8" height="8">&nbsp;Board Message</h3>
	<div class="errorwrap">
		<!--<h4>The error returned was:</h4>
		<p>Sorry, but this function isn't available to guests</p>
	</div>
	<h4>You are not logged in, you may log in at the top right</h4>-->
  <h4>Access denied!</h4>
		<p>Please make sure you are logged in on the site before trying to access this page. <br />If you don't have an account, <?php echo l(t('sign up', 'signup') ); ?> here.</p>
	</div>
	<h4>You are not logged in, you may log in at the top right</h4>
	<br><br>
	<p class="formbuttonrow"><b><a href="<?php print $link;?>">Go Back</a></b></p>
</div>
<?php } ?>
