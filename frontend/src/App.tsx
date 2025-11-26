import Navbar from "./components/Navbar";
import ModeloHumano from "./components/ModeloHumano";
import Creditos from "./components/creditos";
import AcercaDe from "./components/AcercaDe";
import Login from "./components/Login"; 
import { useAuth } from "./context/AuthContext";
import { useRef, useState } from "react";

interface ModeloHumanoHandles {
  handleParteClick: (partName: string) => void;
}

function App() {
  const { isAuthenticated } = useAuth();
  const modeloHumanoRef = useRef<ModeloHumanoHandles>(null);
  const [mostrarCreditos, setMostrarCreditos] = useState(false);
  const [mostrarAcercaDe, setMostrarAcercaDe] = useState(false);

  const handleInicioClick = () => {
    window.location.reload();
  };

  const handleParteCuerpoSelect = (parte: string) => {
    console.log(`Parte seleccionada desde navbar: ${parte}`);
    if (modeloHumanoRef.current) {
      modeloHumanoRef.current.handleParteClick(parte);
    }
    setMostrarCreditos(false);
    setMostrarAcercaDe(false);
  };

  const handleCreditosClick = () => {
    setMostrarCreditos(true);
    setMostrarAcercaDe(false);
  };

  const handleAcercaDeClick = () => {
    setMostrarAcercaDe(true);
    setMostrarCreditos(false);
  };

  const handleVolver = () => {
    setMostrarCreditos(false);
    setMostrarAcercaDe(false);
  };

  if (isAuthenticated) {
    return <Login />;
  }

  // Mostrar Acerca de si está activo
  if (mostrarAcercaDe) {
    return (
      <>
        <Navbar 
          onInicioClick={handleInicioClick} 
          onParteCuerpoSelect={handleParteCuerpoSelect}
          onCreditosClick={handleCreditosClick}
          onAcercaDeClick={handleAcercaDeClick}
        />
        <AcercaDe onVolver={handleVolver} />
      </>
    );
  }

  // Mostrar créditos si está activo
  if (mostrarCreditos) {
    return (
      <>
        <Navbar 
          onInicioClick={handleInicioClick} 
          onParteCuerpoSelect={handleParteCuerpoSelect}
          onCreditosClick={handleCreditosClick}
          onAcercaDeClick={handleAcercaDeClick}
        />
        <Creditos onVolver={handleVolver} />
      </>
    );
  }

  return (
    <>
      <Navbar 
        onInicioClick={handleInicioClick} 
        onParteCuerpoSelect={handleParteCuerpoSelect}
        onCreditosClick={handleCreditosClick}
        onAcercaDeClick={handleAcercaDeClick}
      />
      <ModeloHumano ref={modeloHumanoRef} />
    </>
  );
}

export default App;