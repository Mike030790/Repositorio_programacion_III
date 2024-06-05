<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Adivina el Número</title>
</head>
<body>
    <h1>Adivina el Número</h1>
    <p>Introduce un número del 1 al 10:</p>
    <form action="" method="post">
        <input type="number" name="numero" min="1" max="10" required>
        <button type="submit">Adivinar</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $numero_usuario = $_POST['numero'];
        $numero_aleatorio = rand(1, 10);

        echo "<h2>Resultado</h2>";
        if ($numero_usuario == $numero_aleatorio) {
            echo "<p>Felicidades! Has adivinado el número $numero_aleatorio.</p>";
        } else {
            echo "<p>Lo siento, el número era $numero_aleatorio. Inténtalo de nuevo.</p>";
        }
    }
    ?>
</body>
</html>
