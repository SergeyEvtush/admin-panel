<?php
session_start();
if($_SESSION["auth"]!=true){
	header("HTTP/1.0 403 Forbiden");
	die;
}
 $_POST=json_decode(file_get_contents("php://input"),true); 
$newFile="../../" . $_POST["name"] . ".html";

if (file_exists($newFile)){
header("HTTP/1.0 400 bad Request");
}else{
	fopen($newFile,"w");
}