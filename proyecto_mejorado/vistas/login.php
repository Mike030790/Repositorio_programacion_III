<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="estilo/style.css">
</head>
<body>
<a href="index.php?modulo=mant_usuarios">Registrarse</a>
    <form method="POST" action="#">
        <label>Usuario</label>
        <input type="text" name="txt_usuario" >
        <br />
        <label>Contraseña</label>
        <input type="password" name="txt_password" >
        <br />
        <input type="submit" name="btn_ingresar" value="Ingresar">
    </form>
    <?php
        echo $mensaje;
    ?>
</body>
</html>