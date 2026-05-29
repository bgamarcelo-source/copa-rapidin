import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { asset } from "@/lib/assets";
import { Trophy, Star, ChevronDown, ChevronUp } from "lucide-react";

const medalha = ["🥈", "🥉"];

type LinhaHoje = {
  participante_id: string;
  nome: string;
  pontos_hoje: number;
};

const INICIAL_VISIVEIS = 7; // total exibido inicialmente (inclui o destaque/1º lugar)

export function Ranking() {
  const [ranking, setRanking] = useState<LinhaHoje[]>([]);
  const [atualizado, setAtualizado] = useState<Date>(new Date());
  const [expandido, setExpandido] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("v_ranking_hoje")
      .select("participante_id, nome, pontos_hoje")
      .limit(100);
    if (data) setRanking(data as LinhaHoje[]);
    setAtualizado(new Date());
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("ranking-hoje")
      .on("postgres_changes", { event: "*", schema: "public", table: "eventos_pontuacao" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const destaque = ranking[0] ?? null;
  const restante = ranking.slice(1);
  const visiveis = expandido ? restante : restante.slice(0, INICIAL_VISIVEIS - 1);
  const ocultos = restante.length - visiveis.length;

  return (
    <section id="ranking" className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="display flex items-center gap-2 text-3xl text-verde md:text-4xl">
              <Trophy className="text-laranja" /> RANKING DA TORCIDA
            </h2>
            <p className="text-sm text-muted-foreground">Pontuação do dia · zera todo amanhecer</p>
          </div>
          <div className="rounded-full bg-verde px-3 py-1 text-xs font-bold text-white">
            ATUALIZADO {atualizado.toLocaleDateString("pt-BR")} às {atualizado.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* 1º lugar = Destaque do dia */}
        {destaque ? (
          <div className="mb-3 overflow-hidden rounded-3xl border-2 border-laranja bg-gradient-to-br from-laranja via-laranja to-amarelo p-1 shadow-lg">
            <div className="relative flex items-center gap-4 overflow-hidden rounded-[20px] bg-white p-5 pr-32 sm:gap-6 sm:p-6 sm:pr-48 md:pr-56">
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-laranja px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  <Star size={12} className="fill-white" /> Destaque do dia · 1º lugar
                </div>
                <div className="display text-2xl leading-tight text-verde sm:text-3xl md:text-4xl">{destaque.nome}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="display text-4xl text-laranja sm:text-5xl">{destaque.pontos_hoje.toLocaleString("pt-BR")}</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">pontos hoje</span>
                </div>
              </div>

              <img
                src={asset("/assets/mascote/mascote-destaque.png")}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -bottom-2 right-0 h-[140%] max-h-[180px] w-auto object-contain drop-shadow-md sm:max-h-[220px] md:max-h-[260px]"
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 rounded-3xl border-2 border-dashed border-muted-foreground/30 bg-secondary/30 p-8 text-center">
            <Star className="mx-auto mb-2 text-laranja/40" size={32} />
            <p className="text-sm font-medium text-muted-foreground">Ninguém pontuou hoje ainda. Seja o primeiro!</p>
          </div>
        )}

        {/* Demais posições */}
        {visiveis.length > 0 && (
          <>
            <ol className="space-y-2">
              {visiveis.map((r, i) => {
                const pos = i + 2;
                const podio = pos <= 3;
                return (
                  <li
                    key={r.participante_id}
                    className={`flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-verde/10 ${
                      podio ? "ring-verde/30" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                      {podio ? (
                        <span className="text-3xl leading-none">{medalha[pos - 2]}</span>
                      ) : (
                        <span className="display text-xl text-muted-foreground">{pos}º</span>
                      )}
                    </div>
                    <span className={`flex-1 truncate ${podio ? "font-bold" : "font-medium"}`}>{r.nome}</span>
                    <span className="flex items-baseline gap-1 tabular-nums">
                      <span className={`font-bold text-laranja ${podio ? "text-xl" : "text-lg"}`}>
                        {r.pontos_hoje.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs font-medium uppercase text-muted-foreground">pts</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {ocultos > 0 && !expandido && (
              <button
                onClick={() => setExpandido(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-verde/40 bg-verde/5 px-4 py-3 text-sm font-bold text-verde hover:bg-verde/10"
              >
                Ver mais {ocultos} {ocultos === 1 ? "participante" : "participantes"}
                <ChevronDown size={16} />
              </button>
            )}

            {expandido && restante.length > INICIAL_VISIVEIS - 1 && (
              <button
                onClick={() => setExpandido(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-secondary/30 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary/50"
              >
                Recolher
                <ChevronUp size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
