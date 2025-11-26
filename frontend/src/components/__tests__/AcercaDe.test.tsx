import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AcercaDe from "../AcercaDe";

describe("AcercaDe", () => {
  it("renderiza el título principal correctamente", () => {
    render(<AcercaDe />);
    expect(screen.getByText("Acerca de")).toBeInTheDocument();
  });

  it("muestra la información de la UABC", () => {
    render(<AcercaDe />);
    expect(
      screen.getByText("Universidad Autonoma de Baja California")
    ).toBeInTheDocument();
  });

  it("muestra la información de la Facultad", () => {
    render(<AcercaDe />);
    expect(
      screen.getByText("Facultad de Medicina y Nutricion")
    ).toBeInTheDocument();
  });

  it("muestra el enlace al sitio web de la facultad", () => {
    render(<AcercaDe />);

    const link = screen.getByRole("link", {
      name: "https://fmed.mxl.uabc.mx/",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://fmed.mxl.uabc.mx/");
  });

  it("muestra el botón de volver cuando se pasa onVolver", () => {
    const mockFn = vi.fn();

    render(<AcercaDe onVolver={mockFn} />);

    const boton = screen.getByRole("button", { name: "← Volver al modelo" });

    expect(boton).toBeInTheDocument();

    fireEvent.click(boton);

    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("no muestra el botón de volver si no se pasa onVolver", () => {
    render(<AcercaDe />);

    const boton = screen.queryByRole("button", { name: "← Volver al modelo" });

    expect(boton).toBeNull();
  });
});
