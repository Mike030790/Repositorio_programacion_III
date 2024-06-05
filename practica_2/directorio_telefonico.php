<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Directorio Telefónico</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Directorio Telefónico</h1>
    <table>
        <tr>
            <th>Número de Identificación</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
        </tr>
        <?php
        // Arreglo asociativo tipo directorio telefónico
        $directorio = array(
            array("id" => 1, "nombre" => "Juan Pérez", "telefono" => "123456789", "email" => "juan@example.com"),
            array("id" => 2, "nombre" => "María López", "telefono" => "987654321", "email" => "maria@example.com"),
            array("id" => 3, "nombre" => "Carlos Gómez", "telefono" => "456789123", "email" => "carlos@example.com")
        );

        // Imprimir el directorio en la tabla
        foreach ($directorio as $contacto) {
            echo "<tr>";
            echo "<td>" . $contacto['id'] . "</td>";
            echo "<td>" . $contacto['nombre'] . "</td>";
            echo "<td>" . $contacto['telefono'] . "</td>";
            echo "<td>" . $contacto['email'] . "</td>";
            echo "</tr>";
        }
        ?>
    </table>
</body>
</html>
