<?php
require_once("modelos/login.php");

$mensaje = "";
if (isset($_POST["btn_ingresar"])) {
    $login = new usuario();
    $login->usuario = $_POST["txt_usuario"];
    $login->contrasena = $_POST["txt_password"];
    
    if ($login->usuario == "" || $login->contrasena == "") {
        $mensaje = "Usuario y/o contraseña vacías.";
    } else {
        if ($login->login()) {
            $_SESSION["NOMBRE_USUARIO"] = $login->usuario;
            header('Location: index.php?modulo=listado_reserva');
            exit();
        } else {
            $mensaje = "Usuario y/o contraseña incorrectos.";
        }
    }
}

require_once("vistas/login.php");
?>


