import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import type { ThreeEvent } from "@react-three/fiber";

interface Modelo3DProps {
  onParteClick: (partName: string) => void;
}

export default function Modelo3D({ onParteClick }: Modelo3DProps) {
  const { scene } = useGLTF("/source/CuerpoDescuartizado.glb");
  const [clickableMeshes, setClickableMeshes] = useState<Mesh[]>([]);
  const [hoveredMesh, setHoveredMesh] = useState<Mesh | null>(null);

  useEffect(() => {
    const meshes: Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof Mesh) {
        meshes.push(child);
        const material = child.material as MeshStandardMaterial;
        if (material.emissive) {
          child.userData.originalEmissive = material.emissive.getHex();
        }
        console.log("🔍 Mesh:", child.name || "SIN NOMBRE");
      }
    });

    console.log("📊 Total meshes clickeables:", meshes.length);
    setClickableMeshes(meshes);
  }, [scene]);

  const handleMeshClick = (e: ThreeEvent<PointerEvent>, mesh: Mesh) => {
    e.stopPropagation();
    console.log("🎯 Click en mesh:", mesh.name);

    if (mesh.name) {
      console.log("✅ Llamando onParteClick:", mesh.name, "success");
      onParteClick(mesh.name);
    } else {
      console.error("❌ Mesh sin nombre");
    }
  };

  return (
    <group>
      {clickableMeshes.map((mesh, index) => (
        <primitive
          key={index}
          object={mesh}
          onClick={(e: ThreeEvent<PointerEvent>) => handleMeshClick(e, mesh)}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            console.log("🖱️ Hover en:", mesh.name);
            const material = mesh.material as MeshStandardMaterial;
            if (material.emissive) {
              if (hoveredMesh && hoveredMesh !== mesh) {
                const prevMaterial =
                  hoveredMesh.material as MeshStandardMaterial;
                prevMaterial.emissive.setHex(
                  hoveredMesh.userData.originalEmissive || 0x000000
                );
              }
              material.emissive.set(0x555555);
              setHoveredMesh(mesh);
            }
          }}
          onPointerOut={() => {
            if (hoveredMesh === mesh) {
              const material = mesh.material as MeshStandardMaterial;
              if (material.emissive) {
                material.emissive.setHex(
                  mesh.userData.originalEmissive || 0x000000
                );
              }
              setHoveredMesh(null);
            }
          }}
        />
      ))}
    </group>
  );
}
