import styles from "./Navbar.module.css";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img src="recursos/escudoUABC.png" alt="Logo UABC" className={styles.logo} />
      </div>

      <ul className={styles.center}>
        <li>Inicio</li>
        <li>Sistemas</li>
        <li>Acerca de</li>
        <li>Créditos</li>
      </ul>

      <div className={styles.right}>
        <FaSearch className={styles.icon} />
      </div>
    </nav>
  );
}