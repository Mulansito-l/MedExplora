import React from "react";

interface BloqueContenido {
  tipo: "p" | "img" | "l";
  texto?: string;
  path?: string;
  elementos?: string[];
}

export interface ArticuloData {
  titulo: string;
  fechaPublicacion: string;
  contenido: BloqueContenido[];
}

interface ArticuloProps {
  data: any; // viene con estructura cruda
}

function transformarData(dataOriginal: any): ArticuloData {
  const articulo = dataOriginal[0];

  const contenido: BloqueContenido[] = articulo.contenido.map((bloque: any) => {
    switch (bloque.component) {
      case "shared.rich-text":
        return { tipo: "p", texto: bloque.texto || "" };
      case "shared.media":
        return { tipo: "img", path: bloque.path || "" };
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

export default function DetallesParte({ data }: ArticuloProps) {
  const articulo = transformarData(data);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{articulo.titulo}</h1>
      <p>
        <em>{new Date(articulo.fechaPublicacion).toLocaleDateString()}</em>
      </p>

      {articulo.contenido.map((bloque, index) => {
        switch (bloque.tipo) {
          case "p":
            return <p key={index}>{bloque.texto}</p>;
          case "img":
            return (
              <img
                key={index}
                src={bloque.path}
                alt=""
                style={{ maxWidth: "100%" }}
              />
            );
          case "l":
            return (
              <ul key={index}>
                {bloque.elementos?.map((el, i) => (
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
