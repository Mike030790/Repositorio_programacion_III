<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilo/style.css">
    <title>Reservas</title>
    <script>
    function confirmarEliminacion() {
        return confirm("¿Está seguro que desea eliminar este registro?");
    }
    </script
</head>
<body>
    <h1>Listado De Reservas</h1>
    <a href="index.php?modulo=mantenimiento_reservas">Agregar reserva</a>
    <a href="index.php?modulo=logout">Salir</a>
    <p> <?php echo "Bienvenido : " . $_SESSION["NOMBRE_USUARIO"]; ?> </p>
    <table>
        <tr>
            <th>ID RESERVA</th>
            <th>CLIENTE NOMBRE</th>
            <th>CLIENTE APELLIDO</th>
            <th>CLIENTE TELEFONO</th>
            <th>HOTEL NOMBRE</th>
            <th>FECHA RESERVACION</th>
            <th>OBSERVACIONES</th>
        </tr>
        <?php
        foreach($reserva->listarTodasReservas() as $dep){
        ?>
        <tr>
            <td><?=$dep["id_reserva"]?></td>
            <td><?=$dep["cliente_nombre"]?></td>
            <td><?=$dep["cliente_apellido"]?></td>
            <td><?=$dep["cliente_telefono"]?></td>
            <td><?=$dep["hotel_nombre"]?></td>
            <td><?=$dep["fecha_reservacion"]?></td>
            <td><?=$dep["observaciones"]?></td>
            <td>
                <form method="POST" action="index.php?modulo=mantenimiento_reservas">
                    <input type="hidden" name="id_reserva" value="<?=$dep["id_reserva"]?>" />
                    <input type="submit" name="btn_editar" value="Editar" />
                </form>
                <form method="POST" action="" onsubmit="return confirmarEliminacion();">
                    <input type="hidden" name="id_reserva" value="<?=$dep["id_reserva"]?>" />
                    <input type="submit" name="btn_eliminar" value="Eliminar" />
                </form>
            </td>
        </tr>
        <?php    
        }
        ?>
        <?php 
        echo '<p>'. $mensaje. '</p>';
        ?>
    </table>
</body>
</html>
