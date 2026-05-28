import { useEffect, useState } from "react";
import { supabase, type GaleriaItem } from "@/lib/supabase";

export function Galeria() {
  const [itens, setItens] = useState<GaleriaItem[]>([]);

  useEffect(() => {
    supabase
      .from("galeria")
      .select("*")
      .order("ordem")
      .then(({ data }) => data && setItens(data));
  }, []);

  if (itens.length === 0) {
    return (
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="display mb-2 text-3xl text-verde md:text-4xl">ENTREGA DE PRÊMIOS</h2>
          <p className="text-sm text-muted-foreground">Em breve, as fotos dos ganhadores aparecem aqui.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="display mb-6 text-center text-3xl text-verde md:text-4xl">ENTREGA DE PRÊMIOS</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {itens.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-xl shadow-sm">
              <img src={g.foto_url} alt={g.titulo ?? ""} className="aspect-square w-full object-cover transition hover:scale-105" loading="lazy" />
              {g.titulo && <div className="bg-white p-2 text-center text-xs font-medium">{g.titulo}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
