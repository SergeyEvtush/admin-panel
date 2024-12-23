<?php
 $_POST=json_decode(file_get_contents("php://input"),true); 

$file=$_POST["pageName"];
$newHtml=$_POST["html"];
$backups=json_decode(file_get_contents("../backups/backups.json"));
if(!is_dir("../backups/")){
	mkdir("../backups/");
}
if(!is_array($backups)){
	$backups=[];
}

if ($newHtml && $file)
{
	$backupFileName=uniqid() . ".html";
	copy("../../" . $file,"../backups/" . $backupFileName);
	array_push($backups,["page"=>$file,"file"=>$backupFileName,"time"=>date("H:i:s d:m:y")]);
	file_put_contents("../backups/backups.json",json_encode($backups));
file_put_contents("../../" . $file,$newHtml);}
else{
	header("HTTP/1.0 400 bad Request");
}