import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import Modelo3D from "./Modelo3D";
import DetallesParte from "./DetallesParte";
import { type ParteInfo } from "../types/ParteInfo";
import styles from "./ModeloHumano.module.css";

export default function ModeloHumano() {
  const [selectedPart, setSelectedPart] = useState<boolean>(false);
  const [partInfo, setPartInfo] = useState<ParteInfo | null>(null);

  const handlePartClick = async (partName: string) => {
    console.log("Clicked:", partName);

    try {
      const response = await fetch("http://localhost:3000/api/parte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parte: partName }),
      });
      const data = await response.json();

      setPartInfo(data);
      setSelectedPart(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    setSelectedPart(false);
    setPartInfo(null);
  };

  return (
    <>
      {selectedPart && partInfo && (
        <DetallesParte partInfo={partInfo} onBack={handleBack} />
      )}

      <div
        className={`${styles.mainContainer} ${
          selectedPart ? styles.hidden : styles.visible
        }`}
      >
        <div className={styles.canvasWrapper}>
          <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
            <ambientLight intensity={1.8} />
            <pointLight position={[10, 10, 10]} />

            <Suspense fallback={null}>
              <Modelo3D onPartClick={handlePartClick} />
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
      </div>
    </>
  );
}
