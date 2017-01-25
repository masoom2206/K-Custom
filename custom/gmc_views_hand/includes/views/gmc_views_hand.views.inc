<?php
// This file must be at gmc_views_hand/includes/views directory.
 
/**
* @file
* Views definitions for gmc_views_hand module.
*/
 
/**
* Implements hook_views_data().
*/
function gmc_views_hand_views_data() {
  $data = array();
  $data['node']['lessonimage'] = array(
    'title' => t('Lesson Image'),
    'help' => t('Add Lesson images.'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_handlername',
      'link_to_node default' => TRUE,
    ),
  );
  $data['node']['frontitlenode'] = array(
    'title' => t('Lesson Front Title or main Title'),
    'help' => t('Lesson Front Title.'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_handlernametwo',
    ),
  );
  $data['node']['freeparts'] = array(
    'title' => t('PHP Free Part 100%'),
    'help' => t('PHP Free Part 100%.'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_freeparts',
    ),
  );
  $data['comment']['loginstatus'] = array(
    'title' => t('Login Status of User'),
    'help' => t('login status of user'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_loginstatus',
    ),
  );
  $data['comment']['editcomment'] = array(
    'title' => t('GMC Forum edit comment'),
    'help' => t('GMC Forum edit comment link'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_editcomment',
    ),
  );
  $data['comment']['commentalleditlinks'] = array(
    'title' => t('GMC Forum Delete/Edit/Quote/Reply Comment '),
    'help' => t('GMC Forum Delete/Edit/Quote/Reply Comment link'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_commentalleditlinks',
    ),
  );  
  $data['comment']['commentbody'] = array(
    'title' => t('GMC Forum Comment Body'),
    'help' => t('GMC Forum Comment Body'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_commentbody',
    ),
  ); 
  $data['comment']['commentpostlink'] = array(
    'title' => t('GMC Forum Comment Post Link'),
    'help' => t('GMC Forum Comment Post Link'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_commentpostlink',
    ),
  );   
  $data['comment']['userpictured'] = array(
    'title' => t('GMC Forum User picture'),
    'help' => t('GMC Forum User picture'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_userpictured',
    ),
  );  
  $data['comment']['postdetails'] = array(
    'title' => t('GMC Forum Post/user/other details'),
    'help' => t('GMC Forum Post/user/other details'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_postdetails',
    ),
  );   
  $data['comment']['userrole'] = array(
    'title' => t('GMC Forum User Role'),
    'help' => t('GMC Forum User Role'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_userrole',
    ),
  ); 
  $data['comment']['usersignature'] = array(
    'title' => t('GMC Forum User Signature'),
    'help' => t('GMC Forum User Signature'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_usersignature',
    ),
  );   
  $data['comment']['commentreplyusername'] = array(
    'title' => t('GMC Forum User Name'),
    'help' => t('GMC Forum User Name'),
    'field' => array(
      'handler' => 'gmc_views_hand_handler_commentreplyusername',
    ),
  );  
  return $data;
}
