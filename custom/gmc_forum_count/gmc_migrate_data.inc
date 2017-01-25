<?php
/**
 * @file to migrate GMC live site data
 * Batch Migration
 * URL: admin/config/data/migrate
 **/

/**
 * Form API for batch operation
 **/
/*
			'forum' => t('Import Forum Topic With Attachment (node)'),
			'forum_post' => t('Import Forum Post With Attachment (comment)'),
			'user' => t('Import User Details'),
			'profile_comment' => t('Import User Profile Comment'),
			'user_friend' => t('Import User Friend (relation)'),
			'bookmark' => t('Import User Bookmark'),
			'subscription' => t('Import User Subscription'),
			'user_referrals' => t('Import User Referrals Detail (Signup Referrals)'),
			'featured_content_data' => t('Import Featured Content Data (Front Page)'),
			'student_video' => t('Import Student Video (Forum REC post)'),
*/
function gmc_admin_migrate_data() {
	$form['description'] = array(
		'#type' => 'markup',
		'#markup' => t('Importing GMC Live data.'),
	);
	$form['batch'] = array(
		'#type' => 'select',
		'#title' => 'Choose batch',
		'#options' => array(
			'0' => t('Select Import Option'),
			'private_msg' => t('Import Private Message With Attachment'),
		),
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => 'Go',
	);
	return $form;
}

/**
 * Form API Submit for batch operation
 **/
function gmc_admin_migrate_data_submit($form, &$form_state){
	if($form_state['values']['batch'] == 'private_msg') {
		$function = 'import_live_data_' . $form_state['values']['batch'];
		$_SESSION['http_request_count'] = 0; // reset counter for debug information.
		$batch = $function();
		batch_set($batch);
	}
} 
/**
 * Callback function import_live_data_forum()
 * to import live forum data
 **/
function import_live_data_forum() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_forum', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_forum()
 * to save live forum data in drupal database
 **/
function import_data_forum($value, $operation_details, &$context) {
	$x = 0;
	$live_datas = db_query("SELECT id,name FROM ds2_gmc.ibf_forums ORDER by id ASC LIMIT 0, 1000");
	foreach($live_datas as $live_data) {
		$drupal_node = db_query("SELECT nid,title FROM dev_syn_drupal.node WHERE type = :type and title LIKE :title", array(':type' => 'forum', ':title' => $live_data->name));
		$count = $drupal_node->rowCount();
		if($count == 0) {
			//$data = $live_datas->fetchAll();
			print "<pre>";print_r($live_data);exit;
			//break;
		}
		$x++;
	}
	print '<br/>'.$x; exit;
	/*
	$message = '';
	$uid = '';
	$title = '';
	//new node object;
	$new_node = new stdClass();
	$new_node->uid = $uid;
	$new_node->title = $title;
	$new_node->status = 1;
	$new_node->comment = 2;
	$new_node->promote = 0;
	$new_node->revision = 1;
	$new_node->sticky = 0;
	$new_node->type = 'forum';
	$new_node->language = 'und';
	$new_node->created = time();
	$new_node->changed = time();
	$new_node->body['und']['0']['value'] = $message;
	$new_node->body['und']['0']['format'] = 'full_html';
	$new_node->taxonomy_forums['und']['0']['tid'] = 4758;
	
	node_validate($new_node);
	node_submit($new_node);
	node_save($new_node);
	
	if($new_node->nid) {
		$comment = (object) array(
			'nid' => $new_node->nid,
			'cid' => 0,
			'pid' => 0,
			'uid' => $uid,
			'mail' => '',
			'is_anonymous' => 0,
			'homepage' => '',
			'status' => COMMENT_PUBLISHED,
			'subject' => $title,
			'created' => '',
			'changed' => '',
			'language' => LANGUAGE_NONE,
			'comment_body' => array(
			  LANGUAGE_NONE => array(
				0 => array (
				  'value' => $message,
				  'format' => 'php_code'
				)
			  )
			),
		);
		comment_submit($comment);
		comment_save($comment);
	}*/
}
/**
 * Callback function import_live_data_forum_post()
 * to import live forum post (comment)
 **/
function import_live_data_forum_post() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_forum_post', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_forum_post()
 * to save live forum post (comment) in drupal database
 **/
function import_data_forum_post($value, $operation_details, &$context) {
	$node = node_load(0);
	if($node->nid) {
		$comment = (object) array(
			'nid' => $node->nid,
			'cid' => 0,
			'pid' => 0,
			'uid' => $uid,
			'mail' => '',
			'is_anonymous' => 0,
			'homepage' => '',
			'status' => COMMENT_PUBLISHED,
			'subject' => $title,
			'created' => '',
			'changed' => '',
			'language' => LANGUAGE_NONE,
			'comment_body' => array(
			  LANGUAGE_NONE => array(
				0 => array (
				  'value' => $message,
				  'format' => 'php_code'
				)
			  )
			),
		);
		comment_submit($comment);
		comment_save($comment);
	}
}

/**
 * Callback function import_live_data_user()
 * to import user detail
 **/
function import_live_data_user() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_user', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_user()
 * to save live user detail in drupal database
 **/
function import_data_user($value, $operation_details, &$context) {
	print 'import_data_user';
	print "<pre>";print_r($value);exit;
}

/**
 * Callback function import_live_data_profile_comment()
 * to import user profile comment by other user
 **/
function import_live_data_profile_comment() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_profile_comment', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_profile_comment()
 * to save live user profile comment by other user in drupal database
 **/
function import_data_profile_comment($value, $operation_details, &$context) {
	print 'import_data_profile_comment';
	print "<pre>";print_r($value);exit;
}

/**
 * Callback function import_live_data_user_friend()
 * to import user friend list (relation)
 **/
function import_live_data_user_friend() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_user_friend', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_user_friend()
 * to save live user friend list (relation) in drupal database
 **/
function import_data_user_friend($value, $operation_details, &$context) {
	print 'import_data_user_friend';
	print "<pre>";print_r($value);exit;
}

/**
 * Callback function import_live_data_private_msg()
 * to import user Private Message data with attachment
 **/
function import_live_data_private_msg() {
	/*$live_mid = db_query("SELECT live_mid FROM dev_syn_drupal.pm_migrate_ids ORDER BY live_mid DESC LIMIT 0, 1")->fetchField(); , ':live_mid' => $live_mid*/
	$records = db_query("SELECT * FROM ds2_gmc.ibf_message_text m INNER JOIN ds2_gmc.ibf_message_topics mt ON m.msg_id = mt.mt_msg_id WHERE mt.mt_vid_folder != :unsent AND mt.mt_msg_id > 95257 ORDER BY m.msg_id ASC LIMIT 0, 5000", array(':unsent' => 'unsent'));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_private_msg', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_private_msg()
 * to save live user Private Message data with attachment in drupal database
 **/
function import_data_private_msg($value, $operation_details, &$context) {
	$migrate_ids = db_query("SELECT drupal_mid FROM dev_syn_drupal.pm_migrate_ids WHERE live_mid = :live_mid", array(':live_mid' => $value->mt_msg_id));
	$count = $migrate_ids->rowCount();
	if($count == 0) {
		$author_email = db_query("SELECT email FROM ds2_gmc.ibf_members WHERE id = :id", array(':id' => $value->mt_from_id))->fetchField();
		if(!empty($author_email)) {
			$author = db_query("SELECT uid FROM dev_syn_drupal.users WHERE mail = :mail", array(':mail' => $author_email))->fetchField();
		}
		$recipient_email = db_query("SELECT email FROM ds2_gmc.ibf_members WHERE id = :id", array(':id' => $value->mt_to_id))->fetchField();
		if(!empty($recipient_email)) {
			$recipient = db_query("SELECT uid FROM dev_syn_drupal.users WHERE mail = :mail", array(':mail' => $recipient_email))->fetchField();
		}
		if(!empty($author) && !empty($recipient)) {
			$body = str_replace("style_emoticons/<#EMO_DIR#>","/style_emoticons/default", $value->msg_post);
			$body = str_replace("<#EMO_DIR#>","default", $body);
			$body = str_replace("style_emoticons/&lt;#EMO_DIR#&gt;","/style_emoticons/default", $body);
			$body = str_replace("http://www.guitarmasterclass.net/guitar_forum/style_emoticons/default/", "/style_emoticons/default/", $body);
			$args = array();
			$args['subject'] = $value->mt_title;
			$args['author'] = $author;
			$args['body'] = $body;
			$args['format'] = 'full_html';
			$args['timestamp'] = $value->msg_date;
			$args['has_tokens'] = 0;
			//$mid = 1;
			$mid = db_insert('pm_message')
			  ->fields($args)
			  ->execute();
			
			$query = db_insert('pm_index')->fields(array('mid', 'thread_id', 'recipient', 'type', 'is_new', 'deleted'));
			$query->values(array(
				'mid' => $mid,
				'thread_id' => $mid,
				'recipient' => $author,
				'type' => 'user',
				'is_new' => 0,
				'deleted' => 0,
			));
			$query->values(array(
				'mid' => $mid,
				'thread_id' => $mid,
				'recipient' => $recipient,
				'type' => 'user',
				'is_new' => 0,
				'deleted' => 0,
			));
			$query->execute();

			$pm_tags = db_insert('pm_tags_index')
			->fields(array(
				'tag_id' => 1,
				'uid' => $author,
				'thread_id' => $mid,
			))
			->execute();

			$migrate_ids = db_insert('pm_migrate_ids')
			->fields(array(
				'live_mid' => $value->msg_id,
				'drupal_mid' => $mid,
				'drupal_draft_id' => 0,
			))
			->execute();
			
			//Insert attachment
			$attachments = db_query("SELECT * FROM ds2_gmc.ibf_attachments WHERE attach_rel_id = :msg_id AND attach_rel_module LIKE :msg", array(':msg_id' => $value->mt_msg_id, 'msg' => 'msg'));
			$attach_count = $attachments->rowCount();
			if($attach_count != 0) {
				foreach($attachments as $attachment){
					$thumb = '/opt/web/guitarmasterclass.net/public_html/guitar_forum/uploads/'.$attachment->attach_location;
					
					$fp = file_get_contents($thumb);
					//print $fp;exit;
					if(!empty($fp)) {
						$file = file_save_data($fp,"public://mail_attachment/".$attachment->attach_file,FILE_EXISTS_RENAME);
						$file->status = FILE_STATUS_PERMANENT;
						$file->uid = $author;
						$file = file_save($file);
						//print "<pre>";print_r($file);exit;
						if(!empty($file->fid) && !empty($mid)){
							db_insert('file_usage')
								->fields(array('fid' => $file->fid, 'module' => 'file', 'type' => 'privatemsg_message', 'id' => $mid, 'count' => 1))
								->execute();
								
							$delta_count = db_query("SELECT COUNT(delta) FROM field_data_field_counter WHERE entity_id = :entity_id", array(':entity_id' => $mid))->fetchField();
							db_insert('field_data_field_counter')
								->fields(array('entity_type' => 'privatemsg_message', 'bundle' => 'privatemsg_message', 'deleted' => 0, 'entity_id' => $mid, 'revision_id' => $mid, 'language' => 'und', 'delta' => $delta_count, 'field_counter_value' => 0))
								->execute();
							db_insert('field_revision_field_counter')
								->fields(array('entity_type' => 'privatemsg_message', 'bundle' => 'privatemsg_message', 'deleted' => 0, 'entity_id' => $mid, 'revision_id' => $mid, 'language' => 'und', 'delta' => $delta_count, 'field_counter_value' => 0))
								->execute();
								
							$delta_count = db_query("SELECT COUNT(delta) FROM field_data_field_mail_attachment WHERE entity_id = :entity_id", array(':entity_id' => $mid))->fetchField();
							db_insert('field_data_field_mail_attachment')
								->fields(array('entity_type' => 'privatemsg_message', 'bundle' => 'privatemsg_message', 'deleted' => 0, 'entity_id' => $mid, 'revision_id' => $mid, 'language' => 'und', 'delta' => $delta_count, 'field_mail_attachment_fid' => $file->fid, 'field_mail_attachment_display' => 1, 'field_mail_attachment_description' => ''))
								->execute();
							db_insert('field_revision_field_mail_attachment')
								->fields(array('entity_type' => 'privatemsg_message', 'bundle' => 'privatemsg_message', 'deleted' => 0, 'entity_id' => $mid, 'revision_id' => $mid, 'language' => 'und', 'delta' => $delta_count, 'field_mail_attachment_fid' => $file->fid, 'field_mail_attachment_display' => 1, 'field_mail_attachment_description' => ''))
								->execute();

							$delta_count = db_query("SELECT COUNT(delta) FROM field_data_field_download_files WHERE entity_id = :entity_id", array(':entity_id' => $mid))->fetchField();
							db_insert('field_data_field_download_files')
								->fields(array('entity_type' => 'privatemsg_message', 'bundle' => 'privatemsg_message', 'deleted' => 0, 'entity_id' => $mid, 'revision_id' => $mid, 'language' => 'und', 'delta' => $delta_count, 'field_download_files_download_fields' => 'field_mail_attachment;', 'field_download_files_download_label' => 'Download'))
								->execute();
							db_insert('field_revision_field_download_files')
								->fields(array('entity_type' => 'privatemsg_message', 'bundle' => 'privatemsg_message', 'deleted' => 0, 'entity_id' => $mid, 'revision_id' => $mid, 'language' => 'und', 'delta' => $delta_count, 'field_download_files_download_fields' => 'field_mail_attachment;', 'field_download_files_download_label' => 'Download'))
								->execute();
						}
					}
				}
			}
		}
	}
}

/**
 * Callback function import_live_data_bookmark()
 * to import user bookmark
 **/
function import_live_data_bookmark() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_bookmark', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_bookmark()
 * to save live user bookmark in drupal database
 **/
function import_data_bookmark($value, $operation_details, &$context) {
	print 'import_data_bookmark';
	print "<pre>";print_r($value);exit;
}

/**
 * Callback function import_live_data_subscription()
 * to import user subscription
 **/
function import_live_data_subscription() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_subscription', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_subscription()
 * to save live user subscription in drupal database
 **/
function import_data_subscription($value, $operation_details, &$context) {
	global $user;
	$ins_uid = $_POST['ins_uid'];
	$uid = $_POST['log_uid'];
	$email = $_POST['log_email'];
	$ins_name = $_POST['ins_name'];
	$subscribe_id = db_select('gmc_user_subscribe', 'gsi')
	  ->fields('gsi', array('subscribe_id'))
	  ->condition('entity_id', $ins_uid)
	  ->condition('type', 'uid')
	  ->condition('email', $email)
	  ->execute();
	$count = $subscribe_id->rowCount();
	if($count == 0) {
		$subscribe_id = db_insert('gmc_user_subscribe')
			->fields(array('uid' => $uid, 'entity_id' => $ins_uid, 'type' => 'uid', 'notification_method' => 'immediate', 'email' => $email, 'subscribe_date' => time()))
			->execute();
		if($subscribe_id) {
			print 'You will now receive an email notification as soon as '.$ins_name.' has published a new lesson!';
		}
		else {
			print 'Unable to subscribe at this time. Please try again later.';
		}
	}
	else {
		print 'You have already subscribed '.$ins_name.' lessons!';
	}
}

/**
 * Callback function import_live_data_user_referrals()
 * to import user referrals detail (signup referrals)
 **/
function import_live_data_user_referrals() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_user_referrals', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_user_referrals()
 * to save live user referrals detail (signup referrals) in drupal database
 **/
function import_data_user_referrals($value, $operation_details, &$context) {

	$referer = $_SESSION['referer_key'];
	$referer_uid = db_query("SELECT uid from gmc_referer_key where key_value = :key_value", array(':key_value' => $referer))->fetchField();
	if(!empty($referer_uid)) {
		$insert = db_insert('gmc_referer')
		->fields(array(
			'referer_uid' => $referer_uid,
			'new_member_uid' => $account->uid,
			'signup_time' => time(),
		))
		->execute();
		if($insert != '') {
			db_update('gmc_referer_key')
			->expression('bonus_level', 'bonus_level + 1')
			->condition('key_value', $referer)
			->execute();
			unset($_SESSION['referer_key']);
		}
	}
}

/**
 * Callback function import_live_data_featured_content_data()
 * to import featured content data
 **/
function import_live_data_featured_content_data() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_featured_content_data', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_featured_content_data()
 * to save live featured content data in drupal database
 **/
function import_data_featured_content_data($value, $operation_details, &$context) {
	print 'import_data_featured_content_data';
	print "<pre>";print_r($value);exit;
}


/**
 * Callback function import_live_data_student_video()
 * to import student video (Forum REC data)
 **/
function import_live_data_student_video() {
	$records = db_query("SELECT uid FROM users WHERE status = :status", array(':status' => 1));
	$i=1;
	foreach ($records as $values) {
		$operations[] = array('import_data_student_video', array($values, t('(Operation @operation)', array('@operation' => $i))));
		$i++;
	}
	$batch = array(
		'operations' => $operations,
		'finished' => 'import_data_finished',
	);
	return $batch;
}
/**
 * Callback function import_data_student_video()
 * to save live student video (Forum REC data) in drupal database
 **/
function import_data_student_video($value, $operation_details, &$context) {
	print 'import_data_student_video';
	print "<pre>";print_r($value);exit;
}

