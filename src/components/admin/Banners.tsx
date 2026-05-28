import { useEffect, useState } from "react";
import { supabase, type Banner } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function BannersAdmin() {
  const [lista, setLista] = useState<Banner[]>([]);
  const [link, setLink] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);

  async function load() {
    const { data } = await supabase.from("banners").select("*").order("ordem");
    if (data) setLista(data);
  }
  useEffect(() => { load(); }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) return toast.error("Selecione uma imagem");
    setUpload(true);
    const nome = `${Date.now()}-${arquivo.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("banners").upload(nome, arquivo);
    if (upErr) { setUpload(false); return toast.error("Upload falhou: " + upErr.message); }
    const { data: pub } = supabase.storage.from("banners").getPublicUrl(nome);
    const { error } = await supabase.from("banners").insert({
      imagem_url: pub.publicUrl,
      link: link || null,
      ordem: lista.length,
      ativo: true,
    });
    setUpload(false);
    if (error) return toast.error("Falha: " + error.message);
    toast.success("Banner adicionado");
    setLink("");
    setArquivo(null);
    load();
  }

  async function toggleAtivo(b: Banner) {
    await supabase.from("banners").update({ ativo: !b.ativo }).eq("id", b.id);
    load();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("Excluído");
    load();
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="display mb-4 text-xl text-verde">BANNERS DO CARROSSEL</h2>

      <form onSubmit={adicionar} className="mb-6 space-y-3 rounded-xl border bg-secondary/10 p-3">
        <div>
          <Label>Imagem</Label>
          <Input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <Label>Link (opcional)</Label>
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
        </div>
        <Button type="submit" disabled={upload} className="bg-laranja hover:bg-laranja-dark">
          {upload ? "Enviando..." : "Adicionar banner"}
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {lista.map(b => (
          <div key={b.id} className="overflow-hidden rounded-xl border">
            <img src={b.imagem_url} alt="" className="aspect-video w-full object-cover" />
            <div className="flex items-center justify-between p-2 text-xs">
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={b.ativo} onChange={() => toggleAtivo(b)} />
                Ativo
              </label>
              <button onClick={() => excluir(b.id)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
