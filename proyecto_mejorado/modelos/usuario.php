<?php
require_once("conexion.php");

class Usuario {
    private $conn;
    private $bd;
    private $stmt;

    public $usuario;
    public $contrasena;

    public function __construct() {
        $this->bd = new Conexion();
        $this->conn = $this->bd->crear_conexion();
    }

    public function insertarUsuario() {
        try {
        //  $this->contrasena = password_hash($this->contrasena, PASSWORD_BCRYPT); // Encriptar la contraseña
            $sql = "INSERT INTO usuarios (usuario, clave) VALUES (:usuario, :clave)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":usuario", $this->usuario);
            $stmt->bindParam(":clave", $this->contrasena);
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            return false;
        } finally {
            $this->bd->cerrar_conexion();
        }
    }
}
?>
