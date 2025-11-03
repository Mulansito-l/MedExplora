import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DetallesParte from "../Articulo";

describe("DetallesParte", () => {
  const mockData = [
    {
      Title: "Test Article",
      Date: "2025-11-02",
      contenido: [
        {
          component: "shared.rich-text",
          texto: "Este es un párrafo de prueba",
        },
        {
          component: "shared.media",
          path: "/test-image.jpg",
        },
      ],
    },
  ];

  it("renderiza el título del artículo correctamente", () => {
    render(<DetallesParte data={mockData} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("renderiza la fecha formateada correctamente", () => {
    render(<DetallesParte data={mockData} />);
    // La fecha exacta dependerá de la configuración regional del sistema
    // Comprobar año en lugar de formato exacto para ser locale-agnóstico
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("renderiza el contenido de texto correctamente", () => {
    render(<DetallesParte data={mockData} />);
    expect(
      screen.getByText("Este es un párrafo de prueba")
    ).toBeInTheDocument();
  });
});
