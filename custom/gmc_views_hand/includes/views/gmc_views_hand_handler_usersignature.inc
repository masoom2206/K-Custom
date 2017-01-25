<?php
// This file must be at gmc_views_hand/includes/views directory.

/**
 * @file
 * Definition of gmc_views_hand_handler_handlername.
 */

/**
 * Description of what my handler does.
 */
class gmc_views_hand_handler_usersignature extends views_handler_field {
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
    global $user;
    $signature = '';
    $data = '';
    if(isset($values->_field_data['users_comment_uid']['entity']->field_user_signature['und']['0']['value'])) {
	    $signature = html_entity_decode($values->_field_data['users_comment_uid']['entity']->field_user_signature['und']['0']['value']);
	    $format = $values->_field_data['users_comment_uid']['entity']->field_user_signature['und']['0']['format'];
	    $users_comment_uid = $values->_field_data['users_comment_uid']['entity']->uid;
	    if($format != 'custom_profile_signature') {
		    $count = substr_count($signature, '<img');
		    if($count == 0) {
			    $strip = strip_tags($signature);
			    $signature_count = strlen($strip);
			    if($signature_count <= 255 && $signature_count > 0) {
				    $data .= '<div class="signature"><br/><br/>--------------------<br/>'.strip_tags($signature, '<a><br>').'</div>';
			    }
			    else if($users_comment_uid == $user->uid) {
				    $data .= '<div class="signature"><br/><br/>--------------------<br/>Update the signature</div>';
			    }
		    }
		    else if($users_comment_uid == $user->uid) {
			     $data .= '<div class="signature"><br/><br/>--------------------<br/>Update the signature</div>';
		    }
		    else{
			    $strip = strip_tags($signature);
			    $signature_count = strlen($strip);
			    if($signature_count <= 255 && $signature_count > 0) {
				    $data .= '<div class="signature"><br/><br/>--------------------<br/>'.strip_tags($signature, '<a><br>').'</div>';
			    }
		    }
	    }
	    else {
		    $data .= '<div class="signature"><br/><br/>--------------------<br/>'.$signature.'</div>';
	    }
    }
    return $data;
  }
}
