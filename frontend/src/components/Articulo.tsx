interface BloqueContenido {
  tipo: "p" | "img" | "l";
  texto?: string;
  path?: string;
  elementos?: string[];
}

export interface ArticuloData {
  titulo: string;
  fechaPublicacion: string; // o Date
  contenido: BloqueContenido[];
}

interface ArticuloProps {
  data: ArticuloData;
}

export default function DetallesParte({ data }: ArticuloProps) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>{data.titulo}</h1>
      <p>
        <em>{new Date(data.fechaPublicacion).toLocaleDateString()}</em>
      </p>

      {data.contenido.map((bloque, index) => {
        switch (bloque.tipo) {
          case "p":
            return <p key={index}>{bloque.texto}</p>;

          case "img":
            return <img key={index} src={bloque.path} alt="" style={{ maxWidth: "100%" }} />;

          case "l":
            return (
              <ul key={index}>
                {bloque.elementos?.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}