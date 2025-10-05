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
  data: ArticuloType;
  onVolver?: () => void;
}

export default function DetallesParte({ data, onVolver }: DetallesParteProps) {
  return (
    <div className={styles.articuloFull}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>{data.titulo}</h1>
          <p className={styles.fecha}>
            {new Date(data.fechaPublicacion).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className={styles.cuerpo}>
          {data.contenido.map((bloque, index) => {
            switch (bloque.tipo) {
              case "p":
                return (
                  <p key={index} className={styles.parrafo}>
                    {bloque.texto || bloque.path}
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
