<?php

require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';

getHeader();

$con = new dbClassMysql(0);
$res['err'] = "true";
$res['msj'] = "404 Pagina no encontrada";

$intIdCategoria = isset($_POST['id_categoria']) ? intval($_POST['id_categoria']) : 0;
$strNombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$arrIdAsignaciones = isset($_POST['ids_preguntas']) ? explode(',', $_POST['ids_preguntas']) : array();
$intEstado = isset($_POST['estado']) ? intval($_POST['estado']) : 0;

$intIdTicket = isset($_POST['id_ticket']) ? intval($_POST['id_ticket']) : 0;
$strDescripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
$strProcedimiento = isset($_POST['procedimiento']) ? trim($_POST['procedimiento']) : '';
$intTiempo = isset($_POST['tiempo']) ? intval($_POST['tiempo']) : 0;
$intMarcaTiempo = isset($_POST['marca_tiempo']) ? intval($_POST['marca_tiempo']) : 0;
$intPrioridad = isset($_POST['prioridad']) ? intval($_POST['prioridad']) : 0;
$intAutorizacion = isset($_POST['autorizacion']) ? intval($_POST['autorizacion']) : 0;
$intAutomatico = isset($_POST['automatico']) ? intval($_POST['automatico']) : 0;

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
                        tiempo, marca_tiempo, prioridad,autorizacion, automatico, estado
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
            'prioridad' => intval($rTmp->prioridad),
            'autorizacion' => $rTmp->autorizacion,
            'automatico' => $rTmp->automatico,
            'estado' => $rTmp->estado,
        );
    }
    $res['tickets_categoria'] = $arr;
}

if (isset($_GET['get_preguntas'])) {
    $strQuery = "   SELECT id_pregunta, nombre
                    FROM dbtickets.pregunta
                    WHERE estado = 1";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_pregunta' => $rTmp->id_pregunta,
            'id' => $rTmp->id_pregunta,
            'nombre' => $rTmp->nombre,
            'asignar' => 0,
            'valor' => 0,
        );
    }
    $res['preguntas'] = $arr;
}

if (isset($_GET['add_categoria'])) {
    if ($intIdCategoria > 0) {
        $strQuery = "   UPDATE dbtickets.categoria
                        SET nombre = '{$strNombre}',
                            estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_categoria = {$intIdCategoria}";
    } else {
        $strQuery = "   INSERT INTO dbtickets.categoria (nombre, estado)
                        VALUES ('{$strNombre}', {$intEstado})";
    }

    if ($con->db_consulta($strQuery)) {
        $size = sizeof($arrIdAsignaciones);
        if ($size > 0) {
            $id_categoria = ($intIdCategoria > 0) ? $intIdCategoria : $con->db_last_id();
            $strQuery = "   DELETE FROM dbtickets.pregunta_categoria
                            WHERE id_categoria = {$id_categoria}
                            AND id_pregunta_categoria > 0";
            if ($con->db_consulta($strQuery)) {
                $_values = null;
                foreach ($arrIdAsignaciones as $key => $value) {
                    $_arr = json_decode($value, true);
                    $pregunta = explode('-', $_arr['id_pregunta']);
                    if (($size - 1) == $key) {
                        $_values .= "({$pregunta[0]}, {$id_categoria}, {$pregunta[1]});";
                    } else {
                        $_values .= "({$pregunta[0]}, {$id_categoria}, {$pregunta[1]}),";
                    }
                }
                $strQuery = "   INSERT INTO dbtickets.pregunta_categoria (id_pregunta, id_categoria, calificacion)
                                VALUES {$_values}";
                if ($con->db_consulta($strQuery)) {
                    $res['err'] = "false";
                    $res['msj'] = "Categoria ingresada exitosamente";
                }
            } else {
                $res['msj'] = "Ha ocurrido un error!";
            }
        } else {
            $res['err'] = "false";
            $res['msj'] = "Categoria ingresada exitosamente";
        }
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['get_preguntas_categoria'])) {
    $strQuery = "   SELECT a.id_pregunta, a.nombre,
                        IF (b.id_categoria IS NOT NULL , 1 , 0) AS asignar,
                        IF (b.calificacion IS NOT NULL , b.calificacion , 0) AS valor
                    FROM dbtickets.pregunta a
                    LEFT JOIN dbtickets.pregunta_categoria b ON a.id_pregunta = b.id_pregunta AND id_categoria = {$intIdCategoria}";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    $ids_preguntas = array();
    $total = 0;
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_pregunta' => $rTmp->id_pregunta,
            'id' => $rTmp->id_pregunta,
            'nombre' => $rTmp->nombre,
            'asignar' => $rTmp->asignar,
            'valor' => $rTmp->valor,
        );
        if ($rTmp->asignar == 1) {
            $total += floatval($rTmp->valor);
            $ids_preguntas[] = array(
                'id_pregunta' => $rTmp->id_pregunta . "-" . intval($rTmp->valor),
            );
        }
    }
    $res['preguntas'] = $arr;
    $res['total'] = $total;
    $res['ids_preguntas'] = $ids_preguntas;
}

if (isset($_GET['cambio_estado_categoria'])) {
    $strQuery = "   UPDATE dbtickets.categoria
                    SET estado = {$intEstado},
                        fecha_edit = CURRENT_TIMESTAMP()
                    WHERE id_categoria = {$intIdCategoria}";
    if ($con->db_consulta($strQuery)) {
        $strQuery = "   UPDATE dbtickets.ticket
                        SET estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_categoria = {$intIdCategoria}
                        AND id_ticket > 0";
        if ($con->db_consulta($strQuery)) {
            $res['err'] = "false";
            $res['msj'] = "Cambio de estado realizado exitosamente!";
        } else {
            $res['msj'] = "Ha ocurrido un error!";
        }
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['add_ticket'])) {
    if ($intIdTicket > 0) {
        $strQuery = "   UPDATE dbtickets.ticket
                        SET id_categoria = {$intIdCategoria},
                            nombre = '{$strNombre}',
                            descripcion = '{$strDescripcion}',
                            procedimiento = '{$strProcedimiento}',
                            tiempo = {$intTiempo},
                            marca_tiempo = {$intMarcaTiempo},
                            prioridad = {$intPrioridad},
                            autorizacion = {$intAutorizacion},
                            automatico = {$intAutomatico},
                            estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_ticket = {$intIdTicket}";
    } else {
        $strQuery = "   INSERT INTO dbtickets.ticket (id_categoria, nombre, descripcion, procedimiento, tiempo,
                                                        marca_tiempo, prioridad, autorizacion, automatico, estado)
                        VALUES ({$intIdCategoria}, '{$strNombre}', '{$strDescripcion}', '{$strProcedimiento}', {$intTiempo},
                                {$intMarcaTiempo}, {$intPrioridad}, {$intAutorizacion}, {$intAutomatico}, {$intEstado})";
    }

    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Ticket guardado exitosamente!";
    } else {
        $res['mdj'] = "Ha ocurrido un error!";
    }
}

print(json_encode($res));
$con->db_close();
