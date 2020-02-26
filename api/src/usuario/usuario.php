<?php

require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';

getHeader();

$con = new dbClassMysql();
$res['err'] = "true";
$res['msj'] = "404 Pagina no encontrada";

$strUser = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
$strPass = isset($_POST['pass']) ? trim($_POST['pass']) : '';
$arr = array("Contraseña incorrecta", "El usuario esta inactivo");
$strNewPass = isset($_POST['pass_new']) ? trim($_POST['pass_new']) : '';
$intIdUsuairo = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 0;

if (isset($_GET['login'])) {
    $pass = encrypt_password($strPass);

    $strQuery = "   SELECT id_usuario, nombre, restablecer,
                            CASE
                                WHEN password != {$pass} THEN 0
                                WHEN estado = 0 THEN 1
                                ELSE 2
                            END AS estado
                    FROM usuario
                    WHERE usuario = '$strUser'";

    $qTmp = $con->db_consulta($strQuery);
    if (mysqli_num_rows($qTmp) > 0) {
        $rTmp = $con->db_fetch_assoc($qTmp);
        if (intval($rTmp['estado']) == 2) {
            $usuario = array(
                'id_usuario' => $rTmp['id_usuario'],
                'usuario' => $strUser,
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
    $pass = encrypt_password($strNewPass);
    $strQuery = "   UPDATE usuario
                    SET restablecer = 0,
                        password = {$pass}
                    WHERE id_usuario = {$intIdUsuairo}";
    if ($con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "La contraseña se restablecio correctamente";
    } else {
        $res['msj'] = "Ha ocurrido un error al restablecer la contraseña.";
    }
}

print(json_encode($res));
$con->db_close();