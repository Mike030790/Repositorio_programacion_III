<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilo/style.css">
    <title>Document</title>
</head>
<body>
    <h1>Actualizar Reservación</h1>
    <a href="index.php?modulo=listado_reserva">Lista de reservaciones</a>
    <form method="POST" action="#">
    <!-- En este caso, el valor del id_reserva se establece automáticamente al insertar nuevos registros y no debe cambiarse al actualizar registros existentes. -->
            <label>NÚMERO DE RESERVACIÓN</label>
            <input type="text" name="txt_id_reserva" placeholder="id reserva"  value="<?=(!empty($respuesta[0]["id_reserva"])) ? $respuesta[0]["id_reserva"] : ""?>" />
            <br />
            <label>NOMBRE DEL CLIENTE</label>
            <input type="text" name="txt_cliente_nombre" placeholder="cliente nombre" value="<?=(!empty($respuesta[0]["cliente_nombre"])) ? $respuesta[0]["cliente_nombre"] : ""?>"/>
            <br />            
            <label>Apellido del cliente</label>
            <input type="text" name="txt_cliente_apellido" placeholder="cliente apellido" value="<?=(!empty($respuesta[0]["cliente_apellido"])) ? $respuesta[0]["cliente_apellido"] : ""?>"/>
            <br />            
            <label>TELEFONO DEL CLIENTE</label>                                    
            <input type="text" name="txt_cliente_telefono" placeholder="cliente telefono" value="<?=(!empty($respuesta[0]["cliente_telefono"])) ? $respuesta[0]["cliente_telefono"] : ""?>"/>
            <br />  
            <label>NOMBRE DEL HOTEL</label>                                    
            <input type="text" name="txt_hotel_nombre" placeholder="hotel nombre" value="<?=(!empty($respuesta[0]["hotel_nombre"])) ? $respuesta[0]["hotel_nombre"] : ""?>"/>
            <br />  
            <label>FECHA DE RESERVACIÓN</label>                                    
            <input type="date" name="txt_fecha_reservacion" placeholder="fecha reservacion" value="<?=(!empty($respuesta[0]["fecha_reservacion"])) ? $respuesta[0]["fecha_reservacion"] : ""?>"/>
            <br><br>  
            <label>OBSERVACIONES</label>                                    
            <input type="text" name="txt_observaciones" placeholder="observaciones" value="<?=(!empty($respuesta[0]["observaciones"])) ? $respuesta[0]["observaciones"] : ""?>"/>
            <br />  
            <input type="submit" name="btn_actualizar" value="Actualizar" />          
        </form>
        <?php
            echo $mensaje;
        ?>
</body>
</html>