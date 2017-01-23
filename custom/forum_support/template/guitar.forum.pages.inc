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
  $nid = $_GET['showforum'];
  //fetch uid by board id
  $uid = get_uid_by_board_id($nid);
  $user_detail = user_load($uid);
  
  $data = '';
  if ( $nid == '') {
    $nid = 4692;
    $forum_term = forum_forum_load($nid);
    $forum_per_page = variable_get('forum_per_page', 25);
    $sortby = variable_get('forum_order', 1);
    $topics = forum_get_topics($nid, $sortby, $forum_per_page);
    $data .=  theme('forums', array('forums' => $forum_term->forums, 'topics' => $topics, 'parents' => $forum_term->parents, 'tid' => $forum_term->tid, 'sortby' => $sortby, 'forums_per_page' => $forum_per_page));
    $nid = 4645;
	
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
    $forum_term = forum_forum_load($nid);
	//print "<pre>";print_r($forum_term);exit;
    $forum_per_page = variable_get('forum_per_page', 25);
    $sortby = variable_get('forum_order', 1);
    $topics = forum_get_topics($nid, $sortby, $forum_per_page);
    $data .=  theme('forums', array('forums' => $forum_term->forums, 'topics' => $topics, 'parents' => $forum_term->parents, 'tid' => $forum_term->tid, 'sortby' => $sortby, 'forums_per_page' => $forum_per_page));
	$forums_count = count($forum_term->forums);
	if(!empty($user_detail)) {
		$data .= views_embed_view('user_personal_board', $display_id = 'page', $uid);
	}
  }
  else if(!empty($user_detail)) {
	$data .= views_embed_view('user_personal_board', $display_id = 'page', $uid);
  }
  else {
    $data .= views_embed_view('user_personal_board', $display_id = 'page_1', $nid);
  }
  return $data;
}
