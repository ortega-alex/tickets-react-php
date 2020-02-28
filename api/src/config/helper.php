<?php

function getHeader()
{
    header('Content-Type: application/json');
    ini_set("display_errors", 0);
    header('Access-Control-Allow-Origin: *');
}

function is_valid_email($str)
{
    $matches = null;
    return (1 === preg_match('/^[A-z0-9\\._-]+@[A-z0-9][A-z0-9-]*(\\.[A-z0-9_-]+)*\\.([A-z]{2,6})$/', trim($str), $matches));
}
