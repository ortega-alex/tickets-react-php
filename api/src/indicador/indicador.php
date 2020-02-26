<?php

require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';

getHeader();

$con = new dbClassMysql();
$res['err'] = "true";
$res['msj'] = "404 Pagina no encontrada";