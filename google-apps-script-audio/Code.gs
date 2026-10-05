/**
 * Identificador del audio guardado en Google Drive.
 *
 * Ejemplo de una URL de Drive:
 * https://drive.google.com/file/d/1AbCdEfGhIjKlMn/view
 * El identificador es el texto que aparece entre /d/ y /view.
 */
const AUDIO_FILE_ID = 'REEMPLAZA_CON_EL_ID_DEL_AUDIO';

/**
 * Publica la interfaz web de la aplicación.
 * @return {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Escuchar audio')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Lee el audio desde Drive sin que el archivo tenga que ser público.
 * @return {{data: string, mimeType: string}}
 */
function obtenerAudio() {
  if (AUDIO_FILE_ID === 'REEMPLAZA_CON_EL_ID_DEL_AUDIO') {
    throw new Error('Configura AUDIO_FILE_ID en el archivo Code.gs.');
  }

  const blob = DriveApp.getFileById(AUDIO_FILE_ID).getBlob();

  return {
    data: Utilities.base64Encode(blob.getBytes()),
    mimeType: blob.getContentType() || 'audio/ogg'
  };
}
