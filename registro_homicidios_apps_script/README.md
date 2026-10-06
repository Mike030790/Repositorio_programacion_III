# Registro visual de homicidios — Google Apps Script

Aplicación interna para registrar hechos, visualizarlos en un mapa y generar una presentación editable en PowerPoint. Los datos se guardan en Google Sheets y las fotografías en una carpeta privada de Google Drive.

## Instalación

1. Cree un proyecto en [Google Apps Script](https://script.google.com/).
2. Copie `Code.gs`, `Index.html` y `appsscript.json` al proyecto (el manifiesto se muestra al activar **Mostrar archivo de manifiesto** en la configuración).
3. Ejecute `configurarAplicacion()` desde el editor y autorice los permisos. La función crea la hoja y registra automáticamente `SPREADSHEET_ID` en las propiedades del script.
4. Para insertar mapas en el PowerPoint, habilite **Maps Static API** en Google Cloud y agregue `MAPS_API_KEY` en **Configuración del proyecto → Propiedades del script**. La aplicación web usa OpenStreetMap y funciona sin esa clave.
5. Seleccione **Implementar → Nueva implementación → Aplicación web**. Para datos sensibles se recomienda ejecutar como el usuario que accede y limitar el acceso a cuentas autorizadas de la organización.

## Uso

- Haga clic en el mapa para marcar la ubicación con el pin rojo y luego en **Nuevo hecho**.
- El tipo de homicidio se selecciona entre **Arma de fuego** y **Arma blanca**.
- Use los filtros para reducir el listado. Si selecciona una ficha, la exportación incluye solo ese hecho; si no hay una selección, incluye todos los resultados filtrados.
- **Descargar PowerPoint** crea tanto una presentación de Google Slides como un `.pptx` en Drive. Los textos y fotografías son objetos editables; los mapas son imágenes estáticas.

## Seguridad y privacidad

Este prototipo trata información especialmente sensible. Antes de usarlo en producción, aplique las políticas institucionales de minimización y retención, controles de acceso por grupo, auditoría de Drive, clasificación de información y consentimiento/base legal correspondiente. No publique la implementación como “Cualquier usuario”. Las fotografías permanecen privadas y se muestran mediante el acceso autenticado del usuario.
