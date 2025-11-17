import GoogleLoginButton from "../components/GoogleLoginButton";
import styles from "./Login.module.css";

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        
        <img src="recursos/escudoUABC.png" alt="Escudo UABC" className={styles.logo} />

        <h1>MedExplora UABC</h1>
        <p>Inicia sesión con tu correo institucional</p>

        <div className={styles.googleButtonWrapper}>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
