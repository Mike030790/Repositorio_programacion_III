/**
 * Sirve la página principal de la aplicación web.
 *
 * @return {HtmlOutput} Página HTML lista para mostrarse en el navegador.
 */
const TIKTOK_URL = 'PEGA_AQUI_EL_LINK_COMPLETO_DE_TIKTOK';

function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  template.tiktokVideoIdJson = JSON.stringify(getTikTokVideoId_(TIKTOK_URL));

  return template.evaluate()
    .setTitle('Mensaje para Chacón')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Obtiene el identificador de una publicación desde su enlace de TikTok.
 *
 * @param {string} url Enlace completo de la publicación de TikTok.
 * @return {string} Identificador del video o una cadena vacía.
 */
function getTikTokVideoId_(url) {
  const match = String(url).match(/(?:tiktok\.com\/.*\/video\/)(\d+)/);

  return match ? match[1] : '';
}
