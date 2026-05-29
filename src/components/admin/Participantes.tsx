import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatarCpf, formatarTel } from "@/lib/validators";
import { Trash2, UserPlus, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { CadastroParticipante } from "./CadastroParticipante";
import { exportarParticipantesExcel } from "@/lib/exportarExcel";

export function ParticipantesAdmin() {
  const [lista, setLista] = useState<Participante[]>([]);
  const [filtro, setFiltro] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);
  const [exportando, setExportando] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("participantes")
      .select("*")
      .order("pontos_total", { ascending: false });
    if (data) setLista(data);
  }

  useEffect(() => { load(); }, []);

  async function excluir(id: string) {
    if (!confirm("Excluir esse participante? Os pontos dele também serão removidos.")) return;
    const { error } = await supabase.from("participantes").delete().eq("id", id);
    if (error) return toast.error("Falha ao excluir");
    toast.success("Participante excluído");
    load();
  }

  const filtrada = lista.filter(p => {
    if (!filtro) return true;
    const f = filtro.toLowerCase();
    return p.nome.toLowerCase().includes(f) || p.telefone.includes(filtro) || p.cpf.includes(filtro);
  });

  async function exportar() {
    if (lista.length === 0) {
      toast.error("Nenhum participante para exportar");
      return;
    }
    setExportando(true);
    try {
      await exportarParticipantesExcel(lista);
      toast.success(`${lista.length} participantes exportados`);
    } catch (e) {
      console.error(e);
      toast.error("Falha ao exportar Excel");
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className="space-y-4">
      {showCadastro ? (
        <CadastroParticipante
          onCadastrado={() => { setShowCadastro(false); load(); }}
          onCancelar={() => setShowCadastro(false)}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowCadastro(true)} className="bg-laranja hover:bg-laranja-dark">
            <UserPlus size={16} /> Cadastrar novo participante
          </Button>
          <Button
            onClick={exportar}
            disabled={exportando || lista.length === 0}
            variant="outline"
            className="border-verde text-verde hover:bg-verde/10"
          >
            <FileSpreadsheet size={16} />
            {exportando ? "Exportando..." : "Exportar para Excel"}
          </Button>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 className="display text-xl text-verde">
            PARTICIPANTES <span className="text-sm font-normal text-muted-foreground">({lista.length})</span>
          </h2>
          <Input placeholder="Filtrar..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full max-w-xs" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Nome</th>
                <th className="py-2">Telefone</th>
                <th className="py-2">CPF</th>
                <th className="py-2 text-right">Pontos</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtrada.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 font-semibold">{p.nome}</td>
                  <td className="py-2">{formatarTel(p.telefone)}</td>
                  <td className="py-2">{formatarCpf(p.cpf)}</td>
                  <td className="py-2 text-right font-bold text-laranja">{p.pontos_total}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => excluir(p.id)} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtrada.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Nenhum participante.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
