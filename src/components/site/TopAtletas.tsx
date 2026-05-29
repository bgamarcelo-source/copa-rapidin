import { useEffect, useState } from "react";
import { supabase, type Participante, type Bairro } from "@/lib/supabase";
import { Trophy, Target } from "lucide-react";

const medalha = ["🥇", "🥈", "🥉"];

type Linha = Participante & { bairro?: Bairro };

export function TopAtletas() {
  const [atletas, setAtletas] = useState<Linha[]>([]);

  async function load() {
    const { data } = await supabase
      .from("participantes")
      .select("*, bairro:bairros(*)")
      .order("pontos_total", { ascending: false })
      .limit(10);
    if (data) setAtletas(data as Linha[]);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("top-atletas")
      .on("postgres_changes", { event: "*", schema: "public", table: "participantes" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <section id="atletas" className="bg-secondary/30 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="display flex items-center gap-2 text-3xl text-verde md:text-4xl">
              <Trophy className="text-laranja" /> TOP 10 ATLETAS
            </h2>
            <p className="text-sm text-muted-foreground">
              Os 3 primeiros ganham os prêmios. Quem chuta mais, leva.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-laranja/20 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-laranja text-white">
              <tr>
                <th className="px-3 py-3 text-left">POSIÇÃO</th>
                <th className="px-3 py-3 text-left">ATLETA</th>
                <th className="px-3 py-3 text-left">BAIRRO</th>
                <th className="px-3 py-3 text-right">PONTOS</th>
              </tr>
            </thead>
            <tbody>
              {atletas.map((a, i) => (
                <tr
                  key={a.id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-secondary/30"} ${i < 3 ? "font-bold" : ""}`}
                >
                  <td className="px-3 py-3">
                    {i < 3 ? (
                      <span className="text-2xl">{medalha[i]}</span>
                    ) : (
                      <span className="text-muted-foreground">{i + 1}º</span>
                    )}
                  </td>
                  <td className="px-3 py-3">{primeiroNome(a.nome)}</td>
                  <td className="px-3 py-3 text-muted-foreground">{a.bairro?.nome ?? "—"}</td>
                  <td className="px-3 py-3 text-right text-laranja">{a.pontos_total.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
              {atletas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-muted-foreground">
                    <Target className="mx-auto mb-2 text-laranja/50" size={32} />
                    Ninguém pontuou ainda. Seja o primeiro!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          *Privacidade: mostramos só o primeiro nome no ranking público.
        </p>
      </div>
    </section>
  );
}

function primeiroNome(nome: string) {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0];
  return `${partes[0]} ${partes[1][0]}.`;
}
