<?php
/***************************************************************************
 *                            functions_chat.php
 *                            -------------------
 *   begin                : Thursday, Nov 11, 2005
 *   copyright            : (C) 2008 TopCMM Computing Inc.
 *   email                : support@123flashchat.com
 *   
 *   123 Flash Chat Server - Ipb integration MOD
 *
 ***************************************************************************/

include "flashchatconf/config.php";

function getChatterList() {
	global $running_mode, $free_server_path, $room_name, $primary_server_host,$chat_data_path;
	
	if ($running_mode == 1) {
		
		return chat_getChatterListFromLocalServer ( chat_checkSlash($chat_data_path) );
	} else if ($running_mode == 2) {
		return chat_getChatterListFromExtendServer ( $primary_server_host );
	} else if ($running_mode == 3) {
		return chat_getChatterListFromFreeServer ( $free_server_path, $room_name );
	}

}

function getChatters() {
	global $running_mode, $free_server_path, $room_name, $primary_server_host,$chat_data_path;
	
	if ($running_mode == 1) {
		
		return chat_getChattersFromLocalServer ( chat_checkSlash($chat_data_path) );
	} else if ($running_mode == 2) {
		return chat_getChattersFromExtendServer ( $primary_server_host );
	} else if ($running_mode == 3) {
		return chat_getChattersFromFreeServer ( $free_server_path, $room_name );
	}

}



function chat_getChatterListFromFreeServer($free_server_path, $roomname) {
	if ($roomname == '')
		$roomname = $_SERVER ['HTTP_HOST'];
	$userListStr = "<script lanauge=javascript src='" . $free_server_path . "freeroomuser.php?roomname=" . rawurlencode ( $roomname ) . "'></script>";
	return $userListStr;
}

function chat_getChattersFromFreeServer($free_server_path, $roomname) {
	$room = array ();
	if ($roomname == '')
		$roomname = $_SERVER ['HTTP_HOST'];
	$room ['logon_users'] = "<script lanauge=javascript src='" . $free_server_path . "freeroomnum.php?roomname=" . rawurlencode ( $roomname ) . "'></script>";
	return $room;
}

function chat_getChattersFromLocalServer($chat_data_path) {
	
	$room = array ();
	$room ['connections'] = 0;
	$room ['logon_users'] = 0;
	$room ['room_numbers'] = 0;
	
	$online_file = $chat_data_path . "online.txt";
	
	if (! file_exists ( $online_file )) {
		return $room;
	}
	
	if (! $row = file ( $online_file )) {
		return $room;
	}
	
	$room_data = explode ( "|", $row [0] );
	
	if (count ( $room_data ) == 3) {
		$room ['connections'] = intval ( $room_data [0] );
		$room ['logon_users'] = intval ( $room_data [1] );
		$room ['room_numbers'] = intval ( $room_data [2] );
	}
	
	return $room;
}

function chat_getChattersFromExtendServer($primary_server_host) {
	$room = array ();
	

	$room ['connections'] = "<script lanauge=javascript src='http://" . $primary_server_host . "/connections.php'></script>";
	$room ['logon_users'] = "<script lanauge=javascript src='http://" . $primary_server_host . "/logon_users.php'></script>";
	$room ['room_numbers'] = "<script lanauge=javascript src='http://" . $primary_server_host . "/room_numbers.php'></script>";
	
	return $room;
}

function chat_getChatterListFromLocalServer($chat_data_path) {
	
	

	if(!@dir($chat_data_path))return "chat data path error";
	
	$userListStr = "";
	
	$d = dir ( $chat_data_path );
	
	while ( false !== ($entry = $d->read ()) ) {
		$rest = substr ( $entry, 0, 5 );
		if ($rest == "room_") {
			
			if (file_exists ( $chat_data_path . $entry )) {
				
				$f_users = file ( $chat_data_path . $entry );
				
				for($i = 0; $i < count ( $f_users ); $i ++) {
					$f_line = trim ( $f_users [$i] );
					
					if ($f_line != "") {
						$userListStr = ($userListStr == "") ? $f_line : $userListStr . "," . $f_line;
					}
				}
			
			}
		}
	
	}
	$d->close ();
	
	$userListStr = ($userListStr == "") ? "None" : $userListStr;
	return $userListStr;
}

function chat_getChatterListFromExtendServer($primary_server_host) {
	$userListStr = "<script lanauge=javascript src='http://" . $primary_server_host . "/user_list.php'></script>";
	$userListStr = (empty ( $userListStr )) ? "None" : $userListStr;
	return $userListStr;
}



function chat_checkSlash($path)
{
	if(substr($path,-1,1) != "/" && !empty($path)){
		$path = $path."/";
	}
	return $path;
}
?>