import { type ParteInfo } from "../types/ParteInfo";
import styles from "./DetallesParte.module.css";

interface DetallesParteProps {
  partInfo: ParteInfo;
  onBack: () => void;
}

export default function DetallesParte({
  partInfo,
  onBack,
}: DetallesParteProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={onBack} className={styles.backButton}>
          ← Volver al modelo
        </button>

        <h1 className={styles.title}>{partInfo.titulo}</h1>

        {partInfo.imagenUrl && (
          <img
            src={partInfo.imagenUrl}
            alt={partInfo.titulo}
            className={styles.image}
          />
        )}

        <p className={styles.description}>{partInfo.descripcion}</p>

        {partInfo.secciones.map((seccion, index) => (
          <div key={index} className={styles.section}>
            <h3 className={styles.subtitle}>{seccion.subtitulo}</h3>
            <p className={styles.content}>{seccion.contenido}</p>
          </div>
        ))}

        {partInfo.datos.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.subtitle}>Datos interesantes</h3>
            <ul className={styles.dataList}>
              {partInfo.datos.map((dato, index) => (
                <li key={index}>{dato}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
