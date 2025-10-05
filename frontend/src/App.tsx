// App.jsx
import { useState, useEffect } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/mensaje")
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Frontend + Backend</h1>
      <p>{mensaje || "Cargando..."}</p>
    </div>
  );
}

export default App;
