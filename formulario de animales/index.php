<html>
<head>
    <title>Formulario de Animales</title>
</head>
<body>
    <h2>Formulario de Animales</h2>
    <form method="POST">
    <label for="nombre">Nombre del animal:</label>
        <input type="text" id="nombre" name="nombre" required>
        <br><br>
        <label for="tipo">Tipo de animal:</label>
        <select id="tipo" name="tipo">
            <option value="Gato">Gato</option>
            <option value="Perro">Perro</option>
        </select>
        <br><br>
        <input type="submit" name="btn-crear_animal" value="crear_animal">
    </form>

    <?php
    if (isset($_POST['btn-crear_animal'])) {

        include_once('clase_padre_animal.php');
        include_once('clase_hijo_perro.php');
        include_once('clase_hijo_gato.php');

        $nombre = $_POST["nombre"];
        $tipo = $_POST["tipo"];

        if ($tipo == "Gato") {
            $Animal = new Gato($nombre);
        } elseif ($tipo == "Perro") {
            $Animal = new Perro($nombre);
        }

        echo "El animal " . $Animal->getNombre() . " hace " . $Animal->hacerSonido();

        }
    ?>
</body>
</html>
