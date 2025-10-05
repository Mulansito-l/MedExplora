import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import Modelo3D from "./Modelo3D";
import DetallesParte from "./DetallesParte";
import type { ArticuloType } from "./DetallesParte";
import styles from "./ModeloHumano.module.css";

export default function ModeloHumano() {
  const [articulo, setArticulo] = useState<ArticuloType | null>(null);

  const handleClick = async (partName: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/${partName}`);
      if (!response.ok) throw new Error("Error en el servidor");
      const data: ArticuloType = await response.json();
      setArticulo(data);
    } catch (err) {
      console.error("Error fetching artículo:", err);
    }
  };

  return (
    <>
      {articulo && (
        <DetallesParte data={articulo} onVolver={() => setArticulo(null)} />
      )}

      <div
        className={`${styles.canvasContainer} ${
          articulo ? styles.hidden : styles.visible
        }`}
      >
        <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
          <ambientLight intensity={1.8} />
          <pointLight position={[10, 10, 10]} />

          <Suspense fallback={null}>
            <Modelo3D onParteClick={handleClick} />
          </Suspense>

          <OrbitControls
            target={[0, 1, 0]}
            enablePan={false}
            minDistance={2.5}
            maxDistance={3}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>
    </>
  );
}
