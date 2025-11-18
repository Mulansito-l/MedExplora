export async function fetchArticuloById(id: number) {
  // Usar populate=deep para incluir referencias anidadas (sub-artículos, media, etc.)
  const url = `http://localhost:1337/api/articulos?filters[id][$eq]=${id}&populate=deep(3)`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error en el servidor");
  const data = await response.json();
  return data;
}
