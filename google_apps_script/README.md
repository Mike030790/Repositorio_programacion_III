# Botón en movimiento para Google Apps Script

Esta aplicación web muestra un botón que rebota continuamente dentro de un área y cambia de color cada vez que se presiona.

## ¿Cuáles archivos debo copiar?

La carpeta contiene tres archivos, pero en Google Apps Script solamente debes crear y copiar dos:

| Archivo del repositorio | ¿Se copia en Apps Script? | Destino |
| --- | --- | --- |
| `Code.gs` | Sí | Archivo de secuencia de comandos `Code.gs` |
| `index.html` | Sí | Archivo HTML llamado `index` |
| `README.md` | No | Es únicamente esta guía de instalación |

## Cómo copiar y pegar los archivos

### 1. Crear el proyecto

1. Entra a [Google Apps Script](https://script.google.com/).
2. Presiona **Nuevo proyecto**.
3. En la parte superior, cambia **Proyecto sin título** por un nombre, por ejemplo, `Botón en movimiento`.

### 2. Copiar `Code.gs`

1. Abre el archivo [`Code.gs`](./Code.gs) de este repositorio.
2. Selecciona todo su contenido y cópialo.
3. Regresa a Google Apps Script y selecciona el archivo **Código.gs** que aparece en el panel izquierdo.
4. Borra el contenido que Google creó automáticamente, incluida la función `myFunction`.
5. Pega el código copiado y guarda con **Ctrl + S** (o **Cmd + S** en macOS).

> Aunque Google muestre el nombre `Código.gs`, puede conservarlo así; la función `doGet` funcionará igualmente.

### 3. Crear y copiar `index.html`

1. En Google Apps Script, presiona el botón **+** situado junto a **Archivos**.
2. Selecciona **HTML**.
3. Escribe solamente `index` como nombre y presiona **Enter**. Google añadirá `.html` automáticamente.
4. Abre el archivo [`index.html`](./index.html) de este repositorio.
5. Selecciona todo su contenido y cópialo.
6. Regresa al archivo **index.html** de Apps Script, borra cualquier contenido existente y pega el código.
7. Guarda nuevamente el proyecto.

Al terminar, el panel **Archivos** de Apps Script debe contener:

```text
Código.gs
index.html
```

## Publicar la página

1. En la esquina superior derecha, selecciona **Implementar > Nueva implementación**.
2. Junto a **Seleccionar tipo**, presiona el ícono de engranaje y elige **Aplicación web**.
3. En **Ejecutar como**, selecciona **Yo**.
4. En **Quién tiene acceso**, elige la opción apropiada para tu cuenta (por ejemplo, **Cualquier usuario**).
5. Presiona **Implementar** y acepta los permisos si Google los solicita.
6. Copia la **URL de la aplicación web** y ábrela en una pestaña nueva.

Cuando hagas cambios posteriores, selecciona **Implementar > Gestionar implementaciones**, edita la implementación y elige una **versión nueva** para que se publiquen.

No se necesitan librerías ni servicios externos.
