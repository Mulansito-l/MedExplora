import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Permite que el frontend se conecte
app.use(express.json()); // Para recibir JSON en el body

// Rutas
app.get("/", (req, res) => {
  res.json({ mensaje: "Backend funcionando ✅" });
});

app.get("/api/cabeza", (req, res) => {
  res.json({
    titulo: "Cabeza Humana",
    fechaPublicacion: new Date(),
    contenido: [
      {
        tipo: "p",
        texto: "La cabeza es la parte superior del cuerpo humano que contiene el cerebro, los órganos de los sentidos (ojos, oídos, nariz, lengua) y la boca. Es fundamental para la percepción del entorno, la comunicación y el control del cuerpo."
      },
      {
        tipo: "img",
        path: "/recursos/cabeza.jpg"
      },
      { 
        tipo: "p",
        texto: "Principales estructuras de la cabeza:"
      },
      {
        tipo: "l",
        elementos: [
          "Cráneo",
          "Cerebro",
          "Ojos",
          "Oídos",
          "Nariz",
          "Boca"
        ]
      }
    ]
  });
});

app.get("/api/brazos", (req, res) => {
  res.json({
    titulo: "Brazos Humanos",
    fechaPublicacion: new Date(),
    contenido: [
      {
        tipo: "p",
        texto: "Los brazos son las extremidades superiores del cuerpo humano. Permiten realizar movimientos complejos, como levantar, empujar o sujetar objetos, y están formados por huesos, músculos, articulaciones, nervios y vasos sanguíneos."
      },
      {
        tipo: "img",
        path: "/recursos/brazos.jpg"
      },
      {
        tipo: "p",
        texto: "Principales estructuras de los brazos:"
      },
      {
        tipo: "l",
        elementos: [
          "Húmero",
          "Cúbito",
          "Radio",
          "Músculos (bíceps, tríceps)",
          "Articulaciones (hombro, codo, muñeca)"
        ]
      }
    ]
  });
});

app.get("/api/piernas", (req, res) => {
  res.json({
    titulo: "Piernas Humanas",
    fechaPublicacion: new Date(),
    contenido: [
      {
        tipo: "p",
        texto: "Las piernas son las extremidades inferiores del cuerpo humano, fundamentales para el movimiento, el equilibrio y la postura. Están formadas por huesos, músculos, articulaciones y vasos sanguíneos."
      },
      {
        tipo: "img",
        path: "/recursos/piernas.jpg"
      },
      {
        tipo: "p",
        texto: "Principales estructuras de las piernas:"
      },
      {
        tipo: "l",
        elementos: [
          "Fémur",
          "Rótula",
          "Tibia",
          "Peroné",
          "Músculos (cuádriceps, isquiotibiales)",
          "Articulaciones (cadera, rodilla, tobillo)"
        ]
      }
    ]
  });
});

app.get("/api/pies", (req, res) => {
  res.json({
    titulo: "Pies Humanos",
    fechaPublicacion: new Date(),
    contenido: [
      {
        tipo: "p",
        texto: "Los pies son la parte inferior de las piernas, encargados de soportar el peso del cuerpo y permitir la locomoción. Están formados por huesos, músculos, ligamentos y articulaciones que facilitan el equilibrio y la movilidad."
      },
      {
        tipo: "img",
        path: "/recursos/pies.jpg"
      },
      {
        tipo: "p",
        texto: "Principales estructuras de los pies:"
      },
      {
        tipo: "l",
        elementos: [
          "Tarsos",
          "Metatarsos",
          "Falanges",
          "Arcos plantares",
          "Ligamentos y tendones"
        ]
      }
    ]
  });
});

app.get("/api/torso", (req, res) => {
  res.json({
    titulo: "Torso Humano",
    fechaPublicacion: new Date(),
    contenido: [
      {
        tipo: "p",
        texto: "El torso es la parte central del cuerpo humano, donde se encuentran órganos vitales como el corazón, los pulmones y órganos digestivos. Está protegido por la caja torácica y soporta la cabeza y las extremidades."
      },
      {
        tipo: "img",
        path: "/recursos/torso.jpg"
      },
      {
        tipo: "p",
        texto: "Principales estructuras del torso:"
      },
      {
        tipo: "l",
        elementos: [
          "Columna vertebral",
          "Caja torácica (costillas y esternón)",
          "Pulmones",
          "Corazón",
          "Hígado y otros órganos abdominales",
          "Músculos (pectoral, abdominales, dorsales)"
        ]
      }
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
