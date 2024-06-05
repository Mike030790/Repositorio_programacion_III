<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $num1 = $_POST['num1'];
    $num2 = $_POST['num2'];

    $suma = $num1 + $num2;
    $resta = $num1 - $num2;
    $multiplicacion = $num1 * $num2;
    $division = $num2 != 0 ? $num1 / $num2 : "No se puede dividir por cero";

    echo "<h1>Resultados</h1>";
    echo "Suma: $suma <br>";
    echo "Resta: $resta <br>";
    echo "Multiplicación: $multiplicacion <br>";
    echo "División: $division <br>";
}
?>
