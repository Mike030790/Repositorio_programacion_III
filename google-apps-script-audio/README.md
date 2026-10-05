# Botón para reproducir un audio de WhatsApp

Esta pequeña aplicación de Google Apps Script muestra un único botón y reproduce
un audio almacenado en Google Drive cuando el visitante lo presiona.

## Configuración

1. Descarga el audio de WhatsApp y súbelo a tu Google Drive.
2. Abre el archivo en Drive y copia su identificador desde la URL. Por ejemplo,
   en `https://drive.google.com/file/d/ABC123/view`, el identificador es `ABC123`.
3. Crea un proyecto en [Google Apps Script](https://script.google.com/).
4. Copia el contenido de `Code.gs` en el archivo del mismo nombre del proyecto.
5. Crea un archivo HTML llamado `Index` y copia en él `Index.html`.
6. En `Code.gs`, reemplaza `REEMPLAZA_CON_EL_ID_DEL_AUDIO` por el identificador
   obtenido en el paso 2.

## Publicación

1. En Apps Script, selecciona **Implementar > Nueva implementación**.
2. Elige **Aplicación web** como tipo de implementación.
3. En **Ejecutar como**, selecciona **Yo**. Así el audio puede permanecer privado
   en Drive y la aplicación lo lee usando los permisos del propietario.
4. En **Quién tiene acceso**, selecciona las personas que podrán abrir la página.
5. Autoriza el acceso a Drive cuando Google lo solicite y comparte la URL de la
   aplicación web.

> Conviene usar un audio corto: el archivo se codifica en Base64 antes de enviarse
> al navegador. Los formatos habituales de los audios de WhatsApp, como OGG/Opus,
> funcionan en los navegadores modernos.
