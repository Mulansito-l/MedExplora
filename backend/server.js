import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta para recibir la parte del cuerpo seleccionada
// server.js
app.post("/api/parte", (req, res) => {
  const { parte } = req.body;

  // Base de datos simulada con info de cada parte
  const informacionPartes = {
    Cabeza: {
      titulo: "Cabeza",
      descripcion:
        "La cabeza contiene el cerebro, principal órgano del sistema nervioso central.",
      secciones: [
        {
          subtitulo: "Componentes principales",
          contenido:
            "Cerebro, cráneo, músculos faciales y órganos sensoriales.",
        },
        {
          subtitulo: "Funciones",
          contenido:
            "Control del pensamiento, memoria, emociones y coordinación corporal.",
        },
      ],
      datos: ["Peso promedio: 1.4 kg", "Contiene 100 mil millones de neuronas"],
      imagenUrl: "/images/cabeza.jpg", // opcional
    },
    Torso: {
      titulo: "Torso",
      descripcion: "El torso protege los órganos vitales del cuerpo.",
      secciones: [
        {
          subtitulo: "Órganos principales",
          contenido: "Corazón, pulmones, estómago, hígado, riñones.",
        },
      ],
      datos: ["Contiene la caja torácica", "Protege el corazón y pulmones"],
      imagenUrl: "/images/torso.jpg",
    },
    Brazos: {
      titulo: "Brazos",
      descripcion:
        "Los brazos permiten realizar movimientos complejos y manipular objetos.",
      secciones: [
        {
          subtitulo: "Estructura",
          contenido: "Húmero, radio, cúbito y músculos diversos.",
        },
      ],
      datos: ["27 huesos en cada brazo y mano", "Más de 30 músculos"],
      imagenUrl: "/images/brazos.jpg",
    },
    // Agrega más partes aquí
  };

  const info = informacionPartes[parte] || {
    titulo: parte,
    descripcion: "Información no disponible para esta parte.",
    secciones: [],
    datos: [],
  };

  res.json(info);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
