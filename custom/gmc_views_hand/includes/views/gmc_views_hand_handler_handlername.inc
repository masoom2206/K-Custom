<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_handlername extends views_handler_field {
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
    $options['option_a'] = array('default' => '120x90');
    return $options;
    }
     
    /**
    * Creates the form item for the options added.
    */
    function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
     
    $form['option_a'] = array(
      '#type' => 'textfield',
      '#title' => t('Image size'),
      '#default_value' => $this->options['option_a'],
      '#description' => t('formate 120x80.'),
      '#weight' => -10,
    );

    }
  

  /**
   * Renders the field handler.
   */
  function render($values) {
    global $base_url;
    $filepath = '/sites/default/files/uploads/'.$values->nid.'/big_'.$values->nid.'.jpg';
    $imageinfo = getimagesize($base_url.$filepath);
    if ($imageinfo[1] > 120 || $this->options['option_a'] !=  '120x90') {
      $config = array(
        "style_name" => $this->options['option_a'],
        "path" => "public://uploads/".$values->nid."/big_".$values->nid.".jpg",
        "height" => NULL,
        "width" => NULL,
        "title" => $values->node_title
      );
      theme_image_style($config);
      $data = '<img src="/lm2_get_clip/'.$values->nid.'" title ="'.$values->node_title.'" />';
      if ($this->options['option_a'] >='30x20') {
        theme_image_style($config);
        $data = l('<img src="/lm2_get_clip/'.$values->nid.'" title ="'.$values->node_title.'" />', 'node/'.$values->nid, array('html' => TRUE));
      }
    } else {
      $data = '<img src="/lm2_get_clip/'.$values->nid.'" title ="'.$values->node_title.'" />';
    }
    return $data;
  }
}
