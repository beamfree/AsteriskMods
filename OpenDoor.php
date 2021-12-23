#!/bin/php -q
<?php
require_once "/var/lib/asterisk/agi-bin/PHP/AGI/phpagi.php";
function OpenDoor($Password)
{
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "http://10.56.10.232/?open=".$Password);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0); 
	curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $output = curl_exec($ch);
        curl_close($ch);    
}


$agi = new AGI();
OpenDoor("Sogaz-med56");

?>
