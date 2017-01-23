<?php
//print "<pre>";print_r($var);exit;
global $user;
?>
<div class="">
		<div class="padding">
			<div class="content-block">
				<h2><img src="<?php echo file_create_url('font'); ?>/Latest forum posts/12"></h2>
				<div class="top"></div>
				<ul class="forum-list">
					<?php foreach($var as $key => $data) {
						if(!empty($data['cid'])) {
							$link = '/guitar_forum_topic/'.$data['nid'].'?page='.$data['total_pages'].'#entry'.$data['cid'];
						}
						else {
							$link = '/guitar_forum_topic/'.$data['nid'];
						}
					?>
						<li <?php if ($key == 6) { ?>class="last"<?php } ?>>							
							<strong><a href="<?php print $link; ?>"><?php echo $data['title']; ?></a></strong>
							<cite><a href="<?php echo url('guitar_forum_topic/'.$data['nid']); ?>"><?php echo $data['terms']; ?></a></cite>
						</li>
					<?php } ?>
				</ul>
			</div>
		</div>
	</div>

