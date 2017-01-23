<?php

/**
 * @file
 * User page callbacks for the Forum module.
 */

/**
 * Page callback: Prints a forum listing.
 *
 * @param $forum_term
 *   A tree of all forums for a given taxonomy term ID. Defaults to NULL. See
 *   the return object of forum_forum_load() for a complete definition.
 *
 * @return
 *   A string containing HTML representing the themed forum listing.
 *
 * @see forum_menu()
 */
function guitar_forum_page($forum_term = NULL) {
	$data = '';
	global $user;
	if(isset($_GET['showforum']) && $_GET['showforum'] == 'new-posts') {
		$data = views_embed_view('forum_new_posts', $display_id = 'page_1');
	}
	else if(isset($_GET['act']) && (strtolower($_GET['act']) == 'attach') && $_GET['type'] == 'post') {
		//redirect to attach file URL
		$data = gmc_forum_attach_file_url($_GET['id']);
		
	} else {

	  $nid = '';
		if(isset($_GET['showforum'])) {
			$nid = $_GET['showforum'];
		}

		if($user->uid == 0) {
			$data .= '<div id="guest-userlinks"><p><span><a href="/guitar_forum?showforum=new-posts">View New Posts</a></span></p></div>';
		}
		$user_detail = array();
		if($nid != '') {
			$uid = get_uid_by_board_id($nid);
			if($uid != 0) {
				$user_detail = user_load($uid);
			}
		}
		if(isset($_GET['act']) && $_GET['act'] == 'online') {
			$data = gmc_online_list();
		}
		else if ( $nid == '') {
			//$nid = 4692;
		//	$forum_term = forum_forum_load($nid);
    //	$forum_per_page = variable_get('forum_per_page', 25);
		//	$sortby = variable_get('forum_order', 1);
		 //	$topics = forum_get_topics($nid, $sortby, $forum_per_page);
			// $data .=  theme('forums', array('forums' => $forum_term->forums, 'topics' => $topics, 'parents' => $forum_term->parents, 'tid' => $forum_term->tid, 'sortby' => $sortby, 'forums_per_page' => $forum_per_page));
			$nid = 4645;
			//Private Message popup link
			/*$nid = 4708;
			$forum_term = forum_forum_load($nid);
			$forum_per_page = variable_get('forum_per_page', 25);
			$sortby = variable_get('forum_order', 1);
			$topics = forum_get_topics($nid, $sortby, $forum_per_page);
			$data .=  theme('forums', array('forums' => $forum_term->forums, 'topics' => $topics, 'parents' => $forum_term->parents, 'tid' => $forum_term->tid, 'sortby' => $sortby, 'forums_per_page' => $forum_per_page));
			// $nid = 4645;
			*/
		}
		$tchild = taxonomy_get_tree(6, $nid, 1, $load_entities = FALSE);
		if (!empty($tchild)) {
			$forum_term = gmc_forum_load($nid);
			$forum_per_page = variable_get('forum_per_page', 25);
			$sortby = variable_get('forum_order', 1);
			$topics = forum_get_topics($nid, $sortby, $forum_per_page);
			$data .=  theme('forums', array('forums' => $forum_term->forums, 'topics' => $topics, 'parents' => $forum_term->parents, 'tid' => $forum_term->tid, 'sortby' => $sortby, 'forums_per_page' => $forum_per_page));
			if(!empty($user_detail)) {
				//$data .= views_embed_view('user_personal_board', $display_id = 'page_2', $nid);
				$data .= views_embed_view('user_personal_board', $display_id = 'page_1', $nid);
			}
		}
		elseif(arg(1) == '') {
			//$data .= views_embed_view('user_personal_board', $display_id = 'page_2', $nid);
			$data .= views_embed_view('user_personal_board', $display_id = 'page_1', $nid);
		}
	}
	return $data;
}
