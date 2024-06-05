<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Contador de Letras</title>
</head>
<body>
    <h1>Contador de Letras</h1>
    <form action="" method="post">
        <label for="frase">Frase:</label>
        <input type="text" id="frase" name="frase" required>
        <br>
        <label for="letra">Letra:</label>
        <input type="text" id="letra" name="letra" maxlength="1" required>
        <br>
        <button type="submit">Contar</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $frase = $_POST['frase'];
        $letra = $_POST['letra'];

        $count = substr_count($frase, $letra);

        echo "<h2>Resultados</h2>";
        echo "La letra '$letra' aparece $count veces en la frase.<br>";
    }
    ?>
</body>
</html>
