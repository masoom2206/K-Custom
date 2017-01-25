<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_commentreplyusername extends views_handler_field {
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
    $name = '';
    if(isset($values->_field_data['users_comment_uid']['entity']->field_first_name['und'][0]['value'])) {
	    if(isset($values->_field_data['users_comment_uid']['entity']->field_last_name['und'][0]['value'])) {
		    $name = $values->_field_data['users_comment_uid']['entity']->field_first_name['und'][0]['value'].' '.$values->_field_data['users_comment_uid']['entity']->field_last_name['und'][0]['value'];
	    }
	    else {
		    $name = $values->_field_data['users_comment_uid']['entity']->field_first_name['und'][0]['value'];
	    }
    }
    else if (empty($name)) {
	    $name = $values->_field_data['users_comment_uid']['entity']->name;
    }
    $data = ucwords($name);
    return $data;
  }
}
