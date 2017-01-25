<?php
	global $user,$theme_path;
	$instructor_count = 0;
	$gmc_member_count = 0;
	$name = '';
  $arg1 = arg(1);
  $arg2 = arg(2);
  $arg3 = arg(3);
  $arg4 = arg(4);
  $arg5 = arg(5) && arg(5) != 'n' ? taxonomy_term_load(arg(5))->name : 'n';
  $arg6 = arg(6) && arg(6) != 'n' ? taxonomy_term_load(arg(6))->name : 'n';
  $arg7 = arg(7);
  $arg8 = arg(8);
  $arg9 = arg(9);
  $arg10 = arg(10);
	$arr = array();
  if ($arg1 != 'n') {
    $arr[] = $arg1;
  } else {
    $arr[] = '';
  }
  if (isset($arg1) && $arg1 != 'n'){ 
    $name = $arg1;
  }
	$arg = arg();
	$total_forum_count = 0;
	if(isset($arg[1]) && $arg[1] != 'n') {
		$keyword = $arg[1];
		$data = get_search_result_forum_key($keyword);
		$total_forum_count = count($data);
	}
	if(!isset($arg[1]) || $arg[1] == 'n') {
		$arg[1] = '';
	}
	$uid = isset($arg[2]) ? $arg[2] : '';
	$level1 = isset($arg[3]) ? $arg[3] : '';
	$level2 = isset($arg[4]) ? $arg[4] : '';
	$tid1 = isset($arg[5]) ? $arg[5] : '';
	$tid2 = isset($arg[6]) ? $arg[6] : '';
	$order_by = isset($arg[7]) ? $arg[7] : '';
	$descending = isset($arg[8]) ? $arg[8] : '';
	$spoken_video = isset($arg[9]) ? $arg[9] : '';
	$data = get_search_result_key($arg);
	$total_lessons_count = count($data);
	$forum_count = 0;
	if(arg(1) != '' && arg(1) != 'n') {
		$forum_count = count(views_get_view_result('site_search', 'block_1', $name));
	}
	$keywords_description = keywords_description($name);
	$lesson_message = '';
	if(isset($arg3)) {
		if($arg3 != 'n') {
			if($arg3 != 1 || $arg4 != 10){
				$lesson_message = 'All lessons with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>';
			}
		}
		if($arg1 != 'n'){
			$lesson_message = 'All lessons of all difficulties';
		}
		if($arg1 != 'n' && ($arg3 != 1 || $arg4 != 10)){
			$lesson_message = 'All lessons with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>';
		}
		if($arg5 != 'n') {
			$lesson_message = 'All lessons of all difficulties, type <b>'.$arg5.'</b>';
		}
		if($arg5 != 'n' && $arg1 != 'n') {
			$lesson_message = 'All lessons of all difficulties, type <b>'.$arg5.'</b>, featuring <b>'.$arg1.'</b>';
		}
		if($arg5 != 'n' && ($arg3 != 1 || $arg4 != 10)){
			$lesson_message = 'All lessons with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, type <b>'.$arg5.'</b>';
		}
		if($arg5 != 'n' && ($arg3 != 1 || $arg4 != 10) && $arg1 != 'n'){
			$lesson_message = 'All lessons with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, type <b>'.$arg5.'</b>, featuring <b>'.$arg1.'</b>';
		}
		if($arg6 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> of all difficulties';
		}
		if($arg6 != 'n' && $arg1 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> of all difficulties, featuring <b>'.$arg1.'</b>';
		}
		if($arg6 != 'n' && ($arg3 != 1 || $arg4 != 10)) {
			$lesson_message = '<b>'.$arg6.' lessons</b> with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>';
		}
		if($arg6 != 'n' && ($arg3 != 1 || $arg4 != 10) && $arg1 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, featuring <b>'.$arg1.'</b>';
		}
		if($arg6 != 'n' && $arg5 != 'n' && ($arg3 != 1 || $arg4 != 10)) {
			$lesson_message = '<b>'.$arg6.' lessons</b> with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, type <b>'.$arg5.'</b>';
		}
		if($arg6 != 'n' && $arg5 != 'n' && ($arg3 != 1 || $$arg4 != 10) && $arg1 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, type <b>'.$arg5.'</b>, featuring <b>'.$arg1.'</b>';
		}
		if($arg6 != 'n' && $arg5 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> of all difficulties, type <b>'.$arg5.'</b>';
		}
		if($arg6 != 'n' && $arg5 != 'n' && $arg1 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> of all difficulties, type <b>'.$arg5.'</b>, featuring <b>'.$arg1.'</b>';
		}
		if($arg6 != 'n' && $arg5 != 'n' && ($arg3 != 1 || $arg4 != 10)) {
			$lesson_message = '<b>'.$arg6.' lessons</b> with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, type <b>'.$arg5.'</b>';
		}
		if($arg6 != 'n' && $arg5 != 'n' && ($arg3 != 1 || $arg4 != 10) && $arg1 != 'n') {
			$lesson_message = '<b>'.$arg6.' lessons</b> with difficulty ranging from <b>'.$arg3.' to '.$arg4.'</b>, type <b>'.$arg5.'</b>, featuring <b>'.$arg1.'</b>';
		}
	}
?>

<div class="column-wrapper search-page">
	<div class="column three-forth">
		<div class="padding">
			<span style="display:none;" id="pageArguments" value="<?php print $name;?>"></span>
			<span style="display:none;" id="pageArgumentsUID" value="<?php print $uid;?>"></span>
			<span style="display:none;" id="pageArgumentsLevel1" value="<?php print $level1;?>"></span>
			<span style="display:none;" id="pageArgumentsLevel2" value="<?php print $level2;?>"></span>
			<span style="display:none;" id="pageArgumentsTID1" value="<?php print $tid1;?>"></span>
			<span style="display:none;" id="pageArgumentsTID2" value="<?php print $tid2;?>"></span>
			<span style="display:none;" id="pageArgumentsOrder" value="<?php print $order_by;?>"></span>
			<span style="display:none;" id="pageArgumentsDescending" value="<?php print $descending;?>"></span>
			<span style="display:none;" id="pageArgumentsSpoken" value="<?php print $spoken_video;?>"></span>
			<h1 class="you-search-for">
				<img src="/font/You+searched+for%3A+<?php print isset($arr[0]) ? $arr[0] : ''; ?>.../20/" alt="You searched for: <?php print isset($arr[0]) ? $arr[0] : ''; ?>...">
			</h1>
			<?php if($lesson_message != '') { ?>
				<h2 class="search-alt-text"><?php print $lesson_message; ?></h2>
			<?php } ?>
			<?php if($keywords_description != ''){ ?>
				<div class="content-block description-content-block">
					<h2><img src="/font/<?print $name; ?>+Definition/12/" alt="<?print $name; ?> Definition"></h2>
					<div class="top"></div>
					<span class="definition-search-list"><?print $keywords_description; ?></span>
				</div>
			<?php } ?>
			<?php if(arg(1) != '' && arg(1) != 'n') { ?>
			<?php $inccount = views_get_view_result('search_user', 'block'); if(!empty($inccount)) { ?>
			<div class="content-block instructor-content-block">
				<h2>
					<img src="/font/Matching+instructor/12/" alt="Matching instructor">
				</h2>
				<div class="top"></div>
				<!-- Instructor View Block -->
				<?php print views_embed_view('search_user', 'block'); ?>
			</div>
			<?php  } ?>
			<?php  } ?>
			<div class="content-block lessons-content-block">
				<h2>
					<img src="/font/<? print $name; ?>+Lessons/12/" alt="<? print $name; ?> Lessons">
				</h2>
				<div class="top"></div>
				<!-- Lesson Page View -->
				<?php
					if($total_lessons_count != 0){
						$block = module_invoke('search_support', 'block_view', 'search_lessons_list');
						print $block['content'];
					}
					else {
				?>
					<span class="search-nomatch">No matching lessons was found for your search.</span>
				<?php } ?>
				<var></var>
			</div>
			<?php if($total_lessons_count != 0 && $total_lessons_count > 9){ ?>
				<div class="show-more show-more-lessonss" data-page="1" data-maxpage="<?php print $total_lessons_count / 9; ?>" data-type="lesson">Click to see more lessons about <?php print $name;?> (<?php print $total_lessons_count; ?> matches in total).</div>
			<?php } ?>
			<div class="show-more show-more-lessons" data-page="1" data-maxpage="6" data-type="lesson">Click to see more lessons about <?php //print $name;?> (<?php //print $_SESSION['view_lessons_count'];?> matches in total).</div>
			
			<div class="content-block forum-content-block">
				<h2>
					<img src="/font/<?php print $name; ?>+in+the+forums/12/" alt="<?php print $name; ?> in the forums">
				</h2>
				<div class="top"></div>
				<!-- Forum Block View -->
				<?php
					if($total_forum_count != 0) {
						$block = module_invoke('search_support', 'block_view', 'search_forum_list');
						print $block['content'];
					}
					else {
				?>
				<span class="search-nomatch">No matching forum post was found for your search.</span><br/>
				<a href="/guitar_forum">Start a new thread!</a>
			<?php } ?>
				<var></var>
			</div>
			<?php if($total_forum_count != 0 && $total_forum_count > 9){ ?>
				<div class="show-more show-more-forums" data-page="1" data-maxpage="<?php print $total_forum_count / 9; ?>" data-type="forum">Click to see more about <?php print $name;?> from the forums (<?php print $total_forum_count;?> matches in total).</div>
			<?php } ?>
			<div class="show-more show-more-forum" data-page="1" data-maxpage="163.2" data-type="forum">Click to see more about <?php //print $name;?> from the forums (<?php //print $_SESSION['view_forum_count'];?> matches in total).</div>

			<?php if(arg(1) != '' && arg(1) != 'n') {?>
			<?php $usecount =views_get_view_result('search_user', 'block_1'); if(!empty($usecount)) { ?>
			<div class="content-block">
				<h2>
					<img src="/font/GMC+Member/12/" alt="GMC Member">
				</h2>
				<div class="top"></div>
				<!-- GMC Member View -->
				<?php print views_embed_view('search_user','block_1'); ?>
			</div>
			<?php  } ?>
			<?php  } ?>
		</div>
	</div>
	<div class="column one-forth">
		<div class="padding">
			<div class="padding">
				<div class="content-block">
					<h2>
						<img src="/font/Advanced+lesson+search/11/" alt="Advanced lesson search">
					</h2>
					<div class="top"></div>
					<?php $form1 = drupal_get_form('advanced_search'); print drupal_render($form1); ?>
					<hr>
					<?php $form2 = drupal_get_form('stumble_container'); print drupal_render($form2); ?>
				</div>
			</div>
		</div>
	</div>
</div>
