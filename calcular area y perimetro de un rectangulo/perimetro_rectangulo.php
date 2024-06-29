<?php
class CalcularPerimetro {
    private $largo;
    private $ancho;

    public function __construct($largo, $ancho) {
        $this->largo = $largo;
        $this->ancho = $ancho;
    }

    public function getperimetro() {
        return 2 * ($this->largo + $this->ancho);
    }
}
?>
