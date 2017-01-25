<?php
global $base_url,$user;
$path = $base_url."/sites/all/themes/gmc_v2";
if($user->uid > 0) {
	$body = str_replace('<a href="#" onclick="alert(\'Log in to cancel your GMC subscription\');"><u>anytime</u></a>', '<a href="/user/'.$user->uid.'/subscription/status"><u>anytime</u></a>', $body);
}
//$user_form = drupal_render(drupal_get_form('user_gmc_signup_form'));
//$user_form = drupal_get_form('user_gmc_signup_form');
//print "<pre>";print_r($user_form);exit;
?>
<?php if($user->uid != 0) {?>
	<h1 class="signup-title"><img src="/font/Renew+Your+Membership/20/" alt="Renew Your Membership" ></h1>
<?php } else { ?>
	<h1 class="signup-title"><img src="/font/Sign+up+for+GMC/20/" alt="Sign up for GMC" ></h1>
<?php } ?>
<div id="signup-page" class="column three-forth">
	<div class="column one-half">
		<div class="padding">
			<?php $form = drupal_get_form('user_gmc_signup_form'); print drupal_render($form); ?>
			<div style="display:none;">
				<?php //print drupal_render_children($user_form); ?>
			</div>
		</div>
	</div>
	<div class="column one-half">
		<div class="padding">
			<div class="content-block">
				<h2 class="font">
					<img src="/font/Features+for+members/12/" alt="Features for members" >
				</h2>
				<div class="top"></div>
				<div class="sign-up-list">
					<?php print $body; ?>
				</div>
			</div>
		</div>
	</div>
</div>
<!--<div class="column one-forth">
	<div class="padding">
	</div>
</div>-->