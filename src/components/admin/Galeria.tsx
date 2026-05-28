import { useEffect, useState } from "react";
import { supabase, type GaleriaItem } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function GaleriaAdmin() {
  const [lista, setLista] = useState<GaleriaItem[]>([]);
  const [titulo, setTitulo] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);

  async function load() {
    const { data } = await supabase.from("galeria").select("*").order("ordem");
    if (data) setLista(data);
  }
  useEffect(() => { load(); }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) return toast.error("Selecione uma foto");
    setUpload(true);
    const nome = `${Date.now()}-${arquivo.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("galeria").upload(nome, arquivo);
    if (upErr) { setUpload(false); return toast.error("Upload falhou: " + upErr.message); }
    const { data: pub } = supabase.storage.from("galeria").getPublicUrl(nome);
    const { error } = await supabase.from("galeria").insert({
      foto_url: pub.publicUrl,
      titulo: titulo || null,
      ordem: lista.length,
    });
    setUpload(false);
    if (error) return toast.error("Falha");
    toast.success("Foto adicionada");
    setTitulo("");
    setArquivo(null);
    load();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir foto?")) return;
    await supabase.from("galeria").delete().eq("id", id);
    toast.success("Excluída");
    load();
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="display mb-4 text-xl text-verde">GALERIA</h2>

      <form onSubmit={adicionar} className="mb-6 space-y-3 rounded-xl border bg-secondary/10 p-3">
        <div>
          <Label>Foto</Label>
          <Input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <Label>Título (opcional)</Label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Entrega Smart TV" />
        </div>
        <Button type="submit" disabled={upload} className="bg-laranja hover:bg-laranja-dark">
          {upload ? "Enviando..." : "Adicionar foto"}
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        {lista.map(g => (
          <div key={g.id} className="overflow-hidden rounded-xl border">
            <img src={g.foto_url} alt={g.titulo ?? ""} className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between p-2 text-xs">
              <span className="truncate">{g.titulo ?? "—"}</span>
              <button onClick={() => excluir(g.id)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
