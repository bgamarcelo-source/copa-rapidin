import { Trophy, Medal, Award } from "lucide-react";
import { asset } from "@/lib/assets";

const premios = [
  {
    posicao: "1º LUGAR",
    icon: Trophy,
    cor: "from-amarelo to-laranja",
    titulo: "Smart TV 55\" + 1 ano de internet + Premiere",
    img: asset("/premios-primeiro.png"),
  },
  {
    posicao: "2º LUGAR",
    icon: Medal,
    cor: "from-laranja to-laranja-dark",
    titulo: "Tablet Android + 6 meses com 700MB",
    img: asset("/premios-segundo.png"),
  },
  {
    posicao: "3º LUGAR",
    icon: Award,
    cor: "from-verde to-verde-dark",
    titulo: "Kit Copa Rapidin (camisa + 2 copos)",
    img: asset("/premios-terceiro.png"),
  },
];

export function Premios() {
  return (
    <section id="premiacoes" className="bg-secondary/40 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="display mb-2 text-center text-3xl text-verde md:text-4xl">PREMIAÇÕES</h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">Os 3 melhores do ranking levam prêmios incríveis</p>

        <div className="grid gap-6 md:grid-cols-3">
          {premios.map(({ posicao, icon: Icon, cor, titulo, img }) => (
            <div key={posicao} className="overflow-hidden rounded-2xl bg-white shadow-md">
              <div className={`bg-gradient-to-br ${cor} flex items-center justify-center p-6`}>
                <img
                  src={img}
                  alt={posicao}
                  className="h-40 w-auto object-contain drop-shadow-lg"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="text-laranja" size={20} />
                  <span className="display text-lg text-verde">{posicao}</span>
                </div>
                <p className="text-sm font-medium">{titulo}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">*Imagens meramente ilustrativas</p>
      </div>
    </section>
  );
}
