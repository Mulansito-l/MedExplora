// App.jsx
/*import ModeloHumano from "./components/ModeloHumano";

function App() {
  return <ModeloHumano />;
}
export default App;*/
import ModeloHumano from "./components/ModeloHumano";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <ModeloHumano />
    </>
  );
}

export default App;