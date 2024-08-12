<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilo/style.css">
    <title>Registrar Usuario</title>
</head>
<body>
    <h1>Registrar Nuevo Usuario Y Contraseña</h1>
    <a href="index.php?modulo=logout">volver a pantalla principal</a>
    <form method="POST" action="#">
        <label>Usuario:</label>
        <input type="text" name="txt_usuario" required>
        <br />
        <label>Contraseña:</label>
        <input type="password" name="txt_password" required>
        <br />
        <input type="submit" name="btn_registrar" value="Registrar">
    </form>
    <?php
        if ($mensaje != "") {
            echo "<p>$mensaje</p>";
        }
    ?>
</body>
</html>
