<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Calculadora de Promedio</title>
</head>
<body>
    <h1>Calculadora de Promedio</h1>
    <form action="" method="post">
        <label for="nota1">Nota 1:</label>
        <input type="number" id="nota1" name="nota1" step="0.01" required>
        <br>
        <label for="nota2">Nota 2:</label>
        <input type="number" id="nota2" name="nota2" step="0.01" required>
        <br>
        <label for="nota3">Nota 3:</label>
        <input type="number" id="nota3" name="nota3" step="0.01" required>
        <br>
        <button type="submit">Calcular Promedio</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $nota1 = $_POST['nota1'];
        $nota2 = $_POST['nota2'];
        $nota3 = $_POST['nota3'];

        $promedio = ($nota1 + $nota2 + $nota3) / 3;

        echo "<h2>Resultado</h2>";
        echo "El promedio de las tres notas es: " . number_format($promedio, 2) . "<br>";
    }
    ?>
</body>
</html>
