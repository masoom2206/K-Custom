<?php
function fontimage($text,$size,$color = '000000') {
	print $size;exit;
  ob_clean();
	$color = "#".$color;
	$text = urldecode($text);
	$options['text'] = $text;
	$options['text'] = str_replace('_and_','&', $options['text']);
	$options['text'] = str_replace('_slash_','/', $options['text']);
	$options['text'] = str_replace('_hash_','#', $options['text']);
	$options['text'] = str_replace('É','E', $options['text']);
	$options['text'] = str_replace('é','e', $options['text']);
	$text = $options['text'];
	$font = drupal_get_path("module","gmc_lessons_function")."/fonts/viper.ttf";
	$file_format	= 'png';
	$fileHash = drupal_realpath(drupal_get_path("module","gmc_lessons_function"))."/font/".md5($text.$size.$color).'.'.$file_format;
	$image = new Imagick();
	$draw = new ImagickDraw();
	$draw->setGravity(Imagick::GRAVITY_SOUTHWEST);
	$draw->setFont($font);
	$draw->setFontSize(($size / 72) * 96);
	$draw->setFillColor(new ImagickPixel($color));
	$textProperties = $image->queryFontMetrics($draw, $text);
	$_width	= (int) $textProperties['textWidth'];
	$_height = (int) $textProperties['textHeight'];
	$image->newImage($_width, $_height , new ImagickPixel('transparent'));
	$image->annotateImage($draw, 0, 0, 0, $text);
	$image->setImageFormat( $file_format );
	$image->writeImage($fileHash);
  header("Content-Type: image/png");
	echo $image;
	$image->clear();
	$image->destroy();
	exit;
}
