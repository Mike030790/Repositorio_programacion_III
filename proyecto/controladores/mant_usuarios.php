<?php
require_once("modelos/usuario.php");

$mensaje = "";

if (isset($_POST["btn_registrar"])) {
    $usuario = new Usuario();
    $usuario->usuario = $_POST["txt_usuario"];
    $usuario->contrasena = $_POST["txt_password"];

    if ($usuario->usuario == "" || $usuario->contrasena == "") {
        $mensaje = "Usuario y/o contraseña vacíos.";
    } else {
        if ($usuario->insertarUsuario()) {
            $mensaje = "Usuario registrado con éxito.";
        } else {
            $mensaje = "Error al registrar el usuario.";
        }
    }
}

require_once("vistas/mant_usuarios.php");
?>
