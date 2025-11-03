export async function fetchArticuloById(id: number) {
  const url = `http://localhost:1337/api/articulos?filters[id][$eq]=${id}&populate[contenido][populate]=*`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error en el servidor");
  const data = await response.json();
  return data;
}
