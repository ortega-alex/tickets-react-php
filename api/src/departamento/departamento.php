<?php

require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';

getHeader();

$con = new dbClassMysql(0);
$res['err'] = "true";
$res['msj'] = "404 Pagina no encontrada";

$intIdUsuario = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 0;
$intIdUsuarioDepartamento = isset($_POST['id_usuario_departamento']) ? intval($_POST['id_usuario_departamento']) : 0;
$intIdDepartamento = isset($_POST['id_departamento']) ? intval($_POST['id_departamento']) : 0;
$intEstado = isset($_POST['estado']) ? intval($_POST['estado']) : 0;
$strNombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';

if (isset($_GET['get'])) {
    $strQuery = "   SELECT id_departamento, nombre, estado,
                            IF(estado = 1, 'Activo', 'Inactico') AS _estado
                    FROM dbtickets.departamento";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_departamento' => $rTmp->id_departamento,
            'nombre' => $rTmp->nombre,
            'estado' => $rTmp->estado,
            '_estado' => $rTmp->_estado,
        );
    }
    $res['departamentos'] = $arr;
}

if (isset($_GET['get_activos'])) {
    $strQuery = "   SELECT id_departamento, nombre
                    FROM dbtickets.departamento
                    WHERE estado = 1
                    ORDER BY nombre";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_departamento' => $rTmp->id_departamento,
            'nombre' => $rTmp->nombre,
        );
    }
    $res['departamentos_activos'] = $arr;
}

if (isset($_GET['add'])) {
    if ($intIdDepartamento > 0) {
        $strQuery = "   UPDATE dbtickets.departamento
                        SET nombre = '{$strNombre}',
                            estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_departamento = {$intIdDepartamento}";
    } else {
        $strQuery = "   INSERT INTO dbtickets.departamento (nombre, estado)
                        VALUES ('{$strNombre}', {$intEstado})";
    }

    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Departamento guardado exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['cambiar_estado_departamento'])) {
    $strQuery = "   UPDATE dbtickets.departamento
                    SET estado = {$intEstado},
                        fecha_edit = CURRENT_TIMESTAMP()
                    WHERE id_departamento = {$intIdDepartamento}";
    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = 'Departamento actualizado correctamente!';
    } else {
        $res['msj'] = 'Ha ocurrido un error!';
    }
}

if (isset($_GET['get_asignaciones_departamento'])) {
    $strQuery = "  SELECT a.id_usuario_departamento, a.id_departamento, a.estado,
                        IF (a.estado = 1, 'Activo' , 'Inactivo') AS _estado,
                        b.id_usuario, b.nombre,
                        c.id_perfil, IF (c.nombre IS NULL, 'SIN ASIGNAR', c.nombre) AS puesto
                    FROM dbtickets.usuario_departamento a
                    INNER JOIN dbtickets.usuario b ON a.id_usuario = b.id_usuario
                    LEFT JOIN dbtickets.perfil c ON b.id_perfil = c.id_perfil
                    WHERE a.id_departamento = {$intIdDepartamento}
                    ORDER BY puesto, nombre";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_usuario_departamento' => $rTmp->id_usuario_departamento,
            'id_departamento' => $rTmp->id_departamento,
            'estado' => $rTmp->estado,
            '_estado' => $rTmp->_estado,
            'id_usuario' => $rTmp->id_usuario,
            'nombre' => $rTmp->nombre,
            'id_perfil' => $rTmp->id_perfil,
            'puesto' => $rTmp->puesto,
        );
    }
    $res['asignaciones_departamento'] = $arr;
}

if (isset($_GET['add_asignacion'])) {
    if ($intIdUsuarioDepartamento > 0) {
        $strQuery = "   UPDATE dbtickets.usuario_departamento
                        SET id_usuario = {$intIdUsuario},
                            id_departamento = {$intIdDepartamento},
                            estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_usuario_departamento = {$intIdUsuarioDepartamento}";
    } else {
        $strQuery = "   INSERT INTO dbtickets.usuario_departamento (id_usuario, id_departamento, estado)
                        VALUES ({$intIdUsuario}, {$intIdDepartamento}, {$intEstado})";
    }

    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Asignación realizada exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['cambiar_estado_asignacion'])) {
    $strQuery = "   UPDATE dbtickets.usuario_departamento
                    SET estado = {$intEstado},
                        fecha_edit = CURRENT_TIMESTAMP()
                    WHERE id_usuario_departamento = {$intIdUsuarioDepartamento}";
    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = 'Asignación actualizado correctamente!';
    } else {
        $res['msj'] = 'Ha ocurrido un error!';
    }
}

print(json_encode($res));
$con->db_close();
