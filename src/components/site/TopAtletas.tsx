import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { asset } from "@/lib/assets";
import { Target } from "lucide-react";

const medalha = ["🥇", "🥈", "🥉"];

export function TopAtletas() {
  const [atletas, setAtletas] = useState<Participante[]>([]);

  async function load() {
    const { data } = await supabase
      .from("participantes")
      .select("*")
      .order("pontos_total", { ascending: false })
      .limit(10);
    if (data) setAtletas(data);
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
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-laranja px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Pontuação acumulada · todos os dias somados
          </div>
          <h2 className="display flex items-center gap-2 text-3xl text-verde md:text-4xl">
            <img src={asset("/assets/trofeu-copa.png")} alt="" aria-hidden className="h-9 w-auto sm:h-10 md:h-12" /> TOP 10 ATLETAS
          </h2>
          <p className="text-sm text-muted-foreground">
            Total de pontos desde o início da promoção. Quanto mais pontos, mais números da sorte você ganha — e mais chances de levar um prêmio!
          </p>
        </div>

        {atletas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-white p-10 text-center">
            <Target className="mx-auto mb-2 text-laranja/40" size={32} />
            <p className="text-sm font-medium text-muted-foreground">Ninguém pontuou ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <ol className="space-y-2">
            {atletas.map((a, i) => {
              const top3 = i < 3;
              return (
                <li
                  key={a.id}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 shadow-sm transition ${
                    top3
                      ? "bg-white ring-2 ring-laranja/30"
                      : "bg-white/80"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    {top3 ? (
                      <span className="text-3xl leading-none">{medalha[i]}</span>
                    ) : (
                      <span className="display text-xl text-muted-foreground">{i + 1}º</span>
                    )}
                  </div>
                  <span className={`flex-1 truncate ${top3 ? "font-bold" : "font-medium"}`}>{a.nome}</span>
                  <span className="flex items-baseline gap-1 tabular-nums">
                    <span className={`font-bold text-laranja ${top3 ? "text-2xl" : "text-lg"}`}>
                      {a.pontos_total.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs font-medium uppercase text-muted-foreground">pts</span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
