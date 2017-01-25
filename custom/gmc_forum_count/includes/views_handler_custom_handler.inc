<?php
/**
 * @file
 * Custom views handler definition.
 *
 * Place this code in
 * /sites/all/[custom_module_name]/includes/views_handler_custom_handler.inc
 */
 
/**
 * Custom handler class.
 *
 * @ingroup views_field_handlers
 */
class views_handler_custom_handler extends views_handler_field {
  /**
   * {@inheritdoc}
   *
   * Perform any database or cache data retrieval here. In this example there is
   * none.
   */
  function query() {
 
  }
 
  /**
   * {@inheritdoc}
   *
   * Modify any end user views settings here. Debug $options to view the field
   * settings you can change.
   */
  function option_definition() {
    $options = parent::option_definition();
    return $options;
  }
 
  /**
   * {@inheritdoc}
   *
   * Make changes to the field settings form seen by the end user when adding
   * your field.
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
  }
 
  /**
   * Render callback handler.
   *
   * Return the markup that will appear in the rendered field.
   */
  function render($values) {
	//$uid = $this->get_value($values, 'users_node_uid');
	//print "<pre>";print_r($values);
	if(isset($values->uid))
		$uid = $values->uid;
	if(isset($values->node_uid))
		$uid = $values->node_uid;
	else if(isset($values->users_node_uid))
		$uid = $values->users_node_uid;
	else if(isset($values->users_comment_uid))
		$uid = $values->users_comment_uid;
	else
		return t('Add " Content: Author uid" field');
	if(!empty($uid)) {
		//$uid = $values->node_uid;
		$query = db_select('comment', 'c');
		$query->join('node', 'n', 'c.nid = n.nid');
		$query->condition('c.uid', $uid, '=');
		$query->condition('n.type', 'forum', '=');
		$query->condition('n.status', '1', '=');
		$query->condition('c.status', '1', '=');
		$query->addExpression('COUNT(1)', 'count');
		$result = $query->execute();

		if ($record = $result->fetchAssoc())
			return t('Some custom markup ='.$record['count']);
	}
	else {
		return t('Add " Content: Author uid" field');
	}
  }
}