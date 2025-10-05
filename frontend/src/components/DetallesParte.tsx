import React from "react";

// Definimos los tipos de bloques de contenido
export type BloqueContenido =
  | { tipo: "p"; texto?: string; path?: string }
  | { tipo: "img"; path: string }
  | { tipo: "l"; elementos: string[] };

// Tipo del artículo completo
export type ArticuloType = {
  titulo: string;
  fechaPublicacion: string;
  contenido: BloqueContenido[];
};

// Props del componente
interface DetallesParteProps {
  data: ArticuloType;
  onVolver?: () => void; // opcional, para volver al modelo 3D
}

export default function DetallesParte({ data, onVolver }: DetallesParteProps) {
  return (
    <div className="articulo-full" style={{ padding: "2rem", maxHeight: "100%", overflowY: "auto" }}>
      <h1>{data.titulo}</h1>
      <p>
        <em>{new Date(data.fechaPublicacion).toLocaleDateString()}</em>
      </p>

      {data.contenido.map((bloque, index) => {
        switch (bloque.tipo) {
          case "p":
            return <p key={index}>{bloque.texto || bloque.path}</p>;

          case "img":
            return (
              <img
                key={index}
                src={bloque.path}
                alt=""
                style={{ maxWidth: "100%", margin: "1rem 0" }}
              />
            );

          case "l":
            return (
              <ul key={index} style={{ margin: "1rem 0" }}>
                {bloque.elementos.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}

      {onVolver && (
        <button
          onClick={onVolver}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Volver al modelo
        </button>
      )}
    </div>
  );
}