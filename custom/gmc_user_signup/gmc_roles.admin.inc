<?php
/**
 * @file
 * Roles administration menu items.
 */

/**
 * Creates the header for the table/pager.
 */
function gmc_roles_expiration_header() {
  return array(
    array('data' => t('Username'), 'field' => 'u.name'),
    array('data' => t('Role'), 'field' => 'e.rid'),
    array('data' => t('Expiration date'), 'field' => 'e.expiration', 'sort' => 'asc'),
    array('data' => t('Operations'), 'colspan' => 2),
  );
}

/**
 * Menu callback for viewing user expirations date.
 */
function gmc_roles_expiration($form, &$form_state){
  // Create the header for the pager.
  $header = gmc_roles_expiration_header();

  // Grab all the info to build the pager.
  $query = db_select('uc_roles_expirations', 'e')->extend('PagerDefault')->extend('TableSort')
    ->fields('e')
    ->limit(50)
    ->orderByHeader($header);

  $query->join('users', 'u', 'e.uid = u.uid');
  $default_name = '';
  if(isset($_GET['username']) && $_GET['username'] != '') {
	$query->condition('u.name', db_like($_GET['username']).'%', 'LIKE');
	$default_name = $_GET['username'];
  }
  $query->fields('u');

  $result = $query->execute();

  // Stick the expirations into the form.
	$form['username'] = array(
		'#type' => 'textfield', 
		'#title' => t('Username'), 
		'#size' => 20, 
		'#maxlength' => 128,
		'#default_value' => $default_name,
	);
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Apply'),
	);
	$form['actions']['reset'] = array(
		'#type' => 'submit',
		'#value' => t('Reset'),
	);
  foreach ($result as $row) {
    $account = user_load($row->uid);
    $name = check_plain(format_username($account));
    $form['name'][$row->uid . ' ' . $row->rid] = array(
      '#theme' => 'username',
      '#account' => $account,
      '#name' => $name,
    );
    $form['role'][$row->uid . ' ' . $row->rid] = array('#markup' => check_plain(_uc_roles_get_name($row->rid)));
    $form['expiration'][$row->uid . ' ' . $row->rid] = array('#markup' => format_date($row->expiration, 'short'));
    $form['edit'][$row->uid . ' ' . $row->rid] = array('#markup' => l(t('edit'), 'user/' . $row->uid . '/edit', array('fragment' => 'role-expiration-' . $row->rid, 'query' => array('destination' => 'admin/people/expiration'))));
    $form['delete'][$row->uid . ' ' . $row->rid] = array('#markup' => l(t('delete'), 'admin/people/expiration/delete/' . $row->uid . '/' . $row->rid));
  }

  return $form;
}

/**
 * Themes user role expiration page.
 *
 * @param $variables
 *   An associative array containing:
 *   - form: A render element representing the form.
 *
 * @ingroup themeable
 */
function theme_gmc_roles_expiration($variables) {
  $form = $variables['form'];

  $header = gmc_roles_expiration_header();
  $rows = array();
  
  //$rows[] = array(drupal_render($form['username']),drupal_render($form['actions']));
  if (isset($form['name'])) {
    foreach (element_children($form['name']) as $key) {
      $rows[] = array(
        drupal_render($form['name'][$key]),
        drupal_render($form['role'][$key]),
        drupal_render($form['expiration'][$key]),
        drupal_render($form['edit'][$key]),
        drupal_render($form['delete'][$key]),
      );
    }
  }
  $output = '';
  $output .= drupal_render($form['username']);
  $output .= drupal_render($form['actions']);

  $output .= theme('table', array(
    'header' => $header,
    'rows' => $rows,
    'empty' => t('No expirations set to occur'),
  ));
  $output .= theme('pager');
  $output .= drupal_render_children($form);

  return $output;
}

function gmc_roles_expiration_submit($form, &$form_state){
	$username = $form_state['input']['username'];
	if($form_state['input']['op'] == 'Reset') {
		drupal_goto('admin/people/gmc-expiration');
	}
	else {
		drupal_goto('admin/people/gmc-expiration', array('query' => array('username' => $username)));
	}
}