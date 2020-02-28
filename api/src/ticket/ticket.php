<?php

require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';

getHeader();

$con = new dbClassMysql(0);
$res['err'] = "true";
$res['msj'] = "404 Pagina no encontrada";

$intIdCategoria = isset($_POST['id_categoria']) ? intval($_POST['id_categoria']) : 0;

if (isset($_GET['get_categorias'])) {
    $strQuery = "   SELECT id_categoria, nombre, estado
                    FROM dbtickets.categoria";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_categoria' => $rTmp->id_categoria,
            'nombre' => $rTmp->nombre,
            'estado' => $rTmp->estado,
        );
    }
    $res['categorias'] = $arr;
}

if (isset($_GET['get_tickets_categorias'])) {
    $strQuery = "   SELECT id_ticket, id_categoria, nombre, descripcion, procedimiento,
                        tiempo, marca_tiempo, prioridad, automatico, estado
                    FROM dbtickets.ticket
                    WHERE id_categoria = {$intIdCategoria}
                    ORDER BY nombre ASC";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_ticket' => $rTmp->id_ticket,
            'id_categoria' => $rTmp->id_categoria,
            'nombre' => $rTmp->nombre,
            'descripcion' => $rTmp->descripcion,
            'procedimiento' => $rTmp->procedimiento,
            'tiempo' => $rTmp->tiempo,
            'marca_tiempo' => $rTmp->marca_tiempo,
            'prioridad' => $rTmp->prioridad,
            'automatico' => $rTmp->automatico,
            'estado' => $rTmp->estado,
        );
    }
    $res['tickets_categoria'] = $arr;
}

print(json_encode($res));
$con->db_close();
