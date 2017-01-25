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
class gmc_views_hand_handler_loginstatus extends views_handler_field {
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
    $uid = 0;
	  $uid = db_select('sessions', 's')
	    ->fields('s', array('uid'))
	    ->condition('s.uid', $values->users_comment_uid, '=')
	    ->execute()->fetchField();
	  if($uid == 0) {
		  return '<img src="/sites/all/themes/gmc_v2/images/user-offline.png" alt="" border="0">';
	  }
	  else {
		  return '<img src="/sites/all/themes/gmc_v2/images/user-online.png" alt="" border="0">';
	  }
  }
} 
