<?php
$peliculasGeneros = array(
    array('id' => 1, 'pelicula' => 'El Padrino', 'genero' => 'Drama'),
    array('id' => 2, 'pelicula' => 'La Guerra de las Galaxias', 'genero' => 'Ciencia Ficción'),
    array('id' => 3, 'pelicula' => 'Jurassic Park', 'genero' => 'Aventura'),
    array('id' => 4, 'pelicula' => 'Titanic', 'genero' => 'Romance'),
    array('id' => 5, 'pelicula' => 'El Caballero Oscuro', 'genero' => 'Acción'),
    array('id' => 6, 'pelicula' => 'Toy Story', 'genero' => 'Animación'),
    array('id' => 7, 'pelicula' => 'El Resplandor', 'genero' => 'Terror')
);


// i. Obtener el valor "El Padrino"
echo  "<br>";
$nombrepelicula = $peliculasGeneros[0]['pelicula'];
var_dump($nombrepelicula);

// ii. Obtener el valor "Titanic"
echo  "<br>";
$nombrepelicula = $peliculasGeneros[3]['pelicula'];
var_dump($nombrepelicula);

// iii. Obtener el valor 4
echo  "<br>";
$idpelicula = $peliculasGeneros[3]['id'];
var_dump($idpelicula); 
