import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";

function App() {

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then(res => res.json())
      .then(data => setMensaje(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Frontend CRA</h1>
      <p>Respuesta del backend: {mensaje}</p>
    </div>
  );
}

export default App;
