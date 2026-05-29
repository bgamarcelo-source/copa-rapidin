import { useEffect, useState } from "react";
import { supabase, type Bairro, type DestaqueDoDia, type DueloDoDia } from "@/lib/supabase";
import { Trophy, ArrowUp, ArrowDown, Minus, Star, Swords } from "lucide-react";

const medalha = ["🥇", "🥈", "🥉"];

export function Ranking() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [destaque, setDestaque] = useState<DestaqueDoDia | null>(null);
  const [duelo, setDuelo] = useState<DueloDoDia | null>(null);
  const [atualizado, setAtualizado] = useState<Date>(new Date());

  async function load() {
    const hoje = new Date().toISOString().slice(0, 10);
    const [b, d, du] = await Promise.all([
      supabase.from("bairros").select("*").order("pontos_total", { ascending: false }),
      supabase
        .from("destaque_do_dia")
        .select("*, participante:participantes(*, bairro:bairros(*))")
        .eq("data", hoje)
        .maybeSingle(),
      supabase
        .from("duelo_do_dia")
        .select("*, bairro_a:bairros!duelo_do_dia_bairro_a_id_fkey(*), bairro_b:bairros!duelo_do_dia_bairro_b_id_fkey(*)")
        .eq("data", hoje)
        .maybeSingle(),
    ]);
    if (b.data) setBairros(b.data);
    if (d.data) setDestaque(d.data as DestaqueDoDia);
    if (du.data) setDuelo(du.data as DueloDoDia);
    setAtualizado(new Date());
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("ranking")
      .on("postgres_changes", { event: "*", schema: "public", table: "bairros" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "destaque_do_dia" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "duelo_do_dia" }, () => load())
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
            <p className="text-sm text-muted-foreground">Acompanhe os bairros que estão fazendo história</p>
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
                  <th className="px-3 py-3 text-left">BAIRRO</th>
                  <th className="px-3 py-3 text-right">PONTOS</th>
                  <th className="hidden px-3 py-3 text-right sm:table-cell">PARTICIPANTES</th>
                  <th className="px-3 py-3 text-center">EVOLUÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {bairros.map((b, i) => (
                  <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-secondary/40"}>
                    <td className="px-3 py-3 font-bold">
                      {i < 3 ? <span className="text-2xl">{medalha[i]}</span> : <span className="text-muted-foreground">{i + 1}º</span>}
                    </td>
                    <td className="px-3 py-3 font-semibold">{b.nome}</td>
                    <td className="px-3 py-3 text-right font-bold text-laranja">{b.pontos_total.toLocaleString("pt-BR")}</td>
                    <td className="hidden px-3 py-3 text-right text-muted-foreground sm:table-cell">{b.participantes_count}</td>
                    <td className="px-3 py-3 text-center">
                      {b.evolucao > 0 ? (
                        <span className="inline-flex items-center gap-1 text-verde"><ArrowUp size={14} />+{b.evolucao}</span>
                      ) : b.evolucao < 0 ? (
                        <span className="inline-flex items-center gap-1 text-destructive"><ArrowDown size={14} />{b.evolucao}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground"><Minus size={14} /></span>
                      )}
                    </td>
                  </tr>
                ))}
                {bairros.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">Ranking começa em 01/junho</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-laranja/30 bg-gradient-to-br from-laranja/5 to-amarelo/10 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-laranja"><Star size={14} className="fill-laranja" /> Destaque do dia</div>
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
                    <div className="text-xs text-muted-foreground">{destaque.participante.bairro?.nome ?? ""}</div>
                    <div className="text-sm font-bold text-laranja">{destaque.pontos_hoje} pontos hoje</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aguardando destaque de hoje</p>
              )}
            </div>

            <div className="rounded-2xl border-2 border-verde/30 bg-gradient-to-br from-verde/5 to-amarelo/10 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-verde"><Swords size={14} /> Duelo do dia</div>
              {duelo?.bairro_a && duelo.bairro_b ? (
                <div className="grid grid-cols-3 items-center gap-2 text-center">
                  <div>
                    <div className="text-sm font-bold">{duelo.bairro_a.nome}</div>
                    <div className="text-lg font-bold text-laranja">{duelo.bairro_a.pontos_total.toLocaleString("pt-BR")}</div>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">VS</div>
                  <div>
                    <div className="text-sm font-bold">{duelo.bairro_b.nome}</div>
                    <div className="text-lg font-bold text-laranja">{duelo.bairro_b.pontos_total.toLocaleString("pt-BR")}</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem duelo definido pra hoje</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
