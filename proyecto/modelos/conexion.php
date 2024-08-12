<?php
class conexion{
    private $conn;
    private $server = "localhost";
    private $user = "root";
    private $password = "";
    private $schema = "mireserva";

    public function crear_conexion(){
        try{
            $this->conn = new PDO('mysql:host='.$this->server.';dbname='.$this->schema.'', $this->user, $this->password);
            return $this->conn;
        }catch(PDOException $e){
            die('Error al conectarse a MYSQL: ('.$e.')');
        }
    }

    public function cerrar_conexion(){
        $this->conn = null;
    }
}

?>                                                                                                                                                                                                          <?php