<?php
include_once 'Reserva.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $reserva = new Reserva($_POST['hotel'], $_POST['nombre'], $_POST['apellido'], $_POST['telefono'], $_POST['fecha_reserva'], $_POST['observaciones']);
    $errores = $reserva->validar();

    if (empty($errores)) {
        $reserva->guardar();
        echo "<p>Reservación guardada con éxito.</p>";
    } else {
        foreach ($errores as $error) {
            echo "<p>$error</p>";
        }
    }
}

$reservas = Reserva::obtenerTodas();
?>



<form method="post" action="">
    <label for="hotel">Hotel:</label>
    <select name="hotel" id="hotel" required>
    <option value="Tabacon Thermal Resort & Spa">Tabacon Thermal Resort & Spa</option>
        <option value="Nayara Gardens">Nayara Gardens</option>
        <option value="Planet Hollywood Costa Rica">Planet Hollywood Costa Rica</option>
        <option value="The Royal Corin Thermal Water Spa & Resor">The Royal Corin Thermal Water Spa & Resort</option>
        <option value="Hotel Makanda By The Sea Costa Rica">Hotel Makanda By The Sea Costa Rica</option>
        </select><br><br>
    
        <!-- <br><br> : doble espacio entre los label -->
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" name="nombre" required><br><br>  

    <label for="apellido">Apellido:</label>
    <input type="text" id="apellido" name="apellido" required><br><br>

    <label for="telefono">Teléfono:</label>
    <input type="tel" id="telefono" name="telefono" required pattern="[0-9]{8}" placeholder="12345678">
    <small>Ingrese un número de teléfono de 8 dígitos.</small><br><br>

    <label for="fecha_reserva">Fecha de Reservación:</label>
    <input type="date" id="fecha_reserva" name="fecha_reserva" required><br><br>


    <label for="observaciones">Observaciones:</label>
    <textarea id="observaciones" name="observaciones"></textarea><br><br>


    <input type="submit" value="Reservar Hotel">
</form>

<h2>Reservas Existentes</h2>
<table border="1">
    <tr>
        <th>Hotel</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Teléfono</th>
        <th>Fecha de Reservación</th>
        <th>Observaciones</th>
    </tr>
    <?php foreach ($reservas as $res) { ?>
    <tr>
        <td><?= htmlspecialchars($res['hotel']) ?></td>
        <td><?= htmlspecialchars($res['nombre']) ?></td>
        <td><?= htmlspecialchars($res['apellido']) ?></td>
        <td><?= htmlspecialchars($res['telefono']) ?></td>
        <td><?= htmlspecialchars($res['fecha_reserva']) ?></td>
        <td><?= htmlspecialchars($res['observaciones']) ?></td>
    </tr>
    <?php } ?>
</table>
