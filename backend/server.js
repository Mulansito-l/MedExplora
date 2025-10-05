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

app.get("/api/mensaje", (req, res) => {
  res.json({
    mensaje: "¡Hola desde el backend! 🚀",
    timestamp: new Date(),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
