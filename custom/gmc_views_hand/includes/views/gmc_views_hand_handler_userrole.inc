<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_userrole extends views_handler_field {
  /**
   * Add some required fields needed on render().
   */
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
      $data = '';
      if(in_array('instructor', $values->_field_data['users_comment_uid']['entity']->roles)) {
	      $data = '<img src="/sites/all/themes/gmc_v2/images/staff2.jpg" alt="Group Icon"><br><br>Group: <span class="gmc-instructor">GMC Instructor</span><br>';
      }
      else {
	      $data  = 'Group: Members<br/>';
      } 
    return $data;
  }
}
