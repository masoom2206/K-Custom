<?php
/**
* @file
* Definition of views_handler_field_user.
*/
/**
* Field handler to provide simple renderer that allows linking to a user.
*
* @ingroup views_field_handlers
*/
class gmc_views_hand_handler_commentalleditlinks extends views_handler_field {
  function construct() {

  }
   
  /**
  * Loads additional fields.
  */
  function query() {
  }
   
  /**
  * Default options form.
  */
  function option_definition() {
  $options = parent::option_definition();
  return $options;
  }
   
  /**
  * Creates the form item for the options added.
  */
  function options_form(&$form, &$form_state) {
  parent::options_form($form, $form_state);
  }
  

  /**
   * Renders the field handler.
   */
  function render($values) {
    //Delete Comment Link 
    global $base_url,$user;
    $roles = array("administrator", "moderator");
    $roles_result = array_intersect($roles, $user->roles);
    $node_detail = node_load($values->comment_nid);
    $tid = $node_detail->taxonomy_forums['und']['0']['tid'];
    if(!empty($roles_result)) {
	    $data = '<a href="/comment/'.$values->cid.'/delete?destination=guitar_forum_topic/'.$values->comment_nid.'"><img src="/sites/all/themes/gmc_v2/images/p_delete.gif" border="0" alt="Delete Post"></a>';
    }
    //Edit Comment Link
    $user_detail = user_load($user->uid);
    $diff = time() - $values->comment_created;
    $diff_min = $diff / 60;
    $round_min = round($diff_min);
    $edit_link = '';
    if(isset($_GET['page'])) {
	    $edit_link = '/comment/'.$values->cid.'/edit?destination=guitar_forum_topic/'.$values->comment_nid.'&page='.$_GET['page'].'#entry'.$values->cid;
    }
    else {
	    $edit_link = '/comment/'.$values->cid.'/edit?destination=guitar_forum_topic/'.$values->comment_nid.'#entry'.$values->cid;
    }

    if($user_detail->uid == 1) {
	    $data .= '<a id="edit-but-'.$values->cid.'" href="'.$edit_link.'"><img src="/sites/all/themes/gmc_v2/images/p_edit.gif" border="0" alt="Edit Post"></a>';
    }
    else if($values->users_comment_uid == $user_detail->uid && $round_min <= 525949 && in_array('instructor', $user_detail->roles)) {
	    $data .= '<a id="edit-but-'.$values->cid.'" href="'.$edit_link.'"><img src="/sites/all/themes/gmc_v2/images/p_edit.gif" border="0" alt="Edit Post"></a>';
    }
    else if($values->users_comment_uid == $user_detail->uid && $round_min <= 2880 && in_array('member', $user_detail->roles)) {
	    $data .= '<a id="edit-but-'.$values->cid.'" href="'.$edit_link.'"><img src="/sites/all/themes/gmc_v2/images/p_edit.gif" border="0" alt="Edit Post"></a>';
    }
    //Quote/Reply Comment Link
    if($user->uid != 0 && (forum_access_access('create', $tid) || !empty($roles_result))) {
	    $data .= '<a id="quote-button-'.$values->cid.'" valuesid="cid-'.$values->cid.'" href="#" title="Toggle multiquote addition"><img src="/sites/all/themes/gmc_v2/images/p_mq_add.gif" name="mad_'.$values->cid.'" alt="+"></a><a href="/comment/reply/'.$values->comment_nid.'/'.$values->cid.'?destination=guitar_forum_topic/'.$values->comment_nid.'" title="Reply directly to this post"><img src="/sites/all/themes/gmc_v2/images/p_quote.gif" border="0" alt="Quote Post"></a>';
    }
    return $data;
  }
} 
