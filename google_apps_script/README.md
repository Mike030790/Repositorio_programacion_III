# Página para Google Apps Script

Esta aplicación web muestra el mensaje **«CHACÓN, MANDAME EL CORTE ÉLITE»** centrado en la pantalla.

## Configurar la canción

En `Code.gs`, reemplaza `PEGA_AQUI_EL_LINK_COMPLETO_DE_TIKTOK` por el enlace
completo de la publicación. El enlace debe contener `/video/` y su identificador;
no uses un enlace corto de `vm.tiktok.com`. Por ejemplo:

```javascript
const TIKTOK_URL = 'https://www.tiktok.com/@usuario/video/1234567890123456789';
```

La página solicita al reproductor de TikTok que inicie la música automáticamente,
sin botones ni eventos de clic. Aun así, la configuración del navegador de cada
visitante puede bloquear el audio automático y no puede evitarse desde el código.

## Publicación

1. Crea un proyecto en [Google Apps Script](https://script.google.com/).
2. Copia el contenido de `Code.gs` en el archivo de código del proyecto.
3. Crea un archivo HTML llamado `Index` y copia en él el contenido de `Index.html`.
4. Selecciona **Implementar > Nueva implementación**.
5. Elige **Aplicación web**, configura quién puede acceder y pulsa **Implementar**.
6. Abre la URL generada por Google Apps Script.
