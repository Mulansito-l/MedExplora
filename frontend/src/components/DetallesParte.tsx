import React, { useState, useEffect } from "react";
import styles from "./DetallesParte.module.css";
import FormattedText from "./FormattedText";

type BloqueContenido =
  | { tipo: "p"; texto?: string }
  | { tipo: "img"; path: string }
  | { tipo: "audio"; path: string }
  | { tipo: "video"; path: string }
  | { tipo: "l"; elementos: string[] }
  | { tipo: "sub"; articulo: ArticuloType };

type ArticuloType = {
  titulo: string;
  fechaPublicacion: string;
  contenido: BloqueContenido[];
};

interface DetallesParteProps {
  data: any;
  onVolver?: () => void;
  onArticuloChange?: (articulo: ArticuloType | null) => void;
}

const BASE_URL = "http://192.168.100.31:1337";

const toUrl = (u?: string) =>
  u?.startsWith("http") ? u : `${BASE_URL}${u ?? ""}`;

/**
 * Transforma los datos recibidos de Strapi en un formato uniforme
 * para renderizar en el frontend.
 */
function transformarData(dataOriginal: any): ArticuloType {
  const articulo = dataOriginal;
  const titulo = articulo?.Title ?? "Sin título";
  const fechaPublicacion = articulo?.Date ?? new Date().toISOString();

  const contenidoCrudo: any[] = Array.isArray(articulo?.contenido)
    ? articulo.contenido
    : [];

  const contenido: BloqueContenido[] = contenidoCrudo.map((bloque: any) => {
    const comp = bloque?.__component ?? bloque?.component;

    switch (comp) {
      // 🔹 Texto enriquecido
      case "shared.rich-text":
        return { tipo: "p", texto: bloque?.body ?? bloque?.texto ?? "" };

      // 🔹 Media general (imagen, video o audio)
      case "shared.media": {
        const file = bloque?.file;
        const url =
          file?.url ??
          file?.[0]?.url ??
          file?.data?.attributes?.url ??
          bloque?.path ??
          "";
        const mime =
          file?.mime ?? file?.[0]?.mime ?? file?.data?.attributes?.mime ?? "";

        if (!url)
          return { tipo: "p", texto: "[Archivo multimedia no disponible]" };

        if (mime.startsWith("image/")) {
          return { tipo: "img", path: toUrl(url) };
        } else if (mime.startsWith("video/")) {
          return { tipo: "video", path: toUrl(url) };
        } else if (mime.startsWith("audio/")) {
          return { tipo: "audio", path: toUrl(url) };
        } else {
          return {
            tipo: "p",
            texto: `[Tipo de archivo no soportado: ${mime}]`,
          };
        }
      }

      // 🔹 Lista de elementos
      case "shared.list": {
        const items: string[] = Array.isArray(bloque?.items)
          ? bloque.items
          : Array.isArray(bloque?.elementos)
          ? bloque.elementos
          : [];
        return { tipo: "l", elementos: items };
      }

      // 🔹 Sub-artículo referenciado (componentes de tipo referencia)
      case "shared.article":
      case "shared.subarticle":
      case "shared.reference": {
        // Strapi puede devolver la referencia en varias formas: bloque.articulo, bloque.referencia, bloque.entry, etc.
        const ref =
          bloque?.articulo ??
          bloque?.referencia ??
          bloque?.entry ??
          bloque?.article ??
          null;
        const refData = ref?.data ?? ref ?? null;
        const referenced = Array.isArray(refData) ? refData[0] : refData;
        if (!referenced)
          return { tipo: "p", texto: "[Referencia no disponible]" };

        // referenced puede tener la forma { attributes: { ... } } o ser ya el objeto artículo
        const entry = referenced.attributes ?? referenced;
        const subArticulo = transformarData(entry);
        return { tipo: "sub", articulo: subArticulo };
      }

      // 🔹 Por defecto
      default:
        return { tipo: "p", texto: "[Elemento no soportado]" };
    }
  });

  return { titulo, fechaPublicacion, contenido };
}

export default function DetallesParte({
  data,
  onArticuloChange,
  onVolver,
}: DetallesParteProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  let articulo: ArticuloType;

  // Efecto para manejar la animación cuando cambia el data
  useEffect(() => {
    // Primero ocultamos con animación
    setShowAnimation(false);

    // Después de un pequeño delay, mostramos con animación
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [data]); // Se ejecuta cada vez que cambia el data

  // Función que maneja los clics en ==slug==
  const handleSlugClick = async (slug: string) => {
    console.log("Slug clickeado:", slug);

    try {
      const response = await fetch(
        `http://192.168.100.31:1337/api/articulo-gens?filters[slug][$eq]=${slug}&populate=*`
      );
      const data = await response.json();

      console.log("Respuesta completa de la API:", data);

      if (data.data && data.data.length > 0) {
        const articuloEncontrado = data.data[0];
        console.log("Artículo encontrado:", articuloEncontrado);

        // Activar animación de cambio
        setShowAnimation(false);

        setTimeout(() => {
          if (onArticuloChange) {
            onArticuloChange(data.data[0]);
          }
          setShowAnimation(true);
        }, 150);
      } else {
        alert(`No se encontró ningún artículo con el slug: ${slug}`);
      }
    } catch (error) {
      console.error("Error al buscar el artículo:", error);
      alert("Error al buscar el artículo");
    }
  };

  try {
    articulo = transformarData(data);
  } catch (e) {
    articulo = {
      titulo: "Error al cargar",
      fechaPublicacion: new Date().toISOString(),
      contenido: [
        { tipo: "p", texto: "Hubo un problema al parsear el contenido." },
      ],
    };
  }

  return (
    <div
      className={`${styles.articuloFull} ${
        showAnimation ? styles.detallesEnter : styles.detallesExit
      }`}
    >
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
                    <FormattedText
                      text={bloque.texto ?? ""}
                      onInternalLinkClick={handleSlugClick}
                    />
                  </div>
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
              case "audio":
                return (
                  <audio key={index} controls className={styles.media}>
                    <source src={bloque.path} type="audio/mpeg" />
                    Tu navegador no soporta el audio.
                  </audio>
                );
              case "video":
                return (
                  <div key={index} className={styles.videoContainer}>
                    <video controls>
                      <source src={bloque.path} type="video/mp4" />
                      Tu navegador no soporta el video.
                    </video>
                  </div>
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

export type { ArticuloType };
