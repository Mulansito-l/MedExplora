// typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Modelo3D from "../Modelo3D";
import { Mesh, MeshStandardMaterial, Color } from "three";

let sceneForMock: any = null;

vi.mock("@react-three/drei", () => {
  return {
    useGLTF: () => {
      return sceneForMock;
    },
  };
});

function makeMesh(name: string, emissiveHex = 0x000000) {
  const material = new MeshStandardMaterial();
  // ensure emissive Color exists and set its hex
  if ((material as any).emissive) {
    (material as any).emissive = new Color(emissiveHex);
  }
  const mesh = new Mesh(undefined as any, material);
  mesh.name = name;
  mesh.userData = {};
  return mesh;
}

describe("Modelo3D", () => {
  let meshA: Mesh;
  let meshB: Mesh;

  beforeEach(() => {
    meshA = makeMesh("ParteA", 0x101010);
    meshB = makeMesh("ParteB", 0x202020);

    const fakeScene = {
      traverse: (cb: (child: any) => void) => {
        cb(meshA);
        cb(meshB);
      },
    };

    // useGLTF mock returns an object with scene property
    sceneForMock = { scene: fakeScene };
  });

  it("renderiza un primitive por cada mesh en la escena", () => {
    const mockOnParteClick = vi.fn();
    const { container } = render(<Modelo3D onParteClick={mockOnParteClick} />);

    const primitives = container.querySelectorAll("primitive");
    expect(primitives.length).toBe(2);
  });

  it("llama onParteClick con el nombre del mesh al hacer click", () => {
    const mockOnParteClick = vi.fn();
    const { container } = render(<Modelo3D onParteClick={mockOnParteClick} />);

    const primitives = container.querySelectorAll("primitive");
    expect(primitives.length).toBe(2);

    // click en el primer primitive
    fireEvent.click(primitives[0]);

    expect(mockOnParteClick).toHaveBeenCalledTimes(1);
    expect(mockOnParteClick).toHaveBeenCalledWith("ParteA");
  });

  it("cambia el emissive del material al hacer pointerOver y lo restaura en pointerOut", () => {
    const mockOnParteClick = vi.fn();
    const { container } = render(<Modelo3D onParteClick={mockOnParteClick} />);

    const primitives = container.querySelectorAll("primitive");
    expect(primitives.length).toBe(2);

    // asegurarse estado inicial
    const initialHex = (
      meshA.material as MeshStandardMaterial
    ).emissive.getHex();
    expect(initialHex).toBe(0x101010);

    // pointerOver -> debe setear a 0x555555
    fireEvent.pointerOver(primitives[0]);
    const hoveredHex = (
      meshA.material as MeshStandardMaterial
    ).emissive.getHex();
    expect(hoveredHex).toBe(0x555555);

    // pointerOut -> debe restaurar al original
    fireEvent.pointerOut(primitives[0]);
    const afterOutHex = (
      meshA.material as MeshStandardMaterial
    ).emissive.getHex();
    expect(afterOutHex).toBe(0x101010);
  });
});
