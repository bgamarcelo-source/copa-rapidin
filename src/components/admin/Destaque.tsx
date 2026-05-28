import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function DestaqueAdmin({ userId }: { userId: string }) {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Participante[]>([]);
  const [selecionado, setSelecionado] = useState<Participante | null>(null);
  const [pontos, setPontos] = useState(0);
  const [atual, setAtual] = useState<{ nome: string; pontos: number } | null>(null);

  const hoje = new Date().toISOString().slice(0, 10);

  async function load() {
    const { data } = await supabase
      .from("destaque_do_dia")
      .select("*, participante:participantes(nome)")
      .eq("data", hoje)
      .maybeSingle();
    if (data) setAtual({ nome: (data as any).participante?.nome ?? "", pontos: data.pontos_hoje });
    else setAtual(null);
  }

  useEffect(() => { load(); }, []);

  async function buscar(q: string) {
    setBusca(q);
    if (q.length < 2) return setResultados([]);
    const { data } = await supabase.from("participantes").select("*").ilike("nome", `%${q}%`).limit(8);
    setResultados(data ?? []);
  }

  async function definir() {
    if (!selecionado || pontos <= 0) return toast.error("Selecione participante e pontos");
    const { error } = await supabase.from("destaque_do_dia").upsert(
      { participante_id: selecionado.id, data: hoje, pontos_hoje: pontos },
      { onConflict: "data" }
    );
    if (error) return toast.error("Falha: " + error.message);
    toast.success("Destaque do dia atualizado");
    setSelecionado(null);
    setBusca("");
    setPontos(0);
    load();
  }

  async function autoPick() {
    const { data } = await supabase.rpc("auto_destaque_hoje" as any);
    if (data) {
      toast.success("Destaque calculado automaticamente");
      load();
    } else {
      const { data: top } = await supabase
        .from("eventos_pontuacao")
        .select("participante_id, pontos, participante:participantes(nome)")
        .eq("data", hoje);
      if (!top || top.length === 0) return toast.error("Sem pontuações hoje");
      const agg = new Map<string, { nome: string; total: number }>();
      for (const e of top as any[]) {
        const cur = agg.get(e.participante_id) ?? { nome: e.participante?.nome ?? "", total: 0 };
        cur.total += e.pontos;
        agg.set(e.participante_id, cur);
      }
      const top1 = [...agg.entries()].sort((a, b) => b[1].total - a[1].total)[0];
      const { error } = await supabase.from("destaque_do_dia").upsert(
        { participante_id: top1[0], data: hoje, pontos_hoje: top1[1].total },
        { onConflict: "data" }
      );
      if (error) return toast.error("Falha");
      toast.success(`Destaque: ${top1[1].nome} (${top1[1].total} pts)`);
      load();
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="display mb-4 text-xl text-verde">DESTAQUE DO DIA</h2>

      {atual && (
        <div className="mb-4 rounded-xl bg-amarelo/20 p-3 text-sm">
          <span className="font-bold">Hoje:</span> {atual.nome} — {atual.pontos} pts
        </div>
      )}

      <Button onClick={autoPick} variant="outline" className="mb-4 w-full">
        Pegar quem mais pontuou hoje
      </Button>

      <div className="space-y-3">
        <div>
          <Label>Buscar participante</Label>
          <Input placeholder="Nome..." value={busca} onChange={(e) => buscar(e.target.value)} />
          {resultados.length > 0 && !selecionado && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border">
              {resultados.map(p => (
                <button key={p.id} onClick={() => { setSelecionado(p); setBusca(p.nome); setResultados([]); }} className="block w-full border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-secondary">
                  {p.nome} <span className="text-xs text-muted-foreground">({p.pontos_total} pts)</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Pontos de hoje</Label>
          <Input type="number" min={0} value={pontos} onChange={(e) => setPontos(parseInt(e.target.value) || 0)} />
        </div>

        <Button onClick={definir} className="w-full bg-laranja hover:bg-laranja-dark">Definir destaque</Button>
      </div>
    </div>
  );
}
