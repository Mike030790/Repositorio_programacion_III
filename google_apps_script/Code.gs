/**
 * Sirve la página principal de la aplicación web.
 *
 * @return {HtmlOutput} Página HTML lista para mostrarse en el navegador.
 */
const YOUTUBE_URL = 'PEGA_AQUI_EL_LINK_DE_YOUTUBE';

function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  template.youtubeVideoIdJson = JSON.stringify(getYoutubeVideoId_(YOUTUBE_URL));

  return template.evaluate()
    .setTitle('Mensaje para Chacón')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Obtiene el identificador de un enlace normal, corto o de YouTube Shorts.
 *
 * @param {string} url Enlace del video de YouTube.
 * @return {string} Identificador del video o una cadena vacía.
 */
function getYoutubeVideoId_(url) {
  const match = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/
  );

  return match ? match[1] : '';
}
