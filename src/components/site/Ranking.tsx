import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Star } from "lucide-react";

const medalha = ["🥇", "🥈", "🥉"];

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

  return (
    <section id="ranking" className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
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

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border-2 border-verde/20 shadow-sm lg:col-span-2">
            <table className="w-full text-sm">
              <thead className="bg-verde text-white">
                <tr>
                  <th className="px-3 py-3 text-left">POSIÇÃO</th>
                  <th className="px-3 py-3 text-left">PARTICIPANTE</th>
                  <th className="px-3 py-3 text-right">PONTOS HOJE</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr key={r.participante_id} className={i % 2 === 0 ? "bg-white" : "bg-secondary/40"}>
                    <td className="px-3 py-3 font-bold">
                      {i < 3 ? <span className="text-2xl">{medalha[i]}</span> : <span className="text-muted-foreground">{i + 1}º</span>}
                    </td>
                    <td className="px-3 py-3 font-semibold">{r.nome}</td>
                    <td className="px-3 py-3 text-right font-bold text-laranja">{r.pontos_hoje.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
                {ranking.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">Ninguém pontuou hoje ainda. Seja o primeiro!</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-laranja/30 bg-gradient-to-br from-laranja/5 to-amarelo/10 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-laranja">
                <Star size={14} className="fill-laranja" /> Destaque do dia
              </div>
              {destaque ? (
                <div className="flex items-center gap-3">
                  {destaque.foto_url ? (
                    <img src={destaque.foto_url} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-laranja" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-laranja text-xl font-bold text-white">
                      {destaque.nome[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-bold">{destaque.nome}</div>
                    <div className="text-sm font-bold text-laranja">{destaque.pontos_hoje} pontos hoje</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aguardando primeiro chute do dia</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
