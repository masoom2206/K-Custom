<?php
global $user,$base_url;
if($user->uid != 0) {
	$referer = md5($user->mail);
}
else {
	$referer = '';
}
$referred_count = get_user_referred_count();
?>
<div class="page-member-info">
	<?php if($user->uid == 0) {?>
	<div class="content-block no-background">
		<h2 class="no-relative"><img src="/font/Bonus+Lessons+and+Referrals/12/" alt="Bonus Lessons and Referrals"></h2>
		<p>By referring a friend to GMC you will get access to <a href="#">bonus lessons</a> and earn cash!</p>
	</div>
	<?php } else {?>
	<h1><img src="/font/GMC+Bonus+Lessons+_and_+Referrals/20/" alt="GMC Bonus Lessons &amp; Referrals"></h1>
	<div class="content-block no-background">
		<img src="/sites/all/themes/gmc_v2/images/referrals-lessons.jpg" style="padding:15px;display:block;">
		<p style="padding: 10px 0px 10px 0px;">
		You can access these lessons  by referring a friend to GMC. Referring a friend is easy, as the link below will give your friend a $10 discount  the first month.
		</p>
		<p style="padding: 10px 0px 10px 0px;">
		For every <strong style="font-weight:bold;">10 friends</strong> you refer  you will also get a <strong style="font-weight:bold;">$150</strong> commission.
		</p>
		<ol class="referal-points-list">
			<li style="list-style-type:decimal;list-style-position:inside;padding:6px;">Give your friend(s) this unique referral link, and inform about the $10 discount (if you have an older referral link, it will count as well)<br>
				<!--<p class="grey-marked-section" style="background-color:#BBBBBB;padding:6px;margin-top:4px;clear:both;"><?php print $base_url; ?>/signup?referer=<?php //print $referer; ?></p>-->
				<p class="grey-marked-section" style="background-color:#BBBBBB;padding:6px;margin-top:2px;clear:both; margin-bottom: 1px;"><?php print $base_url; ?>/signup/<?php print $key; ?></p>
			</li>
			<li style="list-style-type:decimal;list-style-position:inside;padding:6px;">If your friend has signed up through your link, you will get access to the bonus lessons (just return to this page and a red bonus link will appear).</li>
			<li style="list-style-type:decimal;list-style-position:inside;padding:6px;">After 10 referrals you will get your first commission - <a href="#" onclick="javascript:window.open('/referrals-info','','height=650,width=400,left=300,resizable=yes,scrollbars=yes,top=500')" style="text-decoration:underline;">more info &amp; payment details</a>. GMC flyer available <a href="/sites/all/modules/custom/gmc_admin_keyword/doc/referral-flyer.doc"><u>here</u></a> (word document)<p></p></li>
		</ol>
	</div>
	<div class="content-block no-background" style="background-color:#CC6666;">
		<h2><img src="/font/Referrals/12/" alt="Referrals"></h2>
		<?php if($referred_count == 0) {?>
			<p>You have yet to refer your first member!</p>
		<?php } else if($referred_count == 1) {?>
			<p>You have referred 1 member!</p>
		<?php } else {?>
			<p>You have referred <?php print $referred_count;?> members!</p>
		<?php }?>
	</div>
	<?php }?>
</div>