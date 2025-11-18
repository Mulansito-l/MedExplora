// components/AcercaDe.tsx
import styles from "./DetallesParte.module.css";

interface AcercaDeProps {
  onVolver?: () => void;
}

export default function AcercaDe({ onVolver }: AcercaDeProps) {
  return (
    <div className={styles.articuloFull}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Acerca de</h1>
          <p className={styles.fecha}>MedExplora UABC</p>
        </div>

        <div className={styles.cuerpo}>
          <div className={styles.parrafo}>
            <h2>Universidad Autonoma de Baja California</h2>
            <p>
              La Universidad Autonoma de Baja California es una institucion publica de educacion 
              superior comprometida con la excelencia academica y la formacion integral de profesionales.
            </p>
            
            <h2>Facultad de Medicina y Nutricion</h2>
            <p>
              La Facultad de Medicina y Nutricion de la UABC se dedica a la formacion de medicos 
              y nutriologos de alto nivel, con un enfoque en la investigacion y atencion a la salud 
              de la comunidad.
            </p>
            
            <p>
              <strong>Sitio web:</strong>{' '}
              <a 
                href="https://fmed.mxl.uabc.mx/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#52c234', textDecoration: 'none' }}
              >
                https://fmed.mxl.uabc.mx/
              </a>
            </p>
            
            <h2>Proyecto MedExplora</h2>
            <p>
              MedExplora es una plataforma educativa desarrollada para ayudar a medicos y estudiantes 
              de medicina a recordar y practicar tecnicas de exploracion en pacientes.
            </p>

          </div>
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