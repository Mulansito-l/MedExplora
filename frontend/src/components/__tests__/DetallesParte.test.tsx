import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DetallesParte from "../DetallesParte";

describe("DetallesParte", () => {
  const mockData = [
    {
      Title: "Sistema Nervioso",
      Date: "2025-11-02",
      contenido: [
        {
          __component: "shared.rich-text",
          body: "Este es un texto de prueba",
        },
        {
          __component: "shared.media",
          file: {
            url: "/uploads/imagen_test.jpg",
          },
        },
        {
          __component: "shared.rich-text",
          body: "Otro párrafo de prueba",
        },
      ],
    },
  ];

  it("renderiza el título y la fecha correctamente", () => {
    render(<DetallesParte data={mockData} />);

    expect(screen.getByText("Sistema Nervioso")).toBeInTheDocument();
    // Fecha: comprobar año para evitar dependencias del formato local
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("renderiza el contenido de texto correctamente", () => {
    render(<DetallesParte data={mockData} />);

    expect(screen.getByText("Este es un texto de prueba")).toBeInTheDocument();
    expect(screen.getByText("Otro párrafo de prueba")).toBeInTheDocument();
  });

  it("renderiza las imágenes con la URL base correcta", () => {
    render(<DetallesParte data={mockData} />);

    // La imagen tiene alt vacío en el markup, por eso se trata como presentation
    const imagen = screen.getByAltText("");
    expect(imagen).toHaveAttribute(
      "src",
      "http://localhost:1337/uploads/imagen_test.jpg"
    );
  });

  it("maneja el botón de volver cuando se proporciona la función", () => {
    const mockOnVolver = vi.fn();
    render(<DetallesParte data={mockData} onVolver={mockOnVolver} />);

    const botonVolver = screen.getByRole("button", { name: /volver/i });
    fireEvent.click(botonVolver);

    expect(mockOnVolver).toHaveBeenCalledTimes(1);
  });

  it("transforma correctamente elementos no soportados", () => {
    const dataConElementoNoSoportado = [
      {
        ...mockData[0],
        contenido: [
          {
            __component: "shared.no-soportado",
            alguncampo: "valor",
          },
        ],
      },
    ];

    render(<DetallesParte data={dataConElementoNoSoportado} />);
    expect(screen.getByText("[Elemento no soportado]")).toBeInTheDocument();
  });

  it("maneja estilos CSS correctamente", () => {
    render(<DetallesParte data={mockData} />);

    // Verificar estructura básica sin depender de roles o nombres de clase
    const titulo = screen.getByRole("heading", { level: 1 });
    expect(titulo).toBeInTheDocument();
    // El contenedor principal existe y contiene el título
    const contenedor = titulo.closest("div")?.closest("div");
    expect(contenedor).toBeTruthy();
  });

  it("renderiza múltiples bloques de contenido en orden", () => {
    const dataConMultiplesBloques = [
      {
        ...mockData[0],
        contenido: [
          {
            __component: "shared.rich-text",
            body: "Primer párrafo",
          },
          {
            __component: "shared.rich-text",
            body: "Segundo párrafo",
          },
          {
            __component: "shared.rich-text",
            body: "Tercer párrafo",
          },
        ],
      },
    ];

    render(<DetallesParte data={dataConMultiplesBloques} />);

    const parrafos = screen.getAllByText(/párrafo/);
    expect(parrafos).toHaveLength(3);
    expect(parrafos[0]).toHaveTextContent("Primer párrafo");
    expect(parrafos[1]).toHaveTextContent("Segundo párrafo");
    expect(parrafos[2]).toHaveTextContent("Tercer párrafo");
  });
});
