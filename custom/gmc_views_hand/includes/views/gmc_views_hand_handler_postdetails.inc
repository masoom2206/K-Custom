<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_postdetails extends views_handler_field {
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
    global $base_url;
    if(isset($values->_field_data['users_comment_uid']['entity']->picture->uri)) {
	    $uri = $values->_field_data['users_comment_uid']['entity']->picture->uri;
	    $image = file_create_url($uri);
    }
    else {
	    $image = 'public://pictures/default-user-image.png';
    }
    $name = $values->_field_data['users_comment_uid']['entity']->name;
    //$image = drupal_realpath($image);
    $size = image_get_info($image);
    $width = $size[0];
    $height = $size[1];
    if($size[0] > 90) {
	    $width = 90;
    }
    if($size[1] > 90) {
	    $height = 90;
    }
    $data = '<img src="'.$image.'" width="'.$width.'" height="'.$height.'" alt="'.$name.'\'s picture" title="'.$name.'\'s picture"/>';    
    return $data;
  }
}
