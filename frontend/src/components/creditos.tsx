// components/Creditos.tsx
import styles from "./DetallesParte.module.css";

interface CreditosProps {
  onVolver?: () => void;
}

export default function Creditos({ onVolver }: CreditosProps) {
  return (
    <div className={styles.articuloFull}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Créditos</h1>
          <p className={styles.fecha}>MedExplora UABC</p>
        </div>

        <div className={styles.cuerpo}>
          <div className={styles.parrafo}>
            <h2>Desarrolladores</h2>
            <ul className={styles.lista}>
              <li>Diego Castañeda Covarrubias</li>
              <li>Herick Gerardo Vizcarra Macias</li>
              <li>Ana Belem Angeles Valenzuela</li>
              <li>Luis Amado Lopez Lopez</li>
              <li>Jose Raul Delgadillo Herrera</li>
            </ul>
            
            <h2>Facultad de Ingeniería Mexicali</h2>
            <p>
              Ingeniería en Computación
            </p>
            <p>
              <strong>Sitio web:</strong>{' '}
              <a 
                href="https://ingenieria.mxl.uabc.mx/pe_ico/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#52c234', textDecoration: 'none' }}
              >
                https://ingenieria.mxl.uabc.mx/pe_ico/
              </a>
            </p>
            
            <h2>Proyecto</h2>
            <p>MedExplora - Plataforma educativa para tecnicas de exploracion medica</p>
            
            <h2>Tecnologias Utilizadas</h2>
            <ul className={styles.lista}>
              <li>React.js</li>
              <li>Three.js / React Three Fiber</li>
              <li>TypeScript</li>
              <li>Strapi CMS</li>
              <li>CSS Modules</li>
            </ul>
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