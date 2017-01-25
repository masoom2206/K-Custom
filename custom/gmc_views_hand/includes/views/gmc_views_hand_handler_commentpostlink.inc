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
class gmc_views_hand_handler_commentpostlink extends views_handler_field {
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
    if(isset($_GET['page'])) {
	    $data = 'guitar_forum_topic/'.$values->comment_nid.'?page='.$_GET['page'].'#entry'.$values->cid;
    }
    else {
	    $data = 'guitar_forum_topic/'.$values->comment_nid.'#entry'.$values->cid;
    }
    return $data;
  }
} 
