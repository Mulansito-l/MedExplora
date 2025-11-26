import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModeloHumano from "../ModeloHumano";
import * as articuloService from "../../services/articulo";

vi.mock("../../services/articulo", () => ({
  fetchArticuloById: vi.fn(),
}));

// Mock de los componentes de Three.js
vi.mock("@react-three/fiber", async () => {
  const actual = await vi.importActual("@react-three/fiber");
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => {
      // Render only children that expose a data-testid to avoid
      // rendering Three.js primitives like <ambientLight /> which
      // produce casing warnings in the DOM renderer.
      const nodes = React.Children.toArray(children as any).filter((c: any) => {
        return c && c.props && c.props["data-testid"];
      });
      return <div data-testid="mock-canvas">{nodes}</div>;
    },
  };
});

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
}));

vi.mock("../Modelo3D", () => ({
  default: ({ onParteClick }: { onParteClick: (partName: string) => void }) => (
    <div data-testid="mock-modelo3d">
      <button onClick={() => onParteClick && onParteClick("Cabeza")}>
        Click Cabeza
      </button>
      <button onClick={() => onParteClick && onParteClick("Brazos")}>
        Click Brazos
      </button>
    </div>
  ),
}));

describe("ModeloHumano", () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
  });

  it("renderiza el componente correctamente", () => {
    render(<ModeloHumano />);
    expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("mock-orbit-controls")).toBeInTheDocument();
    expect(screen.getByTestId("mock-modelo3d")).toBeInTheDocument();
  });

  it("maneja el clic en una parte del modelo correctamente", async () => {
    // Mock de la respuesta de la API
    const mockArticulo = {
      data: [
        {
          id: 2,
          attributes: {
            Title: "Cabeza",
            Date: "2025-11-02",
            contenido: [],
          },
        },
      ],
    };

    (articuloService.fetchArticuloById as any).mockResolvedValueOnce(
      mockArticulo
    );

    render(<ModeloHumano />);

    // Simular clic en la cabeza
    fireEvent.click(screen.getByText("Click Cabeza"));

    // Verificar que se llamó al helper con el id correcto
    await waitFor(() => {
      expect(articuloService.fetchArticuloById).toHaveBeenCalledWith(2);
    });
  });

  it("maneja errores de la API correctamente", async () => {
    // Mock de console.error para evitar logs en los tests
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock del helper para simular un error
    (articuloService.fetchArticuloById as any).mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<ModeloHumano />);

    // Simular clic en la cabeza
    fireEvent.click(screen.getByText("Click Cabeza"));

    // Verificar que se manejó el error correctamente
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "💥 Error fetching artículo:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("maneja partes del modelo sin ID asociado", async () => {
    // Mock de console.warn para verificar la advertencia
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<ModeloHumano />);

    // Simular clic en una parte que no existe en el mapa
    fireEvent.click(screen.getByText("Click Brazos"));

    // Verificar que se mostró la advertencia correcta
    expect(consoleSpy).toHaveBeenCalledWith(
      "No hay artículo asociado a la parte: Brazos"
    );

    consoleSpy.mockRestore();
  });
});
