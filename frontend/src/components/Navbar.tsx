import styles from "./Navbar.module.css";
import { FaSearch } from "react-icons/fa";
import { useState, useRef } from "react";

interface NavbarProps {
  onInicioClick: () => void;
  onParteCuerpoSelect: (parte: string) => void;
  onCreditosClick: () => void;
  onAcercaDeClick: () => void;
}

export default function Navbar({ onInicioClick, onParteCuerpoSelect, onCreditosClick, onAcercaDeClick }: NavbarProps) {
  const [showSistemas, setShowSistemas] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const partesCuerpo = ["Cabeza", "Brazos", "Torso", "Piernas", "Pies"];

  const handleParteClick = (parte: string) => {
    onParteCuerpoSelect(parte);
    setShowSistemas(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img src="recursos/escudoUABC.png" alt="Logo UABC" className={styles.logo} />
      </div>

      <ul className={styles.center}>
        <li onClick={onInicioClick}>Inicio</li>
        
        {/* Sistemas con submenú */}
        <li 
          onMouseEnter={() => setShowSistemas(true)}
          style={{ position: 'relative' }}
        >
          Sistemas
          {showSistemas && (
            <div 
              ref={menuRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '10px',
                zIndex: 1000,
                marginTop: '5px',
                minWidth: '120px'
              }}
              onMouseEnter={() => setShowSistemas(true)}
              onMouseLeave={() => setShowSistemas(false)}
            >
              {partesCuerpo.map((parte, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    fontWeight: 600,
                    color: '#333'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#52c234';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                  }}
                  onClick={() => handleParteClick(parte)}
                >
                  {parte}
                </div>
              ))}
            </div>
          )}
        </li>
        
        <li onClick={onAcercaDeClick}>Acerca de</li> {/* Agregado onClick */}
        <li onClick={onCreditosClick}>Créditos</li>
      </ul>

      <div className={styles.right}>
        <FaSearch className={styles.icon} />
      </div>
    </nav>
  );
}