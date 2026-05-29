import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatarCpf, formatarTel } from "@/lib/validators";
import { Trash2, UserPlus, FileSpreadsheet, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { CadastroParticipante } from "./CadastroParticipante";
import {
  exportarRelatorioGeral,
  exportarRelatorioDoDia,
  type LinhaHojeExport,
} from "@/lib/exportarExcel";
import { useAdminRole } from "@/lib/useAdminRole";

function hojeEmBalsas(): string {
  // ISO yyyy-mm-dd no fuso America/Sao_Paulo (Balsas/MA é -03:00 sem DST)
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function formatarDataBR(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function ParticipantesAdmin() {
  const [lista, setLista] = useState<Participante[]>([]);
  const [filtro, setFiltro] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);
  const [exportandoGeral, setExportandoGeral] = useState(false);
  const [exportandoDia, setExportandoDia] = useState(false);
  const [dataRelatorio, setDataRelatorio] = useState<string>(hojeEmBalsas());
  const { role } = useAdminRole();
  const podeExportar = role === "master";
  const hojeIso = hojeEmBalsas();
  const ehHoje = dataRelatorio === hojeIso;

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

  async function exportarGeral() {
    if (lista.length === 0) {
      toast.error("Nenhum participante para exportar");
      return;
    }
    setExportandoGeral(true);
    try {
      await exportarRelatorioGeral(lista);
      toast.success(`Relatório geral exportado (${lista.length} participantes)`);
    } catch (e) {
      console.error(e);
      toast.error("Falha ao gerar relatório geral");
    } finally {
      setExportandoGeral(false);
    }
  }

  async function exportarDoDia() {
    if (!dataRelatorio) {
      toast.error("Escolha uma data");
      return;
    }
    setExportandoDia(true);
    try {
      // Busca todos os eventos do dia escolhido (RLS admin libera leitura)
      const { data, error } = await supabase
        .from("eventos_pontuacao")
        .select("participante_id, pontos")
        .eq("data", dataRelatorio);
      if (error) throw error;

      // Agrega por participante
      const acc = new Map<string, number>();
      for (const e of (data ?? []) as { participante_id: string; pontos: number }[]) {
        acc.set(e.participante_id, (acc.get(e.participante_id) ?? 0) + (e.pontos ?? 0));
      }

      // Cruza com participantes (nome/telefone/cpf já em memória)
      const porId = new Map(lista.map((p) => [p.id, p]));
      const linhasExport: LinhaHojeExport[] = [...acc.entries()]
        .map(([pid, pts]) => {
          const p = porId.get(pid);
          return {
            nome: p?.nome ?? "(participante removido)",
            telefone: p?.telefone ?? "",
            cpf: p?.cpf ?? "",
            pontos_hoje: pts,
          };
        })
        .sort((a, b) => b.pontos_hoje - a.pontos_hoje);

      await exportarRelatorioDoDia(linhasExport, dataRelatorio);
      if (linhasExport.length === 0) {
        toast.info(`Ninguém pontuou em ${formatarDataBR(dataRelatorio)} — relatório gerado vazio`);
      } else {
        toast.success(
          `Relatório de ${formatarDataBR(dataRelatorio)} exportado (${linhasExport.length} pessoas)`,
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Falha ao gerar relatório do dia");
    } finally {
      setExportandoDia(false);
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
          {podeExportar && (
            <>
              <Button
                onClick={exportarGeral}
                disabled={exportandoGeral || lista.length === 0}
                variant="outline"
                className="border-verde text-verde hover:bg-verde/10"
              >
                <FileSpreadsheet size={16} />
                {exportandoGeral ? "Gerando..." : "Relatório geral"}
              </Button>
              <div className="flex items-center gap-1.5 rounded-md border border-laranja/40 bg-white pl-2">
                <CalendarDays size={16} className="text-laranja" />
                <input
                  type="date"
                  value={dataRelatorio}
                  onChange={(e) => setDataRelatorio(e.target.value)}
                  max={hojeIso}
                  className="h-9 bg-transparent text-sm text-laranja outline-none"
                  aria-label="Data do relatório"
                />
                <Button
                  onClick={exportarDoDia}
                  disabled={exportandoDia || !dataRelatorio}
                  variant="ghost"
                  className="h-9 rounded-l-none border-l border-laranja/40 px-3 text-laranja hover:bg-laranja/10"
                >
                  {exportandoDia
                    ? "Gerando..."
                    : ehHoje
                      ? "Relatório do dia"
                      : `Exportar ${formatarDataBR(dataRelatorio)}`}
                </Button>
              </div>
            </>
          )}
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
