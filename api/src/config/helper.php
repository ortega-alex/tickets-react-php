<?php

function encrypt_password($pass)
{
    $val = 0;
    for ($i = 0; $i < strlen($pass); $i++) {
        $val += ord(substr($pass, $i, 1));
    }
    return $val;
}

function getHeader()
{
    header('Content-Type: application/json');
    ini_set("display_errors", 0);
    header('Access-Control-Allow-Origin: *');
}
