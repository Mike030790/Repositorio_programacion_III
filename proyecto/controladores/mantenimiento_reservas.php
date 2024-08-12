<?php
require_once("modelos/reserva.php");

$mensaje = "";

if (isset($_POST["btn_ingresar"])) 
{
    $reserva = new reservas();

    // Setear los valores
    $reserva->cliente_nombre = $_POST["txt_cliente_nombre"];
    $reserva->cliente_apellido = $_POST["txt_cliente_apellido"];
    $reserva->cliente_telefono = $_POST["txt_cliente_telefono"];
    $reserva->hotel_nombre = $_POST["txt_hotel_nombre"];
    $reserva->fecha_reservacion = $_POST["txt_fecha_reservacion"];
    $reserva->observaciones = $_POST["txt_observaciones"];

    $reserva->insertarReserva();
    $mensaje = "La información fue ALMACENADA correctamente";
    header('Location: index.php?modulo=listado_reserva');
    
}

if (isset($_POST["btn_actualizar"]))
{
    $reserva = new reservas();

    // Setear los valores
    $reserva->id_reserva = $_POST["txt_id_reserva"];
    $reserva->cliente_nombre = $_POST["txt_cliente_nombre"];
    $reserva->cliente_apellido = $_POST["txt_cliente_apellido"];
    $reserva->cliente_telefono = $_POST["txt_cliente_telefono"];
    $reserva->hotel_nombre = $_POST["txt_hotel_nombre"];
    $reserva->fecha_reservacion = $_POST["txt_fecha_reservacion"];
    $reserva->observaciones = $_POST["txt_observaciones"];

    $reserva->actualizarReserva();
    header('Location: index.php?modulo=listado_reserva');
    $mensaje = "La información fue ACTUALIZADA correctamente";
}

if (isset($_POST["btn_editar"]))
{
    $reserva = new reservas();
    $reserva -> id_reserva = $_POST["id_reserva"];
    $respuesta = $reserva-> consultarReservaPorId();
    require_once("vistas/actualizar_reserva.php");
    return;
    
}

require_once("vistas/ingresar_reserva.php");
