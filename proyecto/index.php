<?php
session_start();
if (!isset($_SESSION["NOMBRE_USUARIO"])) {
    require_once("controladores/login.php");
} else {
    if (isset($_GET["modulo"])) {
        $modulo = $_GET["modulo"];
        switch ($modulo) {
            case "listado_reserva":
                require_once("controladores/listado_reservas.php");
                break;
            case "mantenimiento_reservas":
                require_once("controladores/mantenimiento_reservas.php");
                break;
            case "mant_usuarios":
                require_once("controladores/mant_usuarios.php");
                break;
            default:
                require_once("controladores/login.php");
                break;
        }
    } else {
        require_once("controladores/listado_reservas.php");
    }
}
?>


