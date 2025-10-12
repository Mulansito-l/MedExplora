import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import type { ThreeEvent } from "@react-three/fiber";

interface Modelo3DProps {
  onParteClick: (partName: string) => void;
}

export default function Modelo3D({ onParteClick }: Modelo3DProps) {
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
            material.emissive.setHex(
              hoveredMesh.userData.originalEmissive || 0x000000
            );
          }
          setHoveredMesh(null);
        }
      }}
      onClick={(e: ThreeEvent<PointerEvent>) => {
        const intersected = e.intersections[0]?.object;
        if (intersected instanceof Mesh) {
          onParteClick(intersected.name);
        }
      }}
    />
  );
}
