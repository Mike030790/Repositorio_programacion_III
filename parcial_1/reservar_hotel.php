<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservaciones de Hotel</title>
    
    <!--  logra que ambos botones ("Reservar Hotel" y "Abrir txt") aparezcan
    con una ligera separación entre ellos, ademas para que funcione
    se agrega (class="form-inline") a las lineas 57 y 86 -->
    <style>
        .form-inline {
            margin-bottom: 10px;
        }
        .form-inline input[type="submit"] {
            margin-right: 10px;
        }
    </style>

</head>
<body>
    <h2>Reservación de Hotel</h2>
    <?php

    define('ARCHIVO_RESERVAS', 'reservas.txt');
    
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $hotel = $_POST['hotel'];
        $nombre = trim($_POST['nombre']);
        $apellido = trim($_POST['apellido']);
        $telefono = trim($_POST['telefono']);
        $fecha = $_POST['fecha'];
        $observaciones = trim($_POST['observaciones']);
        
        // Validaciones básicas

        if (empty($hotel) || empty($nombre) || empty($apellido) || empty($telefono) || empty($fecha)) {
            echo "Todos los campos son requeridos exepto el campo de observaciones.";
        } elseif (!preg_match("/^[a-zA-Z-' ]*$/", $nombre) || !preg_match("/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s'-]*$/", $apellido)) {
            echo "Solo se permiten letras y espacios en el nombre y en el apellido acepta la letra ñ.";
        } elseif (!preg_match("/^[0-9]{8}$/", $telefono)) {
            echo "El teléfono debe tener 8 dígitos.";
        } else {
            // Formato de la reserva
            $reserva = "$hotel,$nombre,$apellido,$telefono,$fecha,$observaciones\n";
            
            // Guardar en archivo plano
            $file = fopen(ARCHIVO_RESERVAS, "a");
            if ($file) {
                fwrite($file, $reserva);
                fclose($file);
                echo "Reservación guardada correctamente.";
            } else {
                echo "No se pudo abrir el archivo de reservas.";
            }
        }
    }
    ?>
    
    <form action="" method="post" class="form-inline">
        <label for="hotel">Seleccione un hotel:</label>
        <select name="hotel" id="hotel" required>
            <option value="Tabacon Thermal Resort & Spa">Tabacon Thermal Resort & Spa</option>
            <option value="Nayara Gardens">Nayara Gardens</option>
            <option value="Planet Hollywood Costa Rica">Planet Hollywood Costa Rica</option>
            <option value="The Royal Corin Thermal Water Spa & Resort">The Royal Corin Thermal Water Spa & Resort</option>
            <option value="Hotel Makanda By The Sea Costa Rica">Hotel Makanda By The Sea Costa Rica</option>
        </select><br><br>
        
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br><br>
        
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required><br><br>
        
        <input type="tel" id="telefono" name="telefono" required pattern="[0-9]{8}" placeholder="12345678">
        <small>Ingrese un número de teléfono de 8 dígitos.</small><br><br>
        
        <label for="fecha">Fecha de Reservación:</label>
        <input type="date" id="fecha" name="fecha" required><br><br>
        
        <label for="observaciones">Observaciones:</label>
        <textarea id="observaciones" name="observaciones" ></textarea><br><br>
        
        <input type="submit" value="Reservar Hotel">
    </form>

    <!-- la siguiente linea de codigo hace que se abra el .txt  -->    
    <form action="reservas.txt" class="form-inline"> 
        <input type="submit" value="Abrir txt">
    </form>
    
    <h2>Reservas Registradas</h2>
    <?php
    if (file_exists(ARCHIVO_RESERVAS)) {
        $file = fopen(ARCHIVO_RESERVAS, "r");
        if ($file) {
            echo "<table border='1'>";
            echo "<tr><th>Hotel</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Fecha</th><th>Observaciones</th></tr>";
            while (($line = fgets($file)) !== false) {
                $reserva = explode(",", trim($line));
                echo "<tr>";
                foreach ($reserva as $campo) {
                    echo "<td>" . htmlspecialchars($campo) . "</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
            fclose($file);
        } else {
            echo "No se pudieron cargar las reservas.";
        }
    } else {
    echo "No hay reservas registradas.";
    }
    ?>
</body>
