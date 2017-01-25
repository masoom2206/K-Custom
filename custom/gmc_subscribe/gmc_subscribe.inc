<?php
/**
 * @file
 * Service functions
 */

/**
 * Callback function gmc_subscription_templates for admin
 * to configure mail template for subscription notification.
 * Admin page with templates list
 **/
function gmc_subscription_templates(){
	//Select template title and template ID
	$query = db_select("gmc_subscribe_mail_template", "t");
	$query->fields("t");
	$result = $query->execute();
	$table_data = array();
	while($data = $result->fetchObject()){
		$actions = l(t('edit'), 'admin/config/gmc_subscription/templates/edit/'.$data->serl_no);
		$table_data[] = array(t($data->title), $actions);
	}
	$build = array();
	$build['templates'] = array(
	'#theme' => 'table',
	'#header' => array(t('Template Name'), t('Action')),
	'#rows' => $table_data,
	'#prefix' => '<h3>' . t('GMC Templates') . '</h3>',
	'#suffix' => '<br />',
	);
	return $build;
}
/**
 * Form edit GMC subscribe notification template
 */
function gmc_templates_form($form, &$form_state, $template = NULL){
	if ($template) {
		//fetch Template data
		$query = db_select("gmc_subscribe_mail_template", "t");
		$query->fields("t");
		$query = $query->condition('t.serl_no', $template, '=');
		$result = $query->execute();
		$data = $result->fetchObject();
		$mail_type = array('tid' => t('Forum Board'), 'cid' => t('Forum Topic Reply'), 'uid' => t('Instructor Lessons'), 'new-user' => t('Welcome Message'));
		drupal_set_title($title = $data->title, $output = CHECK_PLAIN);
		//set default template form value
		$form['template_id'] = array(
			'#type' => 'hidden',
			'#value' => $template,
		);
		$form['mail_type'] = array(
			'#type' => 'textfield',
			'#title' => t('Mail Type'),
			'#default_value' => $mail_type[$data->mail_type],
			'#disabled' => TRUE,
			'#size' => 40,
		);
		$form['notification_method'] = array(
			'#type' => 'textfield',
			'#title' => t('Notification Method'),
			'#default_value' => ucwords($data->notification_method),
			'#disabled' => TRUE,
			'#size' => 40,
		);
		$form['mail_subject'] = array(
			'#type' => 'textfield',
			'#title' => t('Mail Subject'),
			'#description' => t('Mail Subject'),
			'#default_value' => $data->mail_subject,
			'#size' => 40,
			'#required' => TRUE,
		);
		$form['mail_message'] = array(
			'#type' => 'textarea',
			'#title' => t('Mail Message Body'),
			'#description' => t('Mail Message Body'),
			'#rows' => 15,
			'#default_value' => $data->mail_message,
			'#required' => TRUE,
		);
		$table_data = array();
		$table_data[] = array(t('User name to'), t('[usernameto]'));
		$table_data[] = array(t('User email to'), t('[useremailto]'));
		$table_data[] = array(t('Name of the topic'), t('[forumtopic]'));
		$table_data[] = array(t('Name of the forum board'), t('[forumboard]'));
		$table_data[] = array(t('URL to the forum topic'), t('[forumtopicurl]'));
		$table_data[] = array(t('URL to the forum topic reply'), t('[forumtopicreplyurl]'));
		$table_data[] = array(t('Unsubscribe Link'), t('[unsubscribe]'));
		$table_data[] = array(t('Name of the instructor]'), t('[instructorname]'));
		$table_data[] = array(t('Title of the lessons]'), t('[lessonstitle]'));
		$table_data[] = array(t('Forum Page Link]'), t('[forumpagelink]'));
		$table_data[] = array(t('Introduce Yourself Page]'), t('[introduce-yourself-link]'));
		$table_data[] = array(t('REC Program Page]'), t('[rec-program-link]'));
		$table_data[] = array(t('Collaborations Page]'), t('[collaborations-link]'));
		$table_data[] = array(t('Video Chats]'), t('[video-chats-link]'));
		$table_data[] = array(t('Personal Boards Page]'), t('[personal-boards-link]'));
		$table_data[] = array(t('Practice Room Forum Post]'), t('[practice-room-post-link]'));
		$table_data[] = array(t('Lessons Archive Page]'), t('[lessons-archive-link]'));
		$table_data[] = array(t('search Page]'), t('[search-page]'));
		
		$form['token_help'] = array(
			'#title' => t('Replacement patterns'),
			'#type' => 'fieldset',
			'#collapsible' => TRUE,
			'#collapsed' => TRUE,
		);
		$form['token_help']['help'] = array(
			'#theme' => 'table',
			'#header' => array(t('Token Description'), t('Token')),
			'#rows' => $table_data,
		);
	}
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Update template'),
	);
	return $form;
}
/**
 * Form submit GMC subscribe notification template
 */
function gmc_templates_form_submit($form, &$form_state) {
	$template_updated = db_update('gmc_subscribe_mail_template')
		->fields(array(
			'mail_subject' => $form_state['values']['mail_subject'],
			'mail_message' => $form_state['values']['mail_message'],
		))
	->condition('serl_no', $form_state['values']['template_id'], '=')
	->execute();
	drupal_set_message(t('Template updated successfully'), $type = 'status');
	$form_state['redirect'] = url('admin/config/gmc_subscription/templates');
}