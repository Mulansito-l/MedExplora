const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde backend 👋" });
});

app.listen(3001, () => console.log("✅ Backend en http://localhost:3001"));