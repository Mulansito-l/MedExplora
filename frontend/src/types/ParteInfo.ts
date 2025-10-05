// src/types/ParteInfo.ts (nuevo archivo)
export interface SeccionInfo {
  subtitulo: string;
  contenido: string;
}

export interface ParteInfo {
  titulo: string;
  descripcion: string;
  secciones: SeccionInfo[];
  datos: string[];
  imagenUrl?: string;
}
