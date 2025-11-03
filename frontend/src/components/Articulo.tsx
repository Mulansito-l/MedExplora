import React from "react";
import styles from "./DetallesParte.module.css"; // asegúrate de tener este archivo
import FormattedText from "./FormattedText";

type BloqueContenido =
  | { tipo: "p"; texto?: string }
  | { tipo: "img"; path: string }
  | { tipo: "audio"; path: string }
  | { tipo: "video"; path: string }
  | { tipo: "l"; elementos: string[] };

type ArticuloType = {
  titulo: string;
  fechaPublicacion: string;
  contenido: BloqueContenido[];
};

interface DetallesParteProps {
  data: any;
  onVolver?: () => void;
}

const BASE_URL = "http://localhost:1337";

const toUrl = (u?: string) => (u?.startsWith("http") ? u : `${BASE_URL}${u ?? ""}`);

function transformarData(dataOriginal: any): ArticuloType {
  const articulo = Array.isArray(dataOriginal) && dataOriginal.length > 0
    ? dataOriginal[0]
    : {};

  const titulo = articulo?.Title ?? "Sin título";
  const fechaPublicacion = articulo?.Date ?? new Date().toISOString();

  const contenidoCrudo: any[] = Array.isArray(articulo?.contenido)
    ? articulo.contenido
    : [];

  const contenido: BloqueContenido[] = contenidoCrudo.map((bloque: any) => {
    const comp = bloque?.__component ?? bloque?.component;

    switch (comp) {
      case "shared.rich-text":
        return { tipo: "p", texto: bloque?.body ?? bloque?.texto ?? "" };

      case "shared.media": {
        const url = bloque?.file?.url ?? bloque?.path;
        return url ? { tipo: "img", path: toUrl(url) } : { tipo: "p", texto: "[Imagen no disponible]" };
      }

      case "shared.audio": {
        const file = bloque?.audio;
        const url =
          file?.[0]?.url ??
          file?.url ??
          file?.data?.attributes?.url ??
          bloque?.path;
        return url
          ? { tipo: "audio", path: toUrl(url) }
          : { tipo: "p", texto: "[Audio no disponible]" };
      }

      case "shared.video": {
        const file = bloque?.video;
        const url =
          file?.[0]?.url ??
          file?.url ??
          file?.data?.attributes?.url ??
          bloque?.path;
        return url
          ? { tipo: "video", path: toUrl(url) }
          : { tipo: "p", texto: "[Video no disponible]" };
      }


      case "shared.list": {
        const items: string[] = Array.isArray(bloque?.items) ? bloque.items : (Array.isArray(bloque?.elementos) ? bloque.elementos : []);
        return { tipo: "l", elementos: items };
      }

      default:
        return { tipo: "p", texto: "[Elemento no soportado]" };
    }
  });

  return { titulo, fechaPublicacion, contenido };
}

export default function DetallesParte({ data, onVolver }: DetallesParteProps) {
  let articulo: ArticuloType;
  try {
    articulo = transformarData(data);
  } catch (e) {
    articulo = {
      titulo: "Error al cargar",
      fechaPublicacion: new Date().toISOString(),
      contenido: [{ tipo: "p", texto: "Hubo un problema al parsear el contenido." }],
    };
  }

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
                  <div key={index} className={styles.parrafo}>
                    <FormattedText text={bloque.texto ?? ""} />
                  </div>
                );
              case "img":
                return <img key={index} src={bloque.path} alt="" className={styles.imagen} />;
              case "audio":
                return (
                  <audio key={index} controls className={styles.media}>
                    <source src={bloque.path} type="audio/mpeg" />
                    Tu navegador no soporta el audio.
                  </audio>
                );
              case "video":
                return (
                  <video key={index} controls className={styles.media}>
                    <source src={bloque.path} type="video/mp4" />
                    Tu navegador no soporta el video.
                  </video>
                );
              case "l":
                return (
                  <ul key={index} className={styles.lista}>
                    {bloque.elementos.map((el, i) => <li key={i}>{el}</li>)}
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
