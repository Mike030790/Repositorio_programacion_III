# Página para Google Apps Script

Esta aplicación web muestra el mensaje **«CHACÓN, MANDAME EL CORTE ÉLITE»** centrado en la pantalla.

## Configurar la canción

En `Code.gs`, reemplaza `PEGA_AQUI_EL_LINK_DE_YOUTUBE` por el enlace de la
canción. Se aceptan enlaces normales, cortos y de YouTube Shorts. Por ejemplo:

```javascript
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=XXXXXXXXXXX';
```

La página intenta reproducirla automáticamente. Algunos navegadores bloquean el
audio automático hasta que la persona interactúa con la página; por eso también
se muestra un botón para reproducir o pausar la música.

## Publicación

1. Crea un proyecto en [Google Apps Script](https://script.google.com/).
2. Copia el contenido de `Code.gs` en el archivo de código del proyecto.
3. Crea un archivo HTML llamado `Index` y copia en él el contenido de `Index.html`.
4. Selecciona **Implementar > Nueva implementación**.
5. Elige **Aplicación web**, configura quién puede acceder y pulsa **Implementar**.
6. Abre la URL generada por Google Apps Script.
