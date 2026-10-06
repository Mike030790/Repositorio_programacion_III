const APP = {

  SPREADSHEET_ID:
    '1yjMCH__V-8sNOXF_9Hsv6BtuOdGoyvYe4z4nT65P82g',

  SHEET_GID:
    544546360,

  USERS_SHEET_NAME:
    'Usuarios',

  HEADERS: [
    'id',
    'fecha',
    'hora',
    'victimas',
    'estructura',
    'estadoVinculo',
    'fuente',
    'barrio',
    'direccion',
    'tipo',
    'latitud',
    'longitud',
    'resena',
    'fotoId',
    'fotoUrl',
    'creado'
  ],

  FOLDER_NAME:
    'Registro visual de hechos - fotografías',

  DEFAULT_CENTER: {
    lat:9.9146,
    lng:-84.1036
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

  requireAuthorizedUser_();

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

  requireAdmin_();

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

function getSheet_() {

  const spreadsheet =
    SpreadsheetApp.openById(
      APP.SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetById(
      APP.SHEET_GID
    );


  if (!sheet) {

    throw new Error(
      'No se encontró la pestaña configurada en Google Sheets.'
    );

  }


  return sheet;
}

/* =========================================================
   USUARIOS Y ROLES
========================================================= */

function getUsersSheet_() {

  const spreadsheet =
    SpreadsheetApp.openById(
      APP.SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      APP.USERS_SHEET_NAME
    );


  if (!sheet) {

    throw new Error(
      'No existe la pestaña "Usuarios".'
    );

  }


  return sheet;
}



function getCurrentUserProfile_() {

  const email =
    String(
      Session
        .getActiveUser()
        .getEmail() || ''
    )
    .trim()
    .toLowerCase();


  /*
   * Google no pudo entregar la identidad.
   */
  if (!email) {

    return {

      authorized:false,

      email:'',

      nombre:'',

      rol:'',

      activo:false,

      reason:'NO_EMAIL'

    };

  }


  const sheet =
    getUsersSheet_();


  const values =
    sheet
      .getDataRange()
      .getDisplayValues();


  const row =
    values
      .slice(1)
      .find(
        item =>
          String(item[0])
            .trim()
            .toLowerCase() ===
          email
      );


  /*
   * El correo existe en Google,
   * pero no está registrado.
   */
  if (!row) {

    return {

      authorized:false,

      email:email,

      nombre:'',

      rol:'',

      activo:false,

      reason:'NOT_REGISTERED'

    };

  }


  const nombre =
    String(
      row[1] || email
    ).trim();


  const rol =
    String(
      row[2] || ''
    )
    .trim()
    .toUpperCase();


  const activoText =
    String(
      row[3] || ''
    )
    .trim()
    .toUpperCase();


  const activo =
    [
      'SI',
      'SÍ',
      'TRUE',
      '1',
      'ACTIVO'
    ]
    .includes(
      activoText
    );


  const validRole =
    rol === 'ADMIN' ||
    rol === 'OFICIAL';


  return {

    authorized:
      activo &&
      validRole,

    email:
      email,

    nombre:
      nombre,

    rol:
      rol,

    activo:
      activo,

    reason:
      !activo
        ? 'INACTIVE'
        : (
            !validRole
              ? 'INVALID_ROLE'
              : ''
          )

  };

}



function requireAuthorizedUser_() {

  const user =
    getCurrentUserProfile_();


  if (!user.authorized) {

    throw new Error(
      'Usuario no autorizado para utilizar esta aplicación.'
    );

  }


  return user;
}



function requireAdmin_() {

  const user =
    requireAuthorizedUser_();


  if (
    user.rol !== 'ADMIN'
  ) {

    throw new Error(
      'Esta operación está disponible únicamente para administradores.'
    );

  }


  return user;
}


function probarConexionHoja() {

  const spreadsheet =
    SpreadsheetApp.openById(
      APP.SPREADSHEET_ID
    );


  const sheet =
    getSheet_();


  const resultado = {

    archivo:
      spreadsheet.getName(),

    pestaña:
      sheet.getName(),

    filas:
      sheet.getLastRow(),

    columnas:
      sheet.getLastColumn()

  };


  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );


  return resultado;
}

/* =========================================================
   DATOS CENTRALIZADOS EN GOOGLE SHEETS
========================================================= */


/**
 * Devuelve todos los registros almacenados.
 */
function getBootstrapData() {

  const user =
    getCurrentUserProfile_();


  /*
   * Usuario no autorizado.
   */
  if (!user.authorized) {

    return {

      authorized:false,

      user:user,

      records:[],

      center:
        APP.DEFAULT_CENTER,

      types:[
        'Arma de fuego',
        'Arma blanca'
      ]

    };

  }


  /*
   * ADMIN:
   * puede recibir todos los registros.
   *
   * OFICIAL:
   * no recibe la base completa.
   */
  const records =
  listRecords_();


  return {

    authorized:true,

    user:user,

    records:records,

    center:
      APP.DEFAULT_CENTER,

    types:[
      'Arma de fuego',
      'Arma blanca'
    ]

  };

}


/**
 * Lee todos los registros de la hoja.
 */
function listRecords_() {

  const sheet =
    getSheet_();

  const values =
    sheet
      .getDataRange()
      .getValues();


  /*
   * Si solamente existe la fila de encabezados,
   * todavía no hay registros.
   */
  if (values.length <= 1) {

    return [];

  }


  return values

    .slice(1)

    .filter(
      row =>
        row[0]
    )

    .map(
      normalizeSheetRow_
    )

    .reverse();
}


/**
 * Convierte una fila de Google Sheets
 * en un objeto que entiende la aplicación.
 */
function normalizeSheetRow_(row) {

  let victims = [];


  try {

    victims =
      JSON.parse(
        row[3] || '[]'
      );

  } catch (e) {

    victims = [
      String(
        row[3] || ''
      )
    ];

  }


  return {

    id:
      String(row[0] || ''),

    fecha:
      formatSheetDate_(
        row[1]
      ),

    hora:
      formatSheetTime_(
        row[2]
      ),

    victimas:
      victims,

    estructura:
      String(row[4] || ''),

    estadoVinculo:
      String(row[5] || ''),

    fuente:
      String(row[6] || ''),

    barrio:
      String(row[7] || ''),

    direccion:
      String(row[8] || ''),

    tipo:
      String(row[9] || ''),

    latitud:
      Number(row[10]),

    longitud:
      Number(row[11]),

    resena:
      String(row[12] || ''),

    fotoId:
      String(row[13] || ''),

    fotoUrl:
      String(row[14] || ''),

    creado:
      row[15]
        ? String(row[15])
        : ''

  };

}


/**
 * Convierte las fechas de Sheets a yyyy-MM-dd.
 */
function formatSheetDate_(value) {

  if (!value) {

    return '';

  }


  if (
    value instanceof Date
  ) {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );

  }


  return String(value)
    .slice(0, 10);
}


/**
 * Convierte la hora correctamente.
 */
function formatSheetTime_(value) {

  if (!value) {

    return '';

  }


  if (
    value instanceof Date
  ) {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'HH:mm'
    );

  }


  return String(value);
}

/* =========================================================
   GUARDAR / ACTUALIZAR REGISTRO EN GOOGLE SHEETS
========================================================= */

function saveRecord(record) {

  const user =
  requireAuthorizedUser_();

  validateCentralRecord_(record);

  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);


  try {

    const sheet =
      getSheet_();

    const values =
      sheet
        .getDataRange()
        .getValues();


    const id =
      String(
        record.id ||
        Utilities.getUuid()
      );


    /*
     * Buscar si el registro ya existe.
     * Si existe = EDITAR.
     * Si no existe = NUEVO.
     */
    const existingIndex =
      values.findIndex(
        (row, index) =>
          index > 0 &&
          String(row[0]) === id
      );
       /*
       * Un OFICIAL puede CREAR registros,
       * pero jamás modificar uno existente.
        */
       if (
         existingIndex >= 1 &&
          user.rol !== 'ADMIN'
        ) {

          throw new Error(
            'Los oficiales no pueden modificar registros enviados.'
          );

        }



    
    let creado =
      String(
        record.creado ||
        new Date().toISOString()
      );


    /*
     * Al editar conservamos la fecha
     * de creación original.
     */
    if (
      existingIndex >= 1 &&
      values[existingIndex][15]
    ) {

      creado =
        String(
          values[existingIndex][15]
        );

    }


    const victims =
      Array.isArray(record.victimas)
        ? record.victimas
            .map(String)
            .map(v => v.trim())
            .filter(Boolean)
        : [];


    const row = [

      id,

      String(
        record.fecha || ''
      ),

      String(
        record.hora || ''
      ),

      JSON.stringify(
        victims
      ),

      String(
        record.estructura ||
        'Sin determinar'
      ),

      String(
        record.estadoVinculo ||
        ''
      ),

      String(
        record.fuente ||
        ''
      ),

      String(
        record.barrio ||
        ''
      ),

      String(
        record.direccion ||
        ''
      ),

      String(
        record.tipo ||
        ''
      ),

      Number(
        record.latitud
      ),

      Number(
        record.longitud
      ),

      String(
        record.resena ||
        ''
      ),

      String(
        record.fotoId ||
        ''
      ),

      String(
        record.fotoUrl ||
        ''
      ),

      creado

    ];


    if (
      existingIndex >= 1
    ) {

      /*
       * EDITAR REGISTRO EXISTENTE
       */
      sheet
        .getRange(
          existingIndex + 1,
          1,
          1,
          row.length
        )
        .setValues([
          row
        ]);

    } else {

      /*
       * REGISTRO NUEVO
       */
      sheet.appendRow(
        row
      );

    }


    return normalizeSheetRow_(
      row
    );


  } finally {

    lock.releaseLock();

  }

}



/* =========================================================
   ELIMINAR REGISTRO DE GOOGLE SHEETS
========================================================= */

function deleteRecord(id) {
    
    requireAdmin_();

  id =
    String(id || '');


  if (!id) {

    throw new Error(
      'El ID del registro no es válido.'
    );

  }


  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);


  try {

    const sheet =
      getSheet_();

    const values =
      sheet
        .getDataRange()
        .getValues();


    const index =
      values.findIndex(
        (row, position) =>
          position > 0 &&
          String(row[0]) === id
      );


    if (
      index < 1
    ) {

      throw new Error(
        'No se encontró el registro solicitado.'
      );

    }


    sheet.deleteRow(
      index + 1
    );


    return {
      ok:true,
      id:id
    };


  } finally {

    lock.releaseLock();

  }

}



/* =========================================================
   VALIDAR REGISTRO
========================================================= */

function validateCentralRecord_(record) {

  if (!record) {

    throw new Error(
      'No se recibió información del registro.'
    );

  }


  if (
    !record.fecha ||
    !record.hora ||
    !record.barrio ||
    !record.tipo
  ) {

    throw new Error(
      'Complete los campos obligatorios.'
    );

  }


  if (
    !Array.isArray(record.victimas) ||
    !record.victimas.some(
      victim =>
        String(victim).trim()
    )
  ) {

    throw new Error(
      'Ingrese una víctima.'
    );

  }


  const lat =
    Number(
      record.latitud
    );

  const lng =
    Number(
      record.longitud
    );


  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {

    throw new Error(
      'La ubicación no es válida.'
    );

  }

}
