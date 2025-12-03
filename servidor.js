const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(cors());

function validarCedulaModulo10(cedula) {
  const soloDigitos = String(cedula).replace(/\D/g, '');

  if (soloDigitos.length !== 11) {
    return { valida: false, cedula: soloDigitos };
  }

  const digitosInvertidos = soloDigitos.split('').reverse();
  let suma = 0;

  for (let i = 0; i < digitosInvertidos.length; i++) {
    let digito = parseInt(digitosInvertidos[i], 10);

    if (i % 2 === 1) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }

    suma += digito;
  }

  const esValida = (suma % 10 === 0);
  return { valida: esValida, cedula: soloDigitos };
}

// Endpoint principal POST
app.post("/validarCedula", (req, res) => {
  const { cedula } = req.body || {};

  if (!cedula) {
    return res.json({
      valida: false,
      mensaje: "Debe enviar el campo 'cedula' en el cuerpo de la peticion."
    });
  }

  const resultado = validarCedulaModulo10(cedula);

  if (resultado.valida) {
    res.json({
      cedula: resultado.cedula,
      valida: true,
      mensaje: "Cedula valida."
    });
  } else {
    res.json({
      cedula: resultado.cedula,
      valida: false,
      mensaje: "Cedula invalida."
    });
  }
});

// para probar que el servicio vive
app.get("/", (req, res) => {
  res.send("Servicio Web de validacion de cedula esta funcionando.");
});

app.listen(PORT, () => {
  console.log(`Servicio Web escuchando en http://localhost:${PORT}/`);
});

