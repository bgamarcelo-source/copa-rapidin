import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { Trophy, Star } from "lucide-react";

const medalha = ["🥇", "🥈", "🥉"];

type LinhaHoje = {
  participante_id: string;
  nome: string;
  pontos_hoje: number;
};

type DestaqueRow = {
  pontos_hoje: number;
  participante: (Participante & { bairro?: { nome: string } | null }) | null;
};

export function Ranking() {
  const [ranking, setRanking] = useState<LinhaHoje[]>([]);
  const [destaque, setDestaque] = useState<DestaqueRow | null>(null);
  const [atualizado, setAtualizado] = useState<Date>(new Date());

  async function load() {
    const hoje = new Date().toISOString().slice(0, 10);
    const [r, d] = await Promise.all([
      supabase
        .from("v_ranking_hoje")
        .select("participante_id, nome, pontos_hoje")
        .limit(10),
      supabase
        .from("destaque_do_dia")
        .select("pontos_hoje, participante:participantes(*, bairro:bairros(nome))")
        .eq("data", hoje)
        .maybeSingle(),
    ]);
    if (r.data) setRanking(r.data as LinhaHoje[]);
    if (d.data) setDestaque(d.data as DestaqueRow);
    else setDestaque(null);
    setAtualizado(new Date());
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("ranking-hoje")
      .on("postgres_changes", { event: "*", schema: "public", table: "eventos_pontuacao" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "destaque_do_dia" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

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
              {destaque?.participante ? (
                <div className="flex items-center gap-3">
                  {destaque.participante.foto_url ? (
                    <img src={destaque.participante.foto_url} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-laranja" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-laranja text-xl font-bold text-white">
                      {destaque.participante.nome[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-bold">{destaque.participante.nome}</div>
                    <div className="text-sm font-bold text-laranja">{destaque.pontos_hoje} pontos hoje</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aguardando destaque de hoje</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
