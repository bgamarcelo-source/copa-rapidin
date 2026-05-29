import { Trophy, Medal, Award } from "lucide-react";
import { asset } from "@/lib/assets";

const premios = [
  {
    posicao: "Primeiro Prêmio",
    icon: Trophy,
    cor: "text-amarelo",
    bgPos: "bg-amarelo",
    bgPosText: "text-laranja-dark",
    titulo: "Smart TV 55\" + 1 ano de internet + Premiere",
    img: asset("/premios-primeiro.png"),
  },
  {
    posicao: "Segundo Prêmio",
    icon: Medal,
    cor: "text-laranja",
    bgPos: "bg-laranja",
    bgPosText: "text-white",
    titulo: "Tablet Android + 6 meses com 700MB",
    img: asset("/premios-segundo.png"),
  },
  {
    posicao: "Terceiro Prêmio",
    icon: Award,
    cor: "text-verde",
    bgPos: "bg-verde",
    bgPosText: "text-white",
    titulo: "Kit Copa Rapidin (camisa + 2 copos)",
    img: asset("/premios-terceiro.png"),
  },
];

export function Premios() {
  return (
    <section id="premiacoes" className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-block rounded-full bg-laranja px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Concorra aos prêmios
          </div>
          <h2 className="display text-4xl text-verde md:text-5xl">PREMIAÇÕES</h2>
          <p className="mt-2 text-sm text-muted-foreground">Confira os prêmios que você pode levar para casa.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {premios.map(({ posicao, icon: Icon, cor, bgPos, bgPosText, titulo, img }) => (
            <div
              key={posicao}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Badge da posição no canto */}
              <div className={`absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full ${bgPos} px-3 py-1.5 text-xs font-bold uppercase shadow-md ${bgPosText}`}>
                <Icon size={14} strokeWidth={2.5} />
                {posicao}
              </div>

              {/* Imagem oficial em portrait, edge-to-edge */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={img}
                  alt={posicao}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              {/* Rodapé com descrição do prêmio */}
              <div className="bg-white p-5">
                <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${cor}`}>O que você leva</p>
                <p className="text-sm font-semibold leading-snug">{titulo}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">*Imagens meramente ilustrativas</p>
      </div>
    </section>
  );
}
