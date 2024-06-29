<?php

include_once 'clase_padre_animal.php';

class Gato extends Animal {
    public function hacerSonido() {
        return "Miau";
    }
}
?>
