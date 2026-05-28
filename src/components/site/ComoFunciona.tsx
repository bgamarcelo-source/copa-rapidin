import { MapPin, Target, BarChart3, Gift } from "lucide-react";

const passos = [
  { icon: MapPin, titulo: "Encontre o estande", desc: "Festa de Santo Antônio toda noite ou FanFest nos dias de jogo do Brasil — Praça da Matriz, Balsas." },
  { icon: Target, titulo: "Chute a gol", desc: "Cada chute certeiro vira pontos. Quanto mais, melhor sua colocação." },
  { icon: BarChart3, titulo: "Acompanhe aqui", desc: "Veja o ranking ao vivo nesta página e na nossa rede." },
  { icon: Gift, titulo: "Ganhe prêmios", desc: "Top 3 leva TV, Tablet ou Kit Copa Rapidin." },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="display mb-8 text-center text-3xl text-verde md:text-4xl">COMO FUNCIONA</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {passos.map(({ icon: Icon, titulo, desc }, i) => (
            <div key={titulo} className="rounded-2xl border-2 border-verde/20 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-laranja text-white">
                <Icon size={22} />
              </div>
              <div className="mb-1 text-xs font-bold text-laranja">PASSO {i + 1}</div>
              <div className="mb-1 font-bold text-verde">{titulo}</div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
