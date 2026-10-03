/**
 * Publica la interfaz del botón móvil como una aplicación web.
 *
 * @return {HtmlOutput} Página HTML lista para mostrarse en Google Apps Script.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Botón en movimiento')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
