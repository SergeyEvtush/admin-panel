<?php

if(file_exists($_FILES["image"] ["tmp_name"]) && is_uploaded_file($_FILES["image"] ["tmp_name"])){
	$fileExp=explode("/",$_FILES["image"]["type"])[1];
$fileName=uniqid() . "." . $fileExp;
	move_uploaded_file($_FILES["image"] ["tmp_name"], "../../img/" . $fileName);
echo json_encode(array("src"=>$fileName));

}