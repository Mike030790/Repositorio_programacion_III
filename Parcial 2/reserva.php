<?php

class Reserva {
    private $hotel;
    private $nombre;
    private $apellido;
    private $telefono;
    private $fecha_reserva;
    private $observaciones;
    private static $archivo = 'reservas.txt';

    public function __construct($hotel, $nombre, $apellido, $telefono, $fecha_reserva, $observaciones) {
        $this->hotel = $hotel;
        $this->nombre = $nombre;
        $this->apellido = $apellido;
        $this->telefono = $telefono;
        $this->fecha_reserva = $fecha_reserva;
        $this->observaciones = $observaciones;
    }

    public function validar() {
        $errores = [];

        if (empty($this->hotel)) {
            $errores[] = 'El campo hotel es requerido.';
        }
        if (empty($this->nombre)) {
            $errores[] = 'El campo nombre es requerido.';
        }
        if (empty($this->apellido)) {
            $errores[] = 'El campo apellido es requerido.';
        }
        if (empty($this->telefono)) {
            $errores[] = 'El campo teléfono es requerido.';
        } elseif (!preg_match('/^\d{8}$/', $this->telefono)) {
            $errores[] = 'El teléfono debe tener exactamente 8 dígitos.';
        }
        if (empty($this->fecha_reserva)) {
            $errores[] = 'El campo fecha de reservación es requerido.';
        }

        return $errores;
    }

    public function guardar() {
        $datos = [
            $this->hotel,
            $this->nombre,
            $this->apellido,
            $this->telefono,
            $this->fecha_reserva,
            $this->observaciones
        ];

        $archivo = fopen(self::$archivo, 'a');
        fputcsv($archivo, $datos);
        fclose($archivo);
    }

    public static function obtenerTodas() {
        $reservas = [];

        if (file_exists(self::$archivo)) {
            $archivo = fopen(self::$archivo, 'r');
            while (($datos = fgetcsv($archivo)) !== FALSE) {
                $reservas[] = [
                    'hotel' => $datos[0],
                    'nombre' => $datos[1],
                    'apellido' => $datos[2],
                    'telefono' => $datos[3],
                    'fecha_reserva' => $datos[4],
                    'observaciones' => $datos[5]
                ];
            }
            fclose($archivo);
        }

        return $reservas;
    }
}
