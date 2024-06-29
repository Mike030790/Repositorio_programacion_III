<?php
class CalcularArea {
    private $largo;
    private $ancho;

    public function __construct($largo, $ancho) {
        $this->largo = $largo;
        $this->ancho = $ancho;
    }

    public function getarea() {
        return $this->largo * $this->ancho;
    }
}
?>
