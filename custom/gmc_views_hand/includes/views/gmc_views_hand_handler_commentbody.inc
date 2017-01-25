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
class gmc_views_hand_handler_commentbody extends views_handler_field {
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
    $comment = '';
    if(isset($values->_field_data['cid']['entity']->comment_body['und']['0']['value'])) {
	    $comment = gmc_add_target_blank_forum_topic($values->cid);
      $comment = render_attachments($comment , $rel_ids=array(), $skin_name='skin_topic', $values->cid ) ;
    }
    return $comment;
  }
} 
