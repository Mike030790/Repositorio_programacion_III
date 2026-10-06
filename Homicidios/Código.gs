const APP = {
  FOLDER_NAME: 'Registro visual de hechos - fotografías',
  DEFAULT_CENTER: {
    lat: 9.9146,
    lng: -84.1036
  }
};


/* =========================================================
   APLICACIÓN WEB
========================================================= */

function doGet() {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Registro visual de homicidios')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* =========================================================
   FOTOGRAFÍAS
========================================================= */

/**
 * Recibe una fotografía desde Index.html
 * y la almacena en Google Drive.
 */
function uploadPhoto(dataUrl, name) {

  if (!dataUrl) {
    return {
      id: '',
      url: ''
    };
  }

  return savePhoto_(dataUrl, name);
}


/**
 * Envía una fotografía a la papelera de Drive.
 */
function deletePhoto(photoId) {

  if (!photoId) {
    return {
      ok: true
    };
  }

  try {

    DriveApp
      .getFileById(photoId)
      .setTrashed(true);

  } catch (e) {

    console.warn(
      'No fue posible eliminar la fotografía:',
      e
    );
  }

  return {
    ok: true
  };
}


/**
 * Función interna para guardar fotografías.
 */
function savePhoto_(dataUrl, name) {

  const match = String(dataUrl).match(
    /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/
  );

  if (!match) {
    throw new Error(
      'La fotografía debe ser PNG, JPG o WEBP.'
    );
  }

  const bytes =
    Utilities.base64Decode(match[2]);

  if (bytes.length > 8 * 1024 * 1024) {
    throw new Error(
      'La fotografía no puede superar 8 MB.'
    );
  }

  const folders =
    DriveApp.getFoldersByName(
      APP.FOLDER_NAME
    );

  const folder =
    folders.hasNext()
      ? folders.next()
      : DriveApp.createFolder(
          APP.FOLDER_NAME
        );

  const file = folder.createFile(
    Utilities.newBlob(
      bytes,
      match[1],
      name || ('foto-' + Date.now())
    )
  );

  return {
    id: file.getId(),
    url:
      'https://drive.google.com/thumbnail?id=' +
      file.getId() +
      '&sz=w1000'
  };
}


/* =========================================================
   EXPORTAR POWERPOINT
========================================================= */

function exportPowerPoint(records, periodLabel) {

  const selected =
    normalizeExportRecords_(records);

  if (!selected.length) {
    throw new Error(
      'No hay hechos para exportar.'
    );
  }

  const deckName =
    'Registro de hechos - ' +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );

  const deck =
    SlidesApp.create(deckName);


  /* =====================================================
     PORTADA
  ===================================================== */

  const first =
    deck.getSlides()[0];

  clearSlide_(first);

  addText_(
    first,
    'REGISTRO VISUAL DE HECHOS',
    45,
    115,
    630,
    60,
    28,
    true,
    '#17352E'
  );

  addText_(
    first,
    'Delegación de Hatillo',
    45,
    185,
    630,
    35,
    18,
    false,
    '#B06C3C'
  );

  addText_(
    first,
    periodLabel ||
      'Período seleccionado',
    45,
    235,
    630,
    28,
    13,
    false,
    '#53645F'
  );

  addText_(
    first,
    selected.length +
      (
        selected.length === 1
          ? ' hecho incluido'
          : ' hechos incluidos'
      ),
    45,
    285,
    630,
    28,
    12,
    false,
    '#53645F'
  );


  /* =====================================================
     UNA DIAPOSITIVA POR REGISTRO
  ===================================================== */

  selected.forEach(
    (record, index) => {

      addRecordSlide_(
        deck,
        record,
        index + 1
      );

    }
  );


  deck.saveAndClose();

  /*
   * Pequeña pausa para asegurar que Slides
   * haya terminado de guardar antes de exportar.
   */
  Utilities.sleep(500);


  /* =====================================================
     CONVERTIR GOOGLE SLIDES A PPTX
  ===================================================== */

  const token =
    ScriptApp.getOAuthToken();

  const exportUrl =
    'https://www.googleapis.com/drive/v3/files/' +
    deck.getId() +
    '/export?mimeType=' +
    encodeURIComponent(
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );

  const response =
    UrlFetchApp.fetch(
      exportUrl,
      {
        headers: {
          Authorization:
            'Bearer ' + token
        },
        muteHttpExceptions:
          true
      }
    );

  if (
    response.getResponseCode() !== 200
  ) {

    throw new Error(
      'No fue posible exportar la presentación. Código ' +
      response.getResponseCode()
    );
  }

  const pptxFile =
    DriveApp.createFile(
      response
        .getBlob()
        .setName(
          deckName + '.pptx'
        )
    );

  return {
    url:
      pptxFile.getDownloadUrl(),

    name:
      pptxFile.getName(),

    slidesUrl:
      deck.getUrl()
  };
}


/* =========================================================
   DIAPOSITIVA INDIVIDUAL
========================================================= */

function addRecordSlide_(deck, r, number) {

  const slide =
    deck.appendSlide(
      SlidesApp.PredefinedLayout.BLANK
    );


  /* TÍTULO */

  addText_(
    slide,
    String(number).padStart(2, '0') +
      '  ' +
      (
        r.victimas.join(', ') ||
        'Víctima sin identificar'
      ),
    28,
    18,
    664,
    36,
    20,
    true,
    '#17352E'
  );


  /* FOTOGRAFÍA */

  if (r.fotoId) {

    try {

      slide.insertImage(
        DriveApp
          .getFileById(r.fotoId)
          .getBlob(),
        28,
        70,
        270,
        185
      );

    } catch (e) {

      console.warn(
        'No fue posible insertar la fotografía del registro ' +
        r.id,
        e
      );
    }
  }


  /* DATOS */

  const facts = [
    [
      'FECHA Y HORA',
      formatDate_(r.fecha) +
        ' · ' +
        r.hora
    ],
    [
      'TIPO',
      r.tipo
    ],
    [
      'ESTRUCTURA',
      r.estructura
    ],
    [
      'LUGAR',
      [
        r.barrio,
        r.direccion
      ]
        .filter(Boolean)
        .join(' · ')
    ]
  ];

  let y = 70;

  facts.forEach(f => {

    addText_(
      slide,
      f[0],
      325,
      y,
      120,
      18,
      8,
      true,
      '#B06C3C'
    );

    addText_(
      slide,
      f[1],
      445,
      y - 1,
      240,
      28,
      10,
      false,
      '#24332F'
    );

    y += 32;
  });


  /* RESEÑA */

  addText_(
    slide,
    'RESEÑA',
    28,
    278,
    80,
    18,
    8,
    true,
    '#B06C3C'
  );

  addText_(
    slide,
    r.resena ||
      'Sin reseña.',
    28,
    300,
    420,
    80,
    10,
    false,
    '#24332F'
  );


  /* MAPA DEL HECHO */

  try {

    const mapBlob =
      createRecordMap_(r);

    slide.insertImage(
      mapBlob,
      475,
      270,
      210,
      118
    );

    addText_(
      slide,
      'Ubicación: ' +
        r.latitud.toFixed(6) +
        ', ' +
        r.longitud.toFixed(6),
      475,
      389,
      210,
      12,
      7,
      false,
      '#53645F'
    );

  } catch (e) {

    addText_(
      slide,
      'Mapa no disponible',
      500,
      320,
      160,
      18,
      10,
      false,
      '#53645F'
    );

    console.warn(
      'No fue posible generar el mapa del registro ' +
      r.id,
      e
    );
  }
}


/* =========================================================
   MAPA INDIVIDUAL DEL POWERPOINT
========================================================= */

function createRecordMap_(r) {

  const map =
    Maps.newStaticMap()
      .setSize(640, 360)
      .setCenter(
        r.latitud,
        r.longitud
      )
      .setZoom(17)
      .setMapType(
        Maps.StaticMap.Type.ROADMAP
      )
      .setFormat(
        Maps.StaticMap.Format.PNG
      )
      .setLanguage('es')
      .setMarkerStyle(
        Maps.StaticMap.MarkerSize.MID,
        Maps.StaticMap.Color.RED,
        '1'
      )
      .addMarker(
        r.latitud,
        r.longitud
      );

  return map
    .getBlob()
    .setName(
      'mapa-' +
      r.id +
      '.png'
    );
}


/* =========================================================
   NORMALIZAR DATOS RECIBIDOS
========================================================= */

function normalizeExportRecords_(records) {

  if (!Array.isArray(records)) {
    return [];
  }

  return records

    .map(r => {

      const victims =
        Array.isArray(r.victimas)
          ? r.victimas
              .map(String)
              .map(v => v.trim())
              .filter(Boolean)
          : [];

      return {

        id:
          String(r.id || ''),

        fecha:
          String(r.fecha || '')
            .slice(0, 10),

        hora:
          String(r.hora || ''),

        victimas:
          victims,

        estructura:
          String(
            r.estructura ||
            'Sin determinar'
          ),

        barrio:
          String(r.barrio || ''),

        direccion:
          String(r.direccion || ''),

        tipo:
          String(r.tipo || ''),

        latitud:
          Number(r.latitud),

        longitud:
          Number(r.longitud),

        resena:
          String(r.resena || ''),

        fotoId:
          String(r.fotoId || ''),

        fotoUrl:
          String(r.fotoUrl || ''),

        creado:
          String(r.creado || ''),

        modificado:
          String(r.modificado || '')

      };

    })

    .filter(r =>

      r.id &&

      r.fecha &&

      r.hora &&

      r.barrio &&

      r.tipo &&

      r.victimas.length &&

      isFinite(r.latitud) &&

      isFinite(r.longitud) &&

      r.latitud >= -90 &&

      r.latitud <= 90 &&

      r.longitud >= -180 &&

      r.longitud <= 180

    );
}


/* =========================================================
   UTILIDADES DE GOOGLE SLIDES
========================================================= */

function addText_(
  slide,
  text,
  x,
  y,
  w,
  h,
  size,
  bold,
  color
) {

  const shape =
    slide.insertTextBox(
      String(text || ''),
      x,
      y,
      w,
      h
    );

  shape
    .getText()
    .getTextStyle()
    .setFontFamily('Arial')
    .setFontSize(size)
    .setBold(bold)
    .setForegroundColor(color);

  return shape;
}


function clearSlide_(slide) {

  slide
    .getPageElements()
    .forEach(
      element =>
        element.remove()
    );
}


function formatDate_(value) {

  return value
    ? String(value)
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('/')
    : '—';
}
