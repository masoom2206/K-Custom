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
class gmc_views_hand_handler_editcomment extends views_handler_field {
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
    global $user;
    $user_detail = user_load($user->uid);
    $diff = time() - $values->comment_created;
    $diff_min = $diff / 60;
    $round_min = round($diff_min);
    if($user_detail->uid == 1) {
	    $data = '<a id="edit-but-'.$values->cid.'" href="/comment/'.$values->cid.'/edit?destination=guitar_forum_topic/'.$values->comment_nid.'"><img src="/sites/all/themes/gmc_v2/images/p_edit.gif" border="0" alt="Edit Post"></a>';
    }
    else if($values->users_comment_uid == $user_detail->uid && $round_min <= 525949 && in_array('instructor', $user_detail->roles)) {
	    $data = '<a id="edit-but-'.$values->cid.'" href="/comment/'.$values->cid.'/edit?destination=guitar_forum_topic/'.$values->comment_nid.'"><img src="/sites/all/themes/gmc_v2/images/p_edit.gif" border="0" alt="Edit Post"></a>';
    }
    else if($values->users_comment_uid == $user_detail->uid && $round_min <= 2880 && in_array('member', $user_detail->roles)) {
	    $data = '<a id="edit-but-'.$values->cid.'" href="/comment/'.$values->cid.'/edit?destination=guitar_forum_topic/'.$values->comment_nid.'"><img src="/sites/all/themes/gmc_v2/images/p_edit.gif" border="0" alt="Edit Post"></a>';
    }
    return $data;
  }
} 
