<?php

# Llama al modelo.
require_once("modelos/reserva.php");
$mensaje = "";

$reserva = new Reservas();

if(isset($_POST["btn_eliminar"])){
    $reserva->id_reserva = $_POST["id_reserva"];
    $reserva->eliminarReserva(); 
    $mensaje = "Reservación Eliminada";

}

// Carga la lista de reservas
$reservas = $reserva->listarTodasReservas();
require_once("vistas/listado_reservas.php");
?>                                                                    