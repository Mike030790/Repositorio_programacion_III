<?php
require_once("conexion.php");

class Reservas {
    // Atributos
    private $sql;
    private $bd;
    private $conn;
    private $stmt;

    // Atributos públicos
    public $id_reserva;
    public $cliente_nombre;
    public $cliente_apellido;
    public $cliente_telefono;
    public $hotel_nombre;
    public $fecha_reservacion;
    public $observaciones;

    public function listarTodasReservas(){
        try {
            $this->bd = new conexion();
            $this->conn = $this->bd->crear_conexion();
            $this->sql = "SELECT * FROM reservacompleta";
            $this->stmt = $this->conn->prepare($this->sql);
            $this->stmt->execute();
            $resultado = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->bd->cerrar_conexion();
            return $resultado;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function insertarReserva(){
        try {
            $this->bd = new conexion();
            $this->conn = $this->bd->crear_conexion();
            $this->sql = "INSERT INTO reservacompleta ( cliente_nombre, cliente_apellido, cliente_telefono, hotel_nombre, fecha_reservacion, observaciones) VALUES (:cliente_nombre, :cliente_apellido, :cliente_telefono, :hotel_nombre, :fecha_reservacion, :observaciones)";
            $this->stmt = $this->conn->prepare($this->sql);
            $this->stmt->bindParam(":cliente_nombre", $this->cliente_nombre);
            $this->stmt->bindParam(":cliente_apellido", $this->cliente_apellido);
            $this->stmt->bindParam(":cliente_telefono", $this->cliente_telefono);
            $this->stmt->bindParam(":hotel_nombre", $this->hotel_nombre);
            $this->stmt->bindParam(":fecha_reservacion", $this->fecha_reservacion);
            $this->stmt->bindParam(":observaciones", $this->observaciones);
            $this->stmt->execute();
            $this->bd->cerrar_conexion();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function eliminarReserva(){
        try {
            $this->bd = new conexion();
            $this->conn = $this->bd->crear_conexion();
            $this->sql = "DELETE FROM reservacompleta WHERE id_reserva = :id_reserva";
            $this->stmt = $this->conn->prepare($this->sql);
            $this->stmt->bindParam(":id_reserva", $this->id_reserva);
            $this->stmt->execute();
            $this->bd->cerrar_conexion();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function consultarReservaPorId(){
        try {
            $this->bd = new conexion();
            $this->conn = $this->bd->crear_conexion();
            $this->sql = "SELECT * FROM reservacompleta WHERE id_reserva = :id_reserva";
            $this->stmt = $this->conn->prepare($this->sql);
            $this->stmt->bindParam(":id_reserva", $this->id_reserva);
            $this->stmt->execute();
            $resultado = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->bd->cerrar_conexion();
            return $resultado;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function actualizarReserva(){
        try {
            $this->bd = new conexion();
            $this->conn = $this->bd->crear_conexion();
            $this->sql = "UPDATE reservacompleta SET cliente_nombre = :cliente_nombre, cliente_apellido = :cliente_apellido, cliente_telefono = :cliente_telefono, hotel_nombre = :hotel_nombre, fecha_reservacion = :fecha_reservacion, observaciones = :observaciones WHERE id_reserva = :id_reserva";
            $this->stmt = $this->conn->prepare($this->sql);
            $this->stmt->bindParam(":id_reserva", $this->id_reserva);
            $this->stmt->bindParam(":cliente_nombre", $this->cliente_nombre);
            $this->stmt->bindParam(":cliente_apellido", $this->cliente_apellido);
            $this->stmt->bindParam(":cliente_telefono", $this->cliente_telefono);
            $this->stmt->bindParam(":hotel_nombre", $this->hotel_nombre);
            $this->stmt->bindParam(":fecha_reservacion", $this->fecha_reservacion);
            $this->stmt->bindParam(":observaciones", $this->observaciones);
            $this->stmt->execute();
            $this->bd->cerrar_conexion();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
}
?>
