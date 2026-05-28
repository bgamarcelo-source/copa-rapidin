import { useEffect, useState } from "react";
import { supabase, type Bairro } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function BairrosAdmin() {
  const [lista, setLista] = useState<Bairro[]>([]);
  const [novo, setNovo] = useState("");

  async function load() {
    const { data } = await supabase.from("bairros").select("*").order("nome");
    if (data) setLista(data);
  }

  useEffect(() => { load(); }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (novo.trim().length < 2) return;
    const { error } = await supabase.from("bairros").insert({ nome: novo.trim() });
    if (error) return toast.error(error.code === "23505" ? "Bairro já existe" : "Erro");
    toast.success("Bairro adicionado");
    setNovo("");
    load();
  }

  async function excluir(id: string, count: number) {
    if (count > 0) return toast.error("Bairro tem participantes — remova-os antes.");
    if (!confirm("Excluir bairro?")) return;
    await supabase.from("bairros").delete().eq("id", id);
    toast.success("Excluído");
    load();
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="display mb-4 text-xl text-verde">BAIRROS</h2>

      <form onSubmit={adicionar} className="mb-4 flex gap-2">
        <Input placeholder="Nome do novo bairro" value={novo} onChange={(e) => setNovo(e.target.value)} />
        <Button type="submit" className="bg-laranja hover:bg-laranja-dark">Adicionar</Button>
      </form>

      <div className="space-y-2">
        {lista.map(b => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border bg-secondary/20 px-3 py-2 text-sm">
            <div>
              <span className="font-bold">{b.nome}</span>
              <span className="ml-2 text-xs text-muted-foreground">{b.participantes_count} participantes · {b.pontos_total} pts</span>
            </div>
            <button onClick={() => excluir(b.id, b.participantes_count)} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
