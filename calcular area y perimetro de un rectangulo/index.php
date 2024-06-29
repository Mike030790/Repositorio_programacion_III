<html>
<head>
    <title>Area y Perimetro de un rectangulo</title>
</head>
<body>
    <h2>Area y Perimetro de un rectangulo</h2>
    <form method="POST">
        <label for="largo">largo:</label>
        <input type="number" id="largo" name="largo" required><br><br>
        <label for="ancho">ancho:</label>
        <input type="number" id="ancho" name="ancho" required><br><br>
        <input type="submit" name="btn-Calcular" value="Calcular">
    </form>

    <?php
    if (isset($_POST['btn-Calcular'])) {

        // se colocan los nombres de los archivos .php
        include_once('area_rectangulo.php');
        include_once('perimetro_rectangulo.php');


        $largo = $_POST['largo'];
        $ancho = $_POST['ancho'];

        // se coloca el nombre de la clase creada en el arcchivo area_rectangulo
        $CalcularArea = new CalcularArea($largo, $ancho);
        $resultadoArea = $CalcularArea->getarea();
        
         // se coloca el nombre de la clase creada en el arcchivo perimetro_rectangulo
        $CalcularPerimetro = new CalcularPerimetro($largo, $ancho);
        $resultadoPerimetro = $CalcularPerimetro->getperimetro();
        
        echo "El área del rectángulo es: " . $resultadoArea . " y el perímetro del rectángulo es: " . $resultadoPerimetro;

    }
    ?>
</body>
</html>
