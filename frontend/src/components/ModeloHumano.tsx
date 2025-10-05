import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { Mesh } from "three";
import { MeshStandardMaterial } from "three";
import { useState } from "react";
import { useEffect } from "react";

import type { ThreeEvent } from "@react-three/fiber";

function Modelo() {
  const { scene } = useGLTF("/source/CuerpoDescuartizado.glb");
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [hoveredMesh, setHoveredMesh] = useState<Mesh | null>(null);

  const handleClick = async (partName: string) => {
    console.log("Clicked:", partName);

    // Llamada al backend
    const response = await fetch("http://localhost:3000/api/parte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parte: partName }),
    });
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial;
        if (material.emissive) {
          child.userData.originalEmissive = material.emissive.getHex();
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        const intersectedObject = e.intersections[0]?.object;

        if (intersectedObject instanceof Mesh) {
          const material = intersectedObject.material as MeshStandardMaterial;
          if (material.emissive) {
            // Limpiar el anterior
            if (hoveredMesh && hoveredMesh !== intersectedObject) {
              const prevMaterial = hoveredMesh.material as MeshStandardMaterial;
              prevMaterial.emissive.setHex(
                hoveredMesh.userData.originalEmissive || 0x000000
              );
            }

            // Iluminar el nuevo
            material.emissive.set(0x555555);
            setHoveredMesh(intersectedObject);
            setHoveredPart(intersectedObject.name);
          }
        }
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        if (hoveredMesh) {
          const material = hoveredMesh.material as MeshStandardMaterial;
          if (material.emissive) {
            material.emissive.setHex(
              hoveredMesh.userData.originalEmissive || 0x000000
            );
          }
          setHoveredMesh(null);
          setHoveredPart(null);
        }
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const intersectedObject = e.intersections[0]?.object;
        if (intersectedObject instanceof Mesh) {
          handleClick(intersectedObject.name);
        }
      }}
    />
  );
}

export default function ModeloHumano() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          width: "700px",
          height: "700px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
          <ambientLight intensity={1.8} />
          <pointLight position={[10, 10, 10]} />

          <Suspense fallback={null}>
            <Modelo />
          </Suspense>

          <OrbitControls
            target={[0, 1, 0]} // Centrar en el modelo
            enablePan={false} // Desactivar paneo
            minDistance={2.5} // Limitar zoom
            maxDistance={3} // Limitar zoom
            minPolarAngle={Math.PI / 2.5} // 45 grados arriba
            maxPolarAngle={Math.PI / 4} // Limite abajo
          />
        </Canvas>
      </div>
    </div>
  );
}
