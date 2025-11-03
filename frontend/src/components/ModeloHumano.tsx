import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import Modelo3D from "./Modelo3D";
import DetallesParte from "./DetallesParte";
import MobileDebugPanel from "./MobileDebugPanel";
import type { ArticuloType } from "./DetallesParte";
import styles from "./ModeloHumano.module.css";

export default function ModeloHumano() {
  const [articulo, setArticulo] = useState<ArticuloType | null>(null);
  const controlsRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = async (partName: string) => {
    try {
      console.log("Parte seleccionada:", partName);

      const partToIdMap: Record<string, number> = {
        Cabeza: 2,
        Brazos: 8,
        Torso: 4,
        Piernas: 6,
        Pies: 10,
      };

      const id = partToIdMap[partName];

      if (!id) {
        console.warn(`No hay artículo asociado a la parte: ${partName}`);
        return;
      }

      const response = await fetch(
        `http://localhost:1337/api/articulos?filters[id][$eq]=${id}&populate[contenido][populate]=*`
      );

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      setArticulo(data.data);

      console.log("Respuesta completa del servidor:", data);
    } catch (err) {
      console.error("Error fetching artículo:", err);
    }
  };

  return (
    <>
      <MobileDebugPanel />
      {articulo && (
        <DetallesParte data={articulo} onVolver={() => setArticulo(null)} />
      )}

      <div
        className={`${styles.wrapper} ${
          articulo ? styles.hidden : styles.visible
        }`}
      >
        <h1 className={styles.titulo}>MedExplora UABC</h1>

        <div className={styles.canvasContainer}>
          <Canvas
            camera={{ position: [0, 0, 1], fov: 50 }}
            onPointerMissed={() => console.log("Click fuera del modelo")}
          >
            <ambientLight intensity={10} />
            <pointLight position={[10, 10, 10]} />

            <Suspense fallback={null}>
              <Modelo3D onParteClick={handleClick} />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              target={[0, 1, 0]}
              enablePan={false}
              minDistance={2.5}
              maxDistance={3}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI / 4}
              onStart={() => {
                console.log("Inicio de rotación");
                setIsDragging(true);
              }}
              onEnd={() => {
                console.log("Fin de rotación");
                setTimeout(() => {
                  setIsDragging(false);
                  console.log("Listo para clicks");
                }, 100);
              }}
            />
          </Canvas>
        </div>
      </div>
    </>
  );
}