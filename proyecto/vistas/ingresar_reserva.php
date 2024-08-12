<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilo/style.css">
    <title>Document</title>
</head>
<body>
    <h1>Ingresar nueva Reservación</h1>
    <a href="index.php?modulo=listado_reserva">Lista de reservaciones</a>
        <form method="POST" action="#">
            <label>NOMBRE DEL CLIENTE</label>
            <input type="text" name="txt_cliente_nombre" placeholder="cliente nombre" value="<?=(!empty($respuesta[0]["CLIENTE_NOMBRE"])) ? $respuesta[0]["CLIENTE_NOMBRE"] : ""?>"required />
            <br />            
            <label>Apellido del cliente</label>
            <input type="text" name="txt_cliente_apellido" placeholder="cliente apellido" value="<?=(!empty($respuesta[0]["CLIENTE_APELLIDO"])) ? $respuesta[0]["CLIENTE_APELLIDO"] : ""?>"required/>
            <br />            
            <label>TELEFONO DEL CLIENTE</label>                                    
            <input type="text" name="txt_cliente_telefono" placeholder="cliente telefono" value="<?=(!empty($respuesta[0]["CLIENTE_TELEFONO"])) ? $respuesta[0]["CLIENTE_TELEFONO"] : ""?>"required/>
            <br />  
            <label>NOMBRE DEL HOTEL</label>                                    
            <input type="text" name="txt_hotel_nombre" placeholder="hotel nombre" value="<?=(!empty($respuesta[0]["HOTEL_NOMBRE"])) ? $respuesta[0]["HOTEL_NOMBRE"] : ""?>"required/>
            <br />  
            <label>FECHA DE RESERVACIÓN</label>                                    
            <input type="date" name="txt_fecha_reservacion" placeholder="fecha reservacion" value="<?=(!empty($respuesta[0]["FECHA_RESERVACION"])) ? $respuesta[0]["FECHA_RESERVACION"] : ""?>"required/>
            <br><br>  
            <label>OBSERVACIONES</label>
            <span>No es necesario rellenar este campo</span>                                    
            <input type="text" name="txt_observaciones" placeholder="observaciones" value="<?=(!empty($respuesta[0]["OBSERVACIONES"])) ? $respuesta[0]["OBSERVACIONES"] : ""?>"/>
            <br />  
            <input type="submit" name="btn_ingresar" value="Ingresar">
        
        </form>
        <?php
            echo $mensaje;
        ?>
</body>
</html>