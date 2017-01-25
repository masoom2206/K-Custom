<?php
function lesson_image($nid, $id) {
	$node_data = node_load($nid);
	$result = db_query("SELECT * FROM lv_file WHERE id = :id", array(":id" => $id))->fetchAll();	
	if (count($result) < 0) {
		$result = db_query("SELECT * FROM lm2_file WHERE id = :id", array(":id" => $id))->fetchAll();
	}
	$type = $result[0]->extension;
	$filename = $result[0]->filename;
	$path = "public://lesson_image/".$filename;
	if (!file_exists(drupal_realpath($path)) ) {
		$path = '/opt/web/guitarmasterclass.net/public_html/icp/lm2/files/files/uploads'.$result[0]->path.$result[0]->id.$result[0]->extension;
		$file_temp = file_get_contents($path);
		$file = file_save_data($file_temp, "public://lesson_image/" . $filename, FILE_EXISTS_REPLACE);
		$file->status = FILE_STATUS_PERMANENT;
		$file->uid = $node_data->uid;
		file_save($file);
	}
	$path = file_create_url($path);
	header('Content-type: image/jpeg');
	header('Content-Length: ' . filesize(drupal_realpath($path)));
  echo file_get_contents($path);
  //print 
  exit;
	//$image_url = file_create_url($path);
	//return $image_url;
}
