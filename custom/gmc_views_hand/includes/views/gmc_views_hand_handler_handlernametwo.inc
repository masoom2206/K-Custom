<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_handlernametwo extends views_handler_field {
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
    $options['option_a'] = array('default' => 20);
    $options['option_b'] = array('default' => '...');
    return $options;
    }
     
    /**
    * Creates the form item for the options added.
    */
    function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    $form['option_a'] = array(
      '#type' => 'textfield',
      '#title' => t('Trim size'),
      '#default_value' => $this->options['option_a'],
      '#description' => t('formate 20'),
      '#weight' => -10,
    );
    $form['option_b'] = array(
      '#type' => 'textfield',
      '#title' => t('Trim text'),
      '#default_value' => $this->options['option_b'],
      '#description' => t('formate ...'),
      '#weight' => -10,
    );
    }
  

  /**
   * Renders the field handler.
   */
  function render($values) {
    $title = '';
    if(isset($values->_field_data['nid']['entity']->field_front_page_title['und'][0]['value']) && $values->_field_data['nid']['entity']->field_front_page_title['und'][0]['value'] != '') {
	    $title = $values->_field_data['nid']['entity']->field_front_page_title['und'][0]['value'];
    }
    else {
	    if(strlen($values->node_title) > $this->options['option_a']) {
		    $title = substr($values->node_title, 0, $this->options['option_a']).$this->options['option_b'];
	    }
	    else {
		    $title = $values->node_title;
	    }
    }
    $title = l($title, 'node/'.$values->nid);
    return $title;
  }
}
