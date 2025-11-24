import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Creditos from "../creditos";

describe("Creditos", () => {

  it("renderiza el título principal correctamente", () => {
    render(<Creditos />);
    expect(screen.getByText("Créditos")).toBeInTheDocument();
  });

  it("muestra la etiqueta de MedExplora UABC", () => {
    render(<Creditos />);
    expect(screen.getByText("MedExplora UABC")).toBeInTheDocument();
  });

  it("muestra la sección de desarrolladores y sus nombres", () => {
    render(<Creditos />);

    expect(screen.getByText("Desarrolladores")).toBeInTheDocument();
    expect(screen.getByText("Diego Castañeda Covarrubias")).toBeInTheDocument();
    expect(screen.getByText("Herick Gerardo Vizcarra Macias")).toBeInTheDocument();
    expect(screen.getByText("Ana Belem Angeles Valenzuela")).toBeInTheDocument();
    expect(screen.getByText("Luis Amado Lopez Lopez")).toBeInTheDocument();
    expect(screen.getByText("Jose Raul Delgadillo Herrera")).toBeInTheDocument();
  });

  it("muestra la sección de Facultad de Ingeniería", () => {
    render(<Creditos />);
    expect(screen.getByText("Facultad de Ingeniería Mexicali")).toBeInTheDocument();
    expect(screen.getByText("Ingeniería en Computación")).toBeInTheDocument();
  });

  it("incluye el enlace al sitio web de Ingeniería UABC", () => {
    render(<Creditos />);

    const link = screen.getByRole("link", { name: "https://ingenieria.mxl.uabc.mx/pe_ico/" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://ingenieria.mxl.uabc.mx/pe_ico/");
  });

  it("muestra la sección de tecnologías utilizadas", () => {
    render(<Creditos />);

    expect(screen.getByText("Tecnologias Utilizadas")).toBeInTheDocument();
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Three.js / React Three Fiber")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Strapi CMS")).toBeInTheDocument();
    expect(screen.getByText("CSS Modules")).toBeInTheDocument();
  });

  it("muestra el botón de volver cuando se pasa onVolver", () => {
    const mockFn = vi.fn();

    render(<Creditos onVolver={mockFn} />);

    const boton = screen.getByRole("button", { name: "← Volver al modelo" });

    expect(boton).toBeInTheDocument();

    fireEvent.click(boton);

    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("no muestra el botón de volver si no se pasa onVolver", () => {
    render(<Creditos />);

    const boton = screen.queryByRole("button", { name: "← Volver al modelo" });

    expect(boton).toBeNull();
  });

});
