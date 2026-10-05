/**
 * Sirve la página principal de la aplicación web.
 *
 * @return {HtmlOutput} Página HTML lista para mostrarse en el navegador.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Mensaje para Chacón')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
