const ID_SPREADSHEET = "1aswoMBP-y6dwH7bQqnvkv8cEGqc_k5qgMTeyqB0KU3E";
const NOMBRE_HOJA = "usuarios";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Sistema de Usuarios");
}

function generarHash(password) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password),
    Utilities.Charset.UTF_8
  );

  return bytes.map(function (byte) {
    const valor = byte < 0 ? byte + 256 : byte;
    return ("0" + valor.toString(16)).slice(-2);
  }).join("");
}

function iniciarSesion(usuario, password) {
  try {
    usuario = String(usuario || "").trim().toLowerCase();
    password = String(password || "");

    if (!usuario || !password) {
      return { exito: false, mensaje: "Debe ingresar usuario y contraseña." };
    }

    const hoja = obtenerHojaUsuarios_();
    const ultimaFila = hoja.getLastRow();

    if (ultimaFila < 2) {
      return { exito: false, mensaje: "No existen usuarios registrados." };
    }

    const datos = hoja.getRange(2, 1, ultimaFila - 1, 5).getValues();
    const hashIngresado = generarHash(password);

    for (let i = 0; i < datos.length; i++) {
      const usuarioGuardado = String(datos[i][0] || "").trim().toLowerCase();

      if (usuarioGuardado !== usuario) {
        continue;
      }

      const hashGuardado = String(datos[i][1] || "").trim();
      const nombre = String(datos[i][2] || "").trim();
      const estado = String(datos[i][3] || "").trim().toUpperCase();
      const rol = String(datos[i][4] || "USUARIO").trim().toUpperCase();

      if (estado !== "ACTIVO") {
        return { exito: false, mensaje: "El usuario se encuentra inactivo." };
      }

      if (hashGuardado !== hashIngresado) {
        return { exito: false, mensaje: "Contraseña incorrecta." };
      }

      const token = Utilities.getUuid();
      CacheService.getScriptCache().put(
        "sesion_" + token,
        JSON.stringify({ usuario: usuarioGuardado, nombre: nombre, rol: rol }),
        21600
      );

      return {
        exito: true,
        nombre: nombre,
        usuario: usuarioGuardado,
        rol: rol,
        token: token
      };
    }

    return { exito: false, mensaje: "Usuario no encontrado." };
  } catch (error) {
    return { exito: false, mensaje: "Error: " + error.message };
  }
}

function obtenerSesion(token) {
  if (!token) {
    return null;
  }

  const datos = CacheService.getScriptCache().get("sesion_" + token);
  return datos ? JSON.parse(datos) : null;
}

function crearUsuario(token, usuario, password, nombre, rol) {
  try {
    const errorPermiso = validarAdministrador_(token, "crear usuarios");
    if (errorPermiso) {
      return errorPermiso;
    }

    usuario = String(usuario || "").trim().toLowerCase();
    password = String(password || "");
    nombre = String(nombre || "").trim();
    rol = String(rol || "USUARIO").trim().toUpperCase();

    if (!usuario) {
      return { exito: false, mensaje: "Debe indicar un usuario." };
    }
    if (!nombre) {
      return { exito: false, mensaje: "Debe indicar el nombre." };
    }
    if (password.length < 6) {
      return { exito: false, mensaje: "La contraseña debe tener al menos 6 caracteres." };
    }
    if (!["USUARIO", "SUPERVISOR", "ADMINISTRADOR"].includes(rol)) {
      return { exito: false, mensaje: "Rol no válido." };
    }

    const hoja = obtenerHojaUsuarios_();
    const ultimaFila = hoja.getLastRow();

    if (ultimaFila >= 2) {
      const usuarios = hoja.getRange(2, 1, ultimaFila - 1, 1).getValues();
      const yaExiste = usuarios.some(function (fila) {
        return String(fila[0] || "").trim().toLowerCase() === usuario;
      });

      if (yaExiste) {
        return { exito: false, mensaje: "El usuario ya existe." };
      }
    }

    hoja.appendRow([usuario, generarHash(password), nombre, "ACTIVO", rol]);
    SpreadsheetApp.flush();
    return { exito: true, mensaje: "Usuario creado correctamente." };
  } catch (error) {
    return { exito: false, mensaje: "Error: " + error.message };
  }
}

// Debe ser una función global para que google.script.run pueda invocarla.
function cambiarPassword(token, usuario, nuevaPassword) {
  try {
    const errorPermiso = validarAdministrador_(token, "cambiar contraseñas");
    if (errorPermiso) {
      return errorPermiso;
    }

    usuario = String(usuario || "").trim().toLowerCase();
    nuevaPassword = String(nuevaPassword || "");

    if (!usuario) {
      return { exito: false, mensaje: "Debe indicar el usuario." };
    }
    if (nuevaPassword.length < 6) {
      return { exito: false, mensaje: "La nueva contraseña debe tener al menos 6 caracteres." };
    }

    const hoja = obtenerHojaUsuarios_();
    const ultimaFila = hoja.getLastRow();

    if (ultimaFila < 2) {
      return { exito: false, mensaje: "No existen usuarios registrados." };
    }

    const usuarios = hoja.getRange(2, 1, ultimaFila - 1, 1).getValues();
    for (let i = 0; i < usuarios.length; i++) {
      const usuarioGuardado = String(usuarios[i][0] || "").trim().toLowerCase();
      if (usuarioGuardado === usuario) {
        hoja.getRange(i + 2, 2).setValue(generarHash(nuevaPassword));
        SpreadsheetApp.flush();
        return { exito: true, mensaje: "Contraseña actualizada correctamente." };
      }
    }

    return { exito: false, mensaje: "Usuario no encontrado." };
  } catch (error) {
    return { exito: false, mensaje: "Error: " + error.message };
  }
}

function validarAdministrador_(token, operacion) {
  const sesion = obtenerSesion(token);
  if (!sesion) {
    return { exito: false, mensaje: "La sesión ha expirado. Inicie sesión nuevamente." };
  }
  if (sesion.rol !== "ADMINISTRADOR") {
    return { exito: false, mensaje: "No tiene permisos para " + operacion + "." };
  }
  return null;
}

function obtenerHojaUsuarios_() {
  const hoja = SpreadsheetApp.openById(ID_SPREADSHEET).getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    throw new Error('No se encontró la hoja "usuarios".');
  }
  return hoja;
}

function cerrarSesion(token) {
  if (token) {
    CacheService.getScriptCache().remove("sesion_" + token);
  }
  return true;
}
