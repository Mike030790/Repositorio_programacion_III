<?php

include_once 'clase_padre_animal.php';

class Perro extends Animal {
    public function hacerSonido() {
        return "Guau";
    }
}
