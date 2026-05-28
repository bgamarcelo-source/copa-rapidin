import { Zap, ShieldCheck, Headphones, Wifi } from "lucide-react";

const itens = [
  { icon: Zap, titulo: "Internet Ultrarrápida", desc: "Alta velocidade pra tudo." },
  { icon: ShieldCheck, titulo: "Estabilidade", desc: "Conexão firme o dia todo." },
  { icon: Headphones, titulo: "Suporte de Verdade", desc: "Atendimento humano e rápido." },
  { icon: Wifi, titulo: "Sua Vida Conectada", desc: "Trabalho, estudo e diversão." },
];

export function Beneficios() {
  return (
    <section className="bg-verde py-6 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {itens.map(({ icon: Icon, titulo, desc }) => (
          <div key={titulo} className="flex items-center gap-3">
            <div className="rounded-full bg-white/15 p-2">
              <Icon size={22} />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">{titulo}</div>
              <div className="text-xs opacity-90">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
