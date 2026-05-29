import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Star } from "lucide-react";

const medalha = ["🥈", "🥉"];

type LinhaHoje = {
  participante_id: string;
  nome: string;
  pontos_hoje: number;
  foto_url: string | null;
};

export function Ranking() {
  const [ranking, setRanking] = useState<LinhaHoje[]>([]);
  const [atualizado, setAtualizado] = useState<Date>(new Date());

  async function load() {
    const { data } = await supabase
      .from("v_ranking_hoje")
      .select("participante_id, nome, pontos_hoje, foto_url")
      .limit(10);
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

        {/* 1º lugar = Destaque do dia, em destaque visual */}
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
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-laranja text-4xl font-bold text-white ring-4 ring-laranja sm:h-28 sm:w-28">
                    {destaque.nome[0]}
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
        {restante.length > 0 && (
          <div className="overflow-hidden rounded-2xl border-2 border-verde/20 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-verde text-white">
                <tr>
                  <th className="px-3 py-3 text-left">POSIÇÃO</th>
                  <th className="px-3 py-3 text-left">PARTICIPANTE</th>
                  <th className="px-3 py-3 text-right">PONTOS HOJE</th>
                </tr>
              </thead>
              <tbody>
                {restante.map((r, i) => {
                  const pos = i + 2; // começa em 2 porque o 1º é o destaque
                  return (
                    <tr key={r.participante_id} className={i % 2 === 0 ? "bg-white" : "bg-secondary/40"}>
                      <td className="px-3 py-3 font-bold">
                        {pos <= 3 ? <span className="text-2xl">{medalha[pos - 2]}</span> : <span className="text-muted-foreground">{pos}º</span>}
                      </td>
                      <td className="px-3 py-3 font-semibold">{r.nome}</td>
                      <td className="px-3 py-3 text-right font-bold text-laranja">{r.pontos_hoje.toLocaleString("pt-BR")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
