import { useEffect, useState } from "react";
import { supabase, type Bairro } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function DueloAdmin() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [atual, setAtual] = useState<string | null>(null);

  const hoje = new Date().toISOString().slice(0, 10);

  async function load() {
    const [{ data: list }, { data: cur }] = await Promise.all([
      supabase.from("bairros").select("*").order("nome"),
      supabase.from("duelo_do_dia")
        .select("bairro_a:bairros!duelo_do_dia_bairro_a_id_fkey(nome), bairro_b:bairros!duelo_do_dia_bairro_b_id_fkey(nome)")
        .eq("data", hoje)
        .maybeSingle(),
    ]);
    if (list) setBairros(list);
    if (cur) setAtual(`${(cur as any).bairro_a?.nome} vs ${(cur as any).bairro_b?.nome}`);
    else setAtual(null);
  }

  useEffect(() => { load(); }, []);

  async function salvar() {
    if (!a || !b) return toast.error("Selecione os 2 bairros");
    if (a === b) return toast.error("Os bairros precisam ser diferentes");
    const { error } = await supabase.from("duelo_do_dia").upsert(
      { bairro_a_id: a, bairro_b_id: b, data: hoje },
      { onConflict: "data" }
    );
    if (error) return toast.error("Falha: " + error.message);
    toast.success("Duelo definido");
    load();
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="display mb-4 text-xl text-verde">DUELO DO DIA</h2>
      {atual && <div className="mb-4 rounded-xl bg-verde/10 p-3 text-sm font-bold">Hoje: {atual}</div>}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Bairro A</Label>
          <select value={a} onChange={(e) => setA(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Selecione</option>
            {bairros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select>
        </div>
        <div>
          <Label>Bairro B</Label>
          <select value={b} onChange={(e) => setB(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Selecione</option>
            {bairros.map(bb => <option key={bb.id} value={bb.id}>{bb.nome}</option>)}
          </select>
        </div>
      </div>

      <Button onClick={salvar} className="mt-4 w-full bg-laranja hover:bg-laranja-dark">Salvar duelo</Button>
    </div>
  );
}
