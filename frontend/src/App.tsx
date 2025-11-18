import Navbar from "./components/Navbar";
import ModeloHumano from "./components/ModeloHumano";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      <ModeloHumano />
    </>
  );
}

export default App;
