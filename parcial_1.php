<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservaciones de Hotel</title>
</head>
<body>
    <h2>Reservación de Hotel</h2>
    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $hotel = $_POST['hotel'];
        $nombre = trim($_POST['nombre']);
        $apellido = trim($_POST['apellido']);
        $telefono = trim($_POST['telefono']);
        $fecha = $_POST['fecha'];
        $observaciones = trim($_POST['observaciones']);
        
        // Validaciones básicas
        if (empty($hotel) || empty($nombre) || empty($apellido) || empty($telefono) || empty($fecha) || empty($observaciones)) {
            echo "Todos los campos son requeridos.";
        } elseif (!preg_match("/^[a-zA-Z-' ]*$/", $nombre) || !preg_match("/^[a-zA-Z-' ]*$/", $apellido)) {
            echo "Solo se permiten letras y espacios en el nombre y apellido.";
        } elseif (!preg_match("/^[0-9]{10}$/", $telefono)) {
            echo "El teléfono debe tener 10 dígitos.";
        } else {
            // Formato de la reserva
            $reserva = "$hotel,$nombre,$apellido,$telefono,$fecha,$observaciones\n";
            
            // Guardar en archivo plano
            $file = fopen("reservas.txt", "a");
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
    
    <form action="" method="post">
        <label for="hotel">Seleccione un hotel:</label>
        <select name="hotel" id="hotel" required>
            <option value="Hotel A">Hotel A</option>
            <option value="Hotel B">Hotel B</option>
            <option value="Hotel C">Hotel C</option>
            <option value="Hotel D">Hotel D</option>
            <option value="Hotel E">Hotel E</option>
        </select><br><br>
        
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br><br>
        
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required><br><br>
        
        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" name="telefono" required pattern="[0-9]{10}"><br><br>
        
        <label for="fecha">Fecha de Reservación:</label>
        <input type="date" id="fecha" name="fecha" required><br><br>
        
        <label for="observaciones">Observaciones:</label>
        <textarea id="observaciones" name="observaciones" required></textarea><br><br>
        
        <input type="submit" value="Procesar">
    </form>
    
    <h2>Reservas Registradas</h2>
    <?php
    if (file_exists("reservas.txt")) {
        $file = fopen("reservas.txt", "r");
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
</html>
