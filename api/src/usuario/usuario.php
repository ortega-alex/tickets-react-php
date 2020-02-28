<?php

require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';

getHeader();

$con = new dbClassMysql(0);
$res['err'] = "true";
$res['msj'] = "404 Pagina no encontrada";

$intIdUsuairo = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 0;
$intIdRol = isset($_POST['id_rol']) ? intval($_POST['id_rol']) : 0;
$intIdPerfil = isset($_POST['id_perfil']) ? intval($_POST['id_perfil']) : 0;
$strUsuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
$strPass = isset($_POST['pass']) ? md5(trim($_POST['pass'])) : md5('oca' . date('Y'));
$strNewPass = isset($_POST['pass_new']) ? md5(trim($_POST['pass_new'])) : md5('oca' . date('Y'));
$strNombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$strEmail = isset($_POST['email']) ? trim($_POST['email']) : '';
$intEstado = isset($_POST['estado']) ? intval($_POST['estado']) : 0;
$intSoporte = isset($_POST['soporte']) ? intval($_POST['soporte']) : 0;
$intRestablecer = isset($_POST['restablecer']) ? intval($_POST['restablecer']) : 0;
$strDb = isset($_POST['db']) ? trim($_POST['db']) : "";
$strAsignacion = (isset($_POST['asignacion']) && !empty($_POST['asignacion'])) ? trim($_POST['asignacion']) : 0;

$arr = array("Contraseña incorrecta", "El usuario esta inactivo");

if (isset($_GET['login'])) {
    $strQuery = "   SELECT id_usuario, nombre, restablecer,
                            CASE
                                WHEN password != '{$strPass}' THEN 0
                                WHEN estado = 0 THEN 1
                                ELSE 2
                            END AS estado
                    FROM dbtickets.usuario
                    WHERE usuario = '$strUsuario'";

    $qTmp = $con->db_consulta($strQuery);
    if (mysqli_num_rows($qTmp) > 0) {
        $rTmp = $con->db_fetch_assoc($qTmp);
        if (intval($rTmp['estado']) == 2) {
            $usuario = array(
                'id_usuario' => $rTmp['id_usuario'],
                'usuario' => $strUsuario,
                'nombre' => $rTmp['nombre'],
                'restablecer' => intval($rTmp['restablecer']),
            );
            $res['msj'] = intval($rTmp['restablecer']) == 1 ? "Restablecer contraseña" : "Inicio de sesion realizada exitosamente";
            $res['err'] = "false";
            $res['usuario'] = $usuario;
        } else {
            $res['msj'] = $arr[intval($rTmp['estado'])];
        }
    } else {
        $res['msj'] = "Usuario incorrecto";
    }
}

if (isset($_GET['change_pass'])) {
    $strQuery = "   UPDATE dbtickets.usuario
                    SET restablecer = 0,
                        password = '{$strNewPass}'
                    WHERE id_usuario = {$intIdUsuairo}";
    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "La contraseña se restablecio correctamente";
    } else {
        $res['msj'] = "Ha ocurrido un error al restablecer la contraseña.";
    }
}

if (isset($_GET['get'])) {
    $strQuery = "  SELECT a.id_usuario, a.usuario, a.id_rol, a.nombre, a.email,
                        a.fecha_init, a.restablecer, a.estado, a.soporte,
                        IF (a.soporte = 1 , 'SI', 'NO') AS _soporte,
                        IF (a.estado = 1 , 'Activo', 'Inactivo') AS _estado,
                        b.id_perfil,
                        IF (b.nombre IS NULL, 'SIN ASIGNAR', b.nombre) AS perfil
                    FROM dbtickets.usuario a
                    LEFT JOIN dbtickets.perfil b ON a.id_perfil = b.id_perfil
                    ORDER BY a.nombre";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $strQuery1 = "  SELECT b.nombre
                        FROM dbtickets.usuario_departamento a
                        INNER JOIN dbtickets.departamento b ON a.id_departamento = b.id_departamento
                        WHERE a.id_usuario = {$rTmp->id_usuario}
                        AND a.estado = 1";
        $qTmp1 = $con->db_consulta($strQuery1);
        $arrDep = array();
        while ($rTmp1 = $con->db_fetch_object($qTmp1)) {
            $arrDep[] = $rTmp1->nombre;
        }
        $strDepartamento = (sizeof($arrDep) > 0) ? implode(',', $arrDep) : 'SIN ASIGNAR';

        $arr[] = array(
            'id_usuario' => $rTmp->id_usuario,
            'usuario' => $rTmp->usuario,
            'id_rol' => $rTmp->id_rol,
            'nombre' => $rTmp->nombre,
            'email' => $rTmp->email,
            'fecha' => date('d-m-Y', strtotime($rTmp->fecha_init)),
            'restablecer' => $rTmp->restablecer,
            'estado' => $rTmp->estado,
            '_estado' => $rTmp->_estado,
            'soporte' => $rTmp->soporte,
            '_soporte' => $rTmp->_soporte,
            'id_perfil' => $rTmp->id_perfil,
            'perfil' => $rTmp->perfil,
            'departamento' => $strDepartamento,
        );
    }
    $res['usuarios'] = $arr;
}

if (isset($_GET['get_roles_activos'])) {
    $strQuery = "   SELECT id_rol, nombre
                    FROM dbtickets.rol
                    WHERE estado = 1";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_rol' => $rTmp->id_rol,
            'nombre' => $rTmp->nombre,
        );
    }

    $arr[] = array(
        'id_rol' => '',
        'nombre' => '-- LIMPIAR --',
    );
    $res['roles_activos'] = $arr;
}

if (isset($_GET['get_perfiles_activos'])) {
    $strQuery = "   SELECT id_perfil, nombre
                    FROM dbtickets.perfil
                    WHERE estado = 1";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_perfil' => $rTmp->id_perfil,
            'nombre' => $rTmp->nombre,
        );
    }

    $arr[] = array(
        'id_perfil' => '',
        'nombre' => '-- LIMPIAR --',
    );
    $res['perfiles_activos'] = $arr;
}

if (isset($_GET['save'])) {
    if ($intIdUsuairo > 0) {
        $_AND = ($intRestablecer == 1) ? "password = '{$strPass}'," : "";
        $strQuery = "   UPDATE dbtickets.usuario
                        SET id_rol = {$intIdRol},
                            id_perfil = {$intIdPerfil},
                            usuario = '{$strUsuario}',
                            {$_AND}
                            nombre = '{$strNombre}',
                            email = '{$strEmail}',
                            soporte = {$intSoporte},
                            restablecer = {$intRestablecer},
                            estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_usuario = {$intIdUsuairo}";
    } else {
        $strQuery = "   INSERT INTO dbtickets.usuario (id_rol, id_perfil, usuario, password, nombre,
                                                        email, soporte, restablecer, estado)
                        VALUES( {$intIdRol}, {$intIdPerfil}, '{$strUsuario}', '{$strPass}', '{$strNombre}',
                                '{$strEmail}', {$intSoporte}, {$intRestablecer}, {$intEstado})";
    }

    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = 'Usuario guardado exitosamente';
    } else {
        $res['msj'] = 'Ha ocurrido un error!';
    }
}

if (isset($_GET['change_estado']) && $intIdUsuairo > 0) {
    $strQuery = "   UPDATE dbtickets.usuario
                    SET estado = {$intEstado},
                        fecha_edit = CURRENT_TIMESTAMP()
                    WHERE id_usuario = {$intIdUsuairo}";
    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = 'Cambios realizados exitosamente';
    } else {
        $res['msj'] = 'Ha ocurrido un error!';
    }
}

if (isset($_GET['get_ficha_usuario'])) {
    // TICKETS
    $strQuery = "   SELECT a.id_ticket AS id, a.nombre,
                        b.id_categoria AS _id, b.nombre AS _nombre
                    FROM dbtickets.ticket a
                    INNER JOIN dbtickets.categoria b ON a.id_categoria = b.id_categoria
                    ORDER BY b.nombre, a.nombre ASC";
    $qTmp = $con->db_consulta($strQuery);

    $arrTickets = array();
    $_nombre = null;
    $index1 = 0;
    $index2 = 0;

    while ($rTmp = $con->db_fetch_object($qTmp)) {
        if ($_nombre == $rTmp->_nombre) {
            $index2++;
        } else {
            $index1 = ($_nombre == null) ? 0 : $index1 + 1;
            $_nombre = $rTmp->_nombre;
            $index2 = 0;
        }
        $arrTickets[$index1][$rTmp->_nombre][$index2] = array(
            'id' => $rTmp->id,
            'nombre' => $rTmp->nombre,
            '_id' => $rTmp->_id,
            '_nombre' => $rTmp->_nombre,
        );
    }

    $strQuery = "   SELECT id_ticket
                    FROM dbtickets.usuario_ticket
                    WHERE id_usuario = {$intIdUsuairo}";
    $qTmp = $con->db_consulta($strQuery);
    $arrPermisos = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arrPermisos[] = $rTmp->id_ticket;
    }

    $res['tickets_usuario'] = $arrTickets;
    $res['tk_asignados'] = $arrPermisos;

    // HISTORIAL
    $strQuery = "   SELECT descripcion, fecha_init
                    FROM dbtickets.historial
                    WHERE id_usuario = {$intIdUsuairo}";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'descripcion' => $rTmp->descripcion,
            'fecha' => date('d-m-Y', strtotime($rTmp->fecha_init)),
        );
    }

    $res['historial_usuario'] = $arr;

    // PERMISOS
    $strQuery = "   SELECT a.id_acceso AS id, a.nombre AS nombre,
                        b.id_modulo AS _id, b.nombre AS _nombre
                    FROM dbtickets.acceso a
                    INNER JOIN dbtickets.modulo b ON a.id_modulo = b.id_modulo
                    ORDER BY b.nombre, a.nombre ASC";
    $qTmp = $con->db_consulta($strQuery);

    $arrModulos = array();
    $_nombre = null;
    $index1 = 0;
    $index2 = 0;

    while ($rTmp = $con->db_fetch_object($qTmp)) {
        if ($_nombre == $rTmp->_nombre) {
            $index2++;
        } else {
            $index1 = ($_nombre == null) ? 0 : $index1 + 1;
            $_nombre = $rTmp->_nombre;
            $index2 = 0;
        }
        $arrModulos[$index1][$rTmp->_nombre][$index2] = array(
            'id' => $rTmp->id,
            'nombre' => $rTmp->nombre,
            '_id' => $rTmp->_id,
            '_nombre' => $rTmp->_nombre,
        );
    }

    $strQuery = "   SELECT id_acceso
                    FROM dbtickets.acceso_usuario
                    WHERE id_usuario = {$intIdUsuairo}";
    $qTmp = $con->db_consulta($strQuery);
    $arrPermisos = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arrPermisos[] = $rTmp->id_acceso;
    }

    $res['permisos_usuario'] = $arrModulos;
    $res['pr_asignados'] = $arrPermisos;

    // DEPARTAMENTOS
    $strQuery = "   SELECT id_departamento, nombre
                    FROM dbtickets.departamento
                    ORDER BY nombre ASC";
    $qTmp = $con->db_consulta($strQuery);
    $arr = array();
    while($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id' => $rTmp->id_departamento,
            'nombre' => $rTmp->nombre
        );
    }

    $strQuery = "   SELECT id_departamento
                    FROM dbtickets.usuario_departamento
                    WHERE id_usuario = {$intIdUsuairo}";
    $arrPermisos = array();
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arrPermisos[] = $rTmp->id_departamento;
    }
    $res['departamentos_usuario'] = $arr;
    $res['dp_asignados'] = $arrPermisos;
}

if (isset($_GET['save_ficha'])) {
    $_db = ($strDb === "Tickets") ? "dbtickets.usuario_ticket" : (($strDb === "Permisos") ? "dbtickets.acceso_usuario" : "dbtickets.usuario_departamento");
    $_id = ($strDb === "Tickets") ? "id_usuario_ticket" : (($strDb === "Permisos") ? "id_acceso_usuario" : "id_usuario_departamento");
    $_param = ($strDb === "Tickets") ? "id_ticket" : (($strDb === "Permisos") ? "id_acceso" : "id_departamento");
    $strQuery = "   DELETE FROM {$_db}
                    WHERE id_usuario = {$intIdUsuairo}
                    AND {$_id} > 0";
    if ($con->db_consulta($strQuery)) {
        foreach (explode(",", $strAsignacion) as $key => $id_acceso) {
            $strQuery = "   INSERT INTO {$_db} ( id_usuario , {$_param})
                            VALUES ({$intIdUsuairo}, {$id_acceso})";
            if ($con->db_consulta($strQuery)) {
                $res['err'] = 'false';
                $res['msj'] = "Guardado exitosamente";
            } else {
                $res['msj'] = "Ha ocurido un error";
            }
        }
    } else {
        $res['msj'] = "Ha ocurido un error";
    }
}

if (isset($_GET['masivo'])) {
    if (sizeof($_FILES) > 0) {
        $name = "usuarios." . substr(strrchr($_FILES['file']['name'], "."), 1);
        $url = "../../public/files/" . $name;
        $_MV = move_uploaded_file($_FILES['file']['tmp_name'], $url);
        if (!empty($_MV)) {
            require_once '../../libs/PHPExcel.php';
            $inputFileType = PHPExcel_IOFactory::identify($url);
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load($url);
            $sheet = $objPHPExcel->getSheet(0);
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();

            $md5Pass = md5("oca" . date('Y'));
            for ($row = 2; $row <= $highestRow; $row++) {
                $strNombre = trim($sheet->getCell("A" . $row)->getValue());
                $strEmail = trim($sheet->getCell("B" . $row)->getValue());
                $strUser = trim($sheet->getCell("C" . $row)->getValue());

                $email = is_valid_email($strEmail) ? "'" . $strEmail . "'" : "NULL";

                if (!empty($strNombre) && !empty($strUser)) {
                    $strQuery = "   INSERT INTO dbtickets.usuario ( id_rol ,  usuario , password , email , nombre )
                                    VALUES ( 1 , '{$strUser}' , '{$md5Pass}' , {$email} , '{$strNombre}' )";
                                    print($strQuery);

                    mysqli_query($con, $strQuery);
                } 
            }

            $res['err'] = 'false';
            $res['msj'] = "Carga realizada exitosamente!";
        }
    } else {
        $res['msj'] = "No se pudo recuperar informacion de archivo!";
    }
}

print(json_encode($res));
$con->db_close();