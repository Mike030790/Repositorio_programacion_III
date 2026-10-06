const APP = {
  SHEET_NAME: 'Hechos',
  HEADERS: ['id', 'fecha', 'hora', 'victimas', 'estructura', 'estadoVinculo', 'fuente', 'barrio', 'direccion', 'tipo', 'latitud', 'longitud', 'resena', 'fotoId', 'fotoUrl', 'creado'],
  FOLDER_NAME: 'Registro visual de hechos - fotografías',
  DEFAULT_CENTER: { lat: 9.9146, lng: -84.1036 }
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Registro visual de homicidios')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Ejecutar una vez desde el editor para crear la hoja y guardar su ID. */
function configurarAplicacion() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheet;
  const savedId = properties.getProperty('SPREADSHEET_ID');
  if (savedId) {
    spreadsheet = SpreadsheetApp.openById(savedId);
  } else {
    spreadsheet = SpreadsheetApp.create('Registro visual de homicidios');
    properties.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  }
  const sheet = getSheet_();
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, APP.HEADERS.length).setFontWeight('bold').setBackground('#132a25').setFontColor('#ffffff');
  return { spreadsheetUrl: spreadsheet.getUrl(), message: 'Aplicación configurada correctamente.' };
}

function getBootstrapData() {
  return {
    records: listRecords_(),
    center: APP.DEFAULT_CENTER,
    types: ['Sicariato', 'Riña', 'Violencia doméstica', 'Robo / asalto', 'Por determinar']
  };
}

function saveRecord(payload) {
  validateRecord_(payload);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const photo = payload.photoData ? savePhoto_(payload.photoData, payload.photoName) : { id: '', url: '' };
    const id = Utilities.getUuid();
    const victims = (payload.victimas || []).map(String).map(v => v.trim()).filter(Boolean);
    getSheet_().appendRow([
      id, payload.fecha, payload.hora, JSON.stringify(victims), payload.estructura || 'Sin determinar',
      payload.estadoVinculo, payload.fuente || '', payload.barrio, payload.direccion || '', payload.tipo,
      Number(payload.latitud), Number(payload.longitud), payload.resena || '', photo.id, photo.url, new Date().toISOString()
    ]);
    return normalizeRow_([id, payload.fecha, payload.hora, JSON.stringify(victims), payload.estructura || 'Sin determinar', payload.estadoVinculo, payload.fuente || '', payload.barrio, payload.direccion || '', payload.tipo, Number(payload.latitud), Number(payload.longitud), payload.resena || '', photo.id, photo.url, new Date().toISOString()]);
  } finally {
    lock.releaseLock();
  }
}

function deleteRecord(id) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const index = values.findIndex((row, i) => i > 0 && row[0] === id);
  if (index < 0) throw new Error('No se encontró el registro solicitado.');
  const photoId = values[index][13];
  if (photoId) {
    try { DriveApp.getFileById(photoId).setTrashed(true); } catch (e) { console.warn(e); }
  }
  sheet.deleteRow(index + 1);
  return { ok: true };
}

function exportPowerPoint(ids, periodLabel) {
  const selected = listRecords_().filter(record => !ids || !ids.length || ids.indexOf(record.id) !== -1);
  if (!selected.length) throw new Error('No hay hechos para exportar.');
  const deck = SlidesApp.create('Registro de hechos - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
  const first = deck.getSlides()[0];
  clearSlide_(first);
  addText_(first, 'REGISTRO VISUAL DE HECHOS', 45, 115, 630, 60, 28, true, '#17352E');
  addText_(first, 'Delegación de Hatillo', 45, 185, 630, 35, 18, false, '#B06C3C');
  addText_(first, periodLabel || 'Período seleccionado', 45, 235, 630, 28, 13, false, '#53645F');
  addText_(first, selected.length + (selected.length === 1 ? ' hecho incluido' : ' hechos incluidos'), 45, 285, 630, 28, 12, false, '#53645F');

  const mapSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addText_(mapSlide, 'Mapa general', 28, 18, 664, 35, 22, true, '#17352E');
  const mapBlob = fetchStaticMap_(selected);
  if (mapBlob) mapSlide.insertImage(mapBlob, 36, 68, 648, 320);
  else addText_(mapSlide, 'Configure MAPS_API_KEY en las propiedades del script para incluir el mapa.', 70, 170, 580, 50, 14, false, '#53645F');

  selected.forEach((record, index) => addRecordSlide_(deck, record, index + 1));
  deck.saveAndClose();
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + deck.getId() + '/export?mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation', {
    headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) throw new Error('No fue posible exportar la presentación. Código ' + response.getResponseCode());
  const file = DriveApp.createFile(response.getBlob().setName(deck.getName() + '.pptx'));
  return { url: file.getDownloadUrl(), name: file.getName(), slidesUrl: deck.getUrl() };
}

function addRecordSlide_(deck, r, number) {
  const slide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addText_(slide, String(number).padStart(2, '0') + '  ' + (r.victimas.join(', ') || 'Víctima sin identificar'), 28, 18, 664, 36, 20, true, '#17352E');
  if (r.fotoId) {
    try { slide.insertImage(DriveApp.getFileById(r.fotoId).getBlob(), 28, 70, 270, 185); } catch (e) { /* mantiene la ficha aunque la foto ya no exista */ }
  }
  const facts = [
    ['FECHA Y HORA', formatDate_(r.fecha) + ' · ' + r.hora], ['TIPO', r.tipo],
    ['ESTRUCTURA', r.estructura], ['VINCULACIÓN', r.estadoVinculo], ['FUENTE', r.fuente || 'No indicada'],
    ['LUGAR', [r.barrio, r.direccion].filter(Boolean).join(' · ')]
  ];
  let y = 70;
  facts.forEach(f => { addText_(slide, f[0], 325, y, 120, 18, 8, true, '#B06C3C'); addText_(slide, f[1], 445, y - 1, 240, 28, 10, false, '#24332F'); y += 32; });
  addText_(slide, 'RESEÑA', 28, 278, 80, 18, 8, true, '#B06C3C');
  addText_(slide, r.resena || 'Sin reseña.', 28, 300, 420, 80, 10, false, '#24332F');
  const map = fetchStaticMap_([r]);
  if (map) slide.insertImage(map, 475, 280, 210, 105);
}

function fetchStaticMap_(records) {
  const key = PropertiesService.getScriptProperties().getProperty('MAPS_API_KEY');
  if (!key) return null;
  const markers = records.slice(0, 50).map((r, i) => 'markers=color:0xb06c3c%7Clabel:' + ((i + 1) % 10) + '%7C' + r.latitud + ',' + r.longitud);
  const url = 'https://maps.googleapis.com/maps/api/staticmap?size=640x360&scale=2&maptype=roadmap&' + markers.join('&') + '&key=' + encodeURIComponent(key);
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  return response.getResponseCode() === 200 ? response.getBlob() : null;
}

function addText_(slide, text, x, y, w, h, size, bold, color) {
  const shape = slide.insertTextBox(String(text || ''), x, y, w, h);
  shape.getText().getTextStyle().setFontFamily('Arial').setFontSize(size).setBold(bold).setForegroundColor(color);
  return shape;
}
function clearSlide_(slide) { slide.getPageElements().forEach(element => element.remove()); }
function formatDate_(value) { return value ? String(value).slice(0, 10).split('-').reverse().join('/') : '—'; }

function listRecords_() {
  const values = getSheet_().getDataRange().getValues();
  return values.slice(1).filter(row => row[0]).map(normalizeRow_).reverse();
}
function normalizeRow_(row) {
  let victims = [];
  try { victims = JSON.parse(row[3] || '[]'); } catch (e) { victims = [String(row[3] || '')]; }
  return { id: row[0], fecha: formatCellDate_(row[1]), hora: row[2], victimas: victims, estructura: row[4], estadoVinculo: row[5], fuente: row[6], barrio: row[7], direccion: row[8], tipo: row[9], latitud: Number(row[10]), longitud: Number(row[11]), resena: row[12], fotoId: row[13], fotoUrl: row[14], creado: row[15] };
}
function formatCellDate_(value) { return value instanceof Date ? Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(value || '').slice(0, 10); }
function getSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Ejecute configurarAplicacion() una vez desde el editor de Apps Script.');
  const book = SpreadsheetApp.openById(id);
  let sheet = book.getSheetByName(APP.SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(APP.SHEET_NAME);
  if (!sheet.getLastRow()) sheet.appendRow(APP.HEADERS);
  return sheet;
}
function savePhoto_(dataUrl, name) {
  const match = String(dataUrl).match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
  if (!match) throw new Error('La fotografía debe ser PNG, JPG o WEBP.');
  const bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > 8 * 1024 * 1024) throw new Error('La fotografía no puede superar 8 MB.');
  const folders = DriveApp.getFoldersByName(APP.FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(APP.FOLDER_NAME);
  const file = folder.createFile(Utilities.newBlob(bytes, match[1], name || ('foto-' + Date.now())));
  return { id: file.getId(), url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1000' };
}
function validateRecord_(p) {
  if (!p || !p.fecha || !p.hora || !p.barrio || !p.tipo || !p.estadoVinculo) throw new Error('Complete los campos obligatorios.');
  if (!Array.isArray(p.victimas) || !p.victimas.some(v => String(v).trim())) throw new Error('Ingrese al menos una víctima.');
  const lat = Number(p.latitud), lng = Number(p.longitud);
  if (!isFinite(lat) || !isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) throw new Error('La ubicación no es válida.');
  if (String(p.resena || '').length > 2000) throw new Error('La reseña no puede superar 2000 caracteres.');
}
