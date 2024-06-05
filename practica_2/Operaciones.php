<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Operaciones Aritméticas</title>
</head>
<body>
    <h1>Operaciones Aritméticas</h1>
    <form action="" method="post">
        <label for="num1">Número 1:</label>
        <input type="number" id="num1" name="num1" required>
        <br>
        <label for="num2">Número 2:</label>
        <input type="number" id="num2" name="num2" required>
        <br>
        <button type="submit">Calcular</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $num1 = $_POST['num1'];
        $num2 = $_POST['num2'];

        $suma = $num1 + $num2;
        $resta = $num1 - $num2;
        $multiplicacion = $num1 * $num2;
        $division = $num2 != 0 ? $num1 / $num2 : "No se puede dividir por cero";

        echo "<h2>Resultados</h2>";
        echo "Suma: $suma <br>";
        echo "Resta: $resta <br>";
        echo "Multiplicación: $multiplicacion <br>";
        echo "División: $division <br>";
    }
    ?>
</body>
</html>
