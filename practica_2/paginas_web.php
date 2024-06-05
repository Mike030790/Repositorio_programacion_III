<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Menú de Páginas Web</title>
</head>
<body>
    <h1>Menú de Páginas Web</h1>
    <ul>
        <?php
        // Arreglo de páginas web
        $paginas_web = array(
            "Inicio" => "index.php",
            "Acerca de" => "acerca_de.php",
            "Servicios" => "servicios.php",
            "Contacto" => "contacto.php"
        );

        // Imprimir el menú de páginas web
        foreach ($paginas_web as $nombre => $url) {
            echo "<li><a href='$url'>$nombre</a></li>";
        }
        ?>
    </ul>
</body>
</html>
