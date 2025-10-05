import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import DetallesParte from "./DetallesParte.tsx"
import type { ArticuloType } from "./DetallesParte.tsx";
import type { ThreeEvent } from "@react-three/fiber";

type ModeloProps = {
  onParteClick: (partName: string) => void;
};

function Modelo({ onParteClick }: ModeloProps) {
  const { scene } = useGLTF("/source/CuerpoDescuartizado.glb");
  const [hoveredMesh, setHoveredMesh] = useState<Mesh | null>(null);

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
        const intersected = e.intersections[0]?.object;
        if (intersected instanceof Mesh) {
          const material = intersected.material as MeshStandardMaterial;
          if (material.emissive) {
            if (hoveredMesh && hoveredMesh !== intersected) {
              const prevMaterial = hoveredMesh.material as MeshStandardMaterial;
              prevMaterial.emissive.setHex(
                hoveredMesh.userData.originalEmissive || 0x000000
              );
            }
            material.emissive.set(0x555555);
            setHoveredMesh(intersected);
          }
        }
      }}
      onPointerOut={() => {
        if (hoveredMesh) {
          const material = hoveredMesh.material as MeshStandardMaterial;
          if (material.emissive) {
            material.emissive.setHex(hoveredMesh.userData.originalEmissive || 0x000000);
          }
          setHoveredMesh(null);
        }
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const intersected = e.intersections[0]?.object;
        if (intersected instanceof Mesh) {
          onParteClick(intersected.name);
        }
      }}
    />
  );
}

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

  if (articulo) {
    return <DetallesParte data={articulo} onVolver={() => setArticulo(null)} />;
  }

  return (
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
          <Modelo onParteClick={handleClick}/>
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
  );
}

