<?php
// This file must be at views directory.
 
/**
* @file
* Views definitions for gmc_view module.
*/
 
/**
* Implements hook_views_data().
*/
function gmc_view_views_data() {
	$data = array();
	$data['forums_extra']['table']['group'] = t('GMC Forum Extra');
	$data['forums_extra']['table']['join'] = array(
		'node' => array(
			'left_field' => 'nid',
			'field' => 'forum_nid',
		),
		'field_data_taxonomy_forums' => array(
			'left_field' => 'tid',
			'field' => 'taxonomy_forums_tid',
		),
	);
	$data['forums_extra']['table']['base'] = array(
		'field' => 'id',
		'title' => t('Forums Extra'),
		'help' => t('Contains records of forum.'),
	);
	// The TID field
	$data['forums_extra']['tid'] = array(
		'title' => t('Forum TID'),
		'help' => t('The Forum TID.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
			'click sortable' => TRUE,
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The forum_nid field
	$data['forums_extra']['forum_nid'] = array(
		'title' => t('Forum NID'),
		'help' => t('The Forum NID.'),
		'field' => array(
			'handler' => 'views_handler_field_node',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
		'relationship' => array(
			'base' => 'node',
			'field' => 'forum_nid',
			'handler' => 'views_handler_relationship',
			'label' => t('Node'),
		),
		'argument' => array(
			'handler' => 'views_handler_argument_node_nid',
			'numeric' => TRUE,
			'validate type' => 'nid',
		),
	);
	// The forum_topic_count field
	$data['forums_extra']['forum_topic_count'] = array(
		'title' => t('Forum Topic Count'),
		'help' => t('The Forum Topic Count.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The forum_reply_count field
	$data['forums_extra']['forum_reply_count'] = array(
		'title' => t('Forum Reply Count'),
		'help' => t('The Forum Reply Count.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The last_update_title field
	$data['forums_extra']['last_update_title'] = array(
		'title' => t('Forum Last Update Title'),
		'help' => t('The Forum Last Update Title.'),
		'field' => array(
			'handler' => 'views_handler_field',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The last_update_uid field
	$data['forums_extra']['last_update_uid'] = array(
		'title' => t('Forum Last Update Uid'),
		'help' => t('The Forum Last Update Uid.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The last_update_user_name field
	$data['forums_extra']['last_update_user_name'] = array(
		'title' => t('Forum Last Update User name'),
		'help' => t('The Forum Last Update User name.'),
		'field' => array(
			'handler' => 'views_handler_field',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The last_update_time field
	$data['forums_extra']['last_update_time'] = array(
		'title' => t('Forum Last Update Time'),
		'help' => t('The Forum Last Update Time.'),
		'field' => array(
			'handler' => 'views_handler_field_date',
		),
		'sort' => array(
			'handler' => 'views_handler_sort_date',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_date',
		),
	);
	
	//Topic Extra table
	$data['topics_extra']['table']['group'] = t('GMC Topics Extra');
	$data['topics_extra']['table']['join'] = array(
		'node' => array(
			'left_field' => 'nid',
			'field' => 'nid',
		),
		'users' => array(
			'left_field' => 'uid',
			'field' => 'uid',
		),
		'taxonomy_term_data' => array(
			'left_field' => 'tid',
			'field' => 'tid',
		),
	);
	$data['topics_extra']['table']['base'] = array(
		'field' => 'id',
		'title' => t('Topic Extra'),
		'help' => t('Contains records of forum topics.'),
	);
	// The nid field
	$data['topics_extra']['nid'] = array(
		'title' => t('Topic NID'),
		'help' => t('The Forum NID.'),
		'field' => array(
			'handler' => 'views_handler_field_node',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
		'relationship' => array(
			'base' => 'node',
			'field' => 'nid',
			'handler' => 'views_handler_relationship',
			'label' => t('Node'),
		),
		'argument' => array(
			'handler' => 'views_handler_argument_node_nid',
			'numeric' => TRUE,
			'validate type' => 'nid',
		),
	);
	// The uid field
	$data['topics_extra']['uid'] = array(
		'title' => t('Topic UID'),
		'help' => t('The Topic UID.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The tid field
	$data['topics_extra']['tid'] = array(
		'title' => t('Forum Topic TID'),
		'help' => t('The Forum Topic TID.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The last_comment field
	$data['topics_extra']['last_comment'] = array(
		'title' => t('Topic Last Comment'),
		'help' => t('The Topic Last Comment.'),
		'field' => array(
			'handler' => 'views_handler_field',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The last_comment_uid field
	$data['topics_extra']['last_comment_uid'] = array(
		'title' => t('Topic Last Comment UID'),
		'help' => t('The Topic Last Comment UID.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The last_comment_time field
	$data['topics_extra']['last_comment_time'] = array(
		'title' => t('Topic Last Comment Time'),
		'help' => t('The Topic Last Comment Time.'),
		'field' => array(
			'handler' => 'views_handler_field_date',
		),
		'sort' => array(
			'handler' => 'views_handler_sort_date',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_date',
		),
	);
	// The forum_view_count field
	$data['topics_extra']['forum_view_count'] = array(
		'title' => t('Forum View Count'),
		'help' => t('The Forum View Count.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The forum_reply_count field
	$data['topics_extra']['forum_reply_count'] = array(
		'title' => t('Topic Reply Count'),
		'help' => t('The Topic Reply Count.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The last_update_title field
	$data['topics_extra']['last_update_title'] = array(
		'title' => t('Topic Last Update Title'),
		'help' => t('The Topic Last Update Title.'),
		'field' => array(
			'handler' => 'views_handler_field',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The last_update_uid field
	$data['topics_extra']['last_update_uid'] = array(
		'title' => t('Topic Last Update UID'),
		'help' => t('The Topic Last Update UID.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The last_update_user_name field
	$data['topics_extra']['last_update_user_name'] = array(
		'title' => t('Topic Last Update User Name'),
		'help' => t('The Topic Last Update User Name.'),
		'field' => array(
			'handler' => 'views_handler_field',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The last_update_time field
	$data['topics_extra']['last_update_time'] = array(
		'title' => t('Topic Last Update Time'),
		'help' => t('The Topic Last Update Time.'),
		'field' => array(
			'handler' => 'views_handler_field_date',
		),
		'sort' => array(
			'handler' => 'views_handler_sort_date',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_date',
		),
	);
	
	//Users Extra table
	$data['users_extra']['table']['group'] = t('GMC Users Extra');
	$data['users_extra']['table']['join'] = array(
		/*'node' => array(
			'left_field' => 'uid',
			'field' => 'uid',
		),*/
		'users' => array(
			'left_field' => 'uid',
			'field' => 'uid',
		),
	);
	$data['users_extra']['table']['base'] = array(
		'field' => 'id',
		'title' => t('Users Extra'),
		'help' => t('Contains records of users.'),
	);
	// The uid field
	$data['users_extra']['uid'] = array(
		'title' => t('GMC Users UID'),
		'help' => t('The GMC Users UID.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The user_group field
	$data['users_extra']['user_group'] = array(
		'title' => t('User Group Name'),
		'help' => t('The User Group Name.'),
		'field' => array(
			//'handler' => 'views_handler_field',
			'handler' => 'views_handler_field_markup',
			'format' => 'full_html', 
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The forum_post_count field
	$data['users_extra']['forum_post_count'] = array(
		'title' => t('User Forum Post Count'),
		'help' => t('The User Forum Post Count.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	// The user_full_name field
	$data['users_extra']['user_full_name'] = array(
		'title' => t('GMC User Full Name'),
		'help' => t('The GMC User Full Name.'),
		'field' => array(
			'handler' => 'views_handler_field',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_string',
		),
	);
	// The profile_views_count field
	$data['users_extra']['profile_views_count'] = array(
		'title' => t('User Profile View Count'),
		'help' => t('The User Profile View Count.'),
		'field' => array(
			'handler' => 'views_handler_field_numeric',
		),
		'sort' => array(
			'handler' => 'views_handler_sort',
		),
		'filter' => array(
			'handler' => 'views_handler_filter_numeric',
		),
	);
	return $data;
/*
  $data['node_view_count']['table']['join'] = array(
    'node' => array(
      'left_field' => 'nid',
      'field' => 'nid'
    )
  );
  $data['node_view_count']['table']['join'] = array(
    'node_view_count' => array(
      'left_field' => 'nid',
      'field' => 'nid',
    ),
  );

  $data['node_view_count']['countd'] =array(
    'title' => t('uid Code'),
    'help' => t('Study uid code'),
    'field' => array(
      'handler' => 'views_handler_field_numeric',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'relationship' => array(
      'title' => t('Product display (node)'),
      'help' => t("Relate this List to its owner's user account"),
      'handler' => 'views_handler_relationship',
      'base' => 'node_view_count',
      'base field' => 'nid',
      'field' => 'nid',
      'label' => t('List product display'),
    ),
  );
  return $data;
  */
}
