<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_freeparts extends views_handler_field {
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
    $free = 0;
    if (isset($values->_field_data['nid']['entity']->field_free_parts['und']['0']['value'])) {
	    $free = $values->_field_data['nid']['entity']->field_free_parts['und']['0']['value'];
    }
    if ($free == 1) {
	    $data = '<div class="free100bg"></div>';
    } else {
      $data = '';
    }
    return $data;
  }
}
