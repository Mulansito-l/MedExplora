// App.jsx
import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [articulo, setArt] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/Cabeza")
      .then((res) => res.json())
      .then((data) => setArt(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  if (!articulo) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{articulo.titulo}</h1>
      <p><em>{new Date(articulo.fechaPublicacion).toLocaleDateString()}</em></p>

      {articulo.contenido.map((bloque, index) => {
        switch (bloque.tipo) {
          case "p":
            return <p key={index}>{bloque.texto || bloque.path}</p>;

          case "img":
            return <img key={index} src={bloque.path} alt="" style={{ maxWidth: "100%" }} />;

          case "l":
            return (
              <ul key={index}>
                {bloque.elementos.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default App;
