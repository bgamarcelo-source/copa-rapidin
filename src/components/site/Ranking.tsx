import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Star, ChevronDown, ChevronUp } from "lucide-react";

const medalha = ["🥈", "🥉"];

// Troféu inspirado na Copa do Mundo: globo no topo apoiado por duas figuras estilizadas + base
function TrofeuCopa({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="ouro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD86B" />
          <stop offset="50%" stopColor="#F5B400" />
          <stop offset="100%" stopColor="#C98800" />
        </linearGradient>
      </defs>
      {/* Globo (esfera) no topo */}
      <circle cx="32" cy="14" r="8" fill="url(#ouro)" stroke="#8a5e00" strokeWidth="0.6" />
      {/* Meridianos do globo */}
      <ellipse cx="32" cy="14" rx="3.2" ry="8" fill="none" stroke="#8a5e00" strokeWidth="0.5" opacity="0.5" />
      <line x1="24" y1="14" x2="40" y2="14" stroke="#8a5e00" strokeWidth="0.5" opacity="0.5" />
      {/* Duas figuras estilizadas que sustentam o globo */}
      <path
        d="M22 22 C22 32, 27 34, 30 38 L30 44 L34 44 L34 38 C37 34, 42 32, 42 22 C40 24, 36 26, 32 26 C28 26, 24 24, 22 22 Z"
        fill="url(#ouro)"
        stroke="#8a5e00"
        strokeWidth="0.6"
      />
      {/* Coluna central */}
      <rect x="29" y="42" width="6" height="6" fill="url(#ouro)" stroke="#8a5e00" strokeWidth="0.6" />
      {/* Base do troféu */}
      <path d="M18 48 L46 48 L44 56 L20 56 Z" fill="url(#ouro)" stroke="#8a5e00" strokeWidth="0.6" />
      {/* Plaquinha brilhante na base */}
      <rect x="26" y="50" width="12" height="3" fill="#fff7d6" opacity="0.6" />
    </svg>
  );
}

type LinhaHoje = {
  participante_id: string;
  nome: string;
  pontos_hoje: number;
  foto_url: string | null;
};

const INICIAL_VISIVEIS = 7; // total exibido inicialmente (inclui o destaque/1º lugar)

export function Ranking() {
  const [ranking, setRanking] = useState<LinhaHoje[]>([]);
  const [atualizado, setAtualizado] = useState<Date>(new Date());
  const [expandido, setExpandido] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("v_ranking_hoje")
      .select("participante_id, nome, pontos_hoje, foto_url")
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
            <div className="flex flex-col items-center gap-4 rounded-[20px] bg-white p-5 sm:flex-row sm:gap-6 sm:p-6">
              <div className="relative shrink-0">
                {destaque.foto_url ? (
                  <img
                    src={destaque.foto_url}
                    alt=""
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-laranja sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amarelo to-laranja ring-4 ring-laranja sm:h-28 sm:w-28">
                    <TrofeuCopa className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-md" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amarelo text-xl shadow-md ring-2 ring-white">
                  🥇
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-laranja px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  <Star size={12} className="fill-white" /> Destaque do dia · 1º lugar
                </div>
                <div className="display text-2xl text-verde sm:text-3xl">{destaque.nome}</div>
                <div className="mt-1 flex items-baseline justify-center gap-2 sm:justify-start">
                  <span className="display text-4xl text-laranja sm:text-5xl">{destaque.pontos_hoje.toLocaleString("pt-BR")}</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">pontos hoje</span>
                </div>
              </div>
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
