import React from "react";
import styles from "./DetallesParte.module.css";

export type BloqueContenido =
  | { tipo: "p"; texto?: string; path?: string }
  | { tipo: "img"; path: string }
  | { tipo: "l"; elementos: string[] };

export type ArticuloType = {
  titulo: string;
  fechaPublicacion: string;
  contenido: BloqueContenido[];
};

interface DetallesParteProps {
  data: any; // 👈 acepta la estructura cruda
  onVolver?: () => void;
}

// 🔁 Función para adaptar la estructura externa
function transformarData(dataOriginal: any): ArticuloType {
  const articulo = dataOriginal[0];

  const contenido: BloqueContenido[] = articulo.contenido.map((bloque: any) => {
    switch (bloque.__component) {
      case "shared.rich-text":
        return { tipo: "p", texto: bloque.body || "" };
      case "shared.media":
        return { tipo: "img", path: "http://localhost:1337" + bloque.file.url || "" };
      default:
        return { tipo: "p", texto: "[Elemento no soportado]" };
    }
  });

  return {
    titulo: articulo.Title,
    fechaPublicacion: articulo.Date,
    contenido,
  };
}

export default function DetallesParte({ data, onVolver }: DetallesParteProps) {
  const articulo = transformarData(data); // 👈 lo convertimos aquí

  return (
    <div className={styles.articuloFull}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>{articulo.titulo}</h1>
          <p className={styles.fecha}>
            {new Date(articulo.fechaPublicacion).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className={styles.cuerpo}>
          {articulo.contenido.map((bloque, index) => {
            switch (bloque.tipo) {
              case "p":
              return (
                <p key={index} className={styles.parrafo}>
                  {bloque.texto
                    ?.split(/\n+/) // separa por saltos de línea
                    .map((linea, i) => (
                      <React.Fragment key={i}>
                        {linea.trim()}
                        <br />
                        <br />
                      </React.Fragment>
                    ))}
                </p>
              );
              case "img":
                return (
                  <img
                    key={index}
                    src={bloque.path}
                    alt=""
                    className={styles.imagen}
                  />
                );
              case "l":
                return (
                  <ul key={index} className={styles.lista}>
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
      </div>

      {onVolver && (
        <button onClick={onVolver} className={styles.botonVolver}>
          ← Volver al modelo
        </button>
      )}
    </div>
  );
}
