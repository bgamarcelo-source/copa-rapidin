import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Undo2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { formatarCpf, formatarTel, limparTel } from "@/lib/validators";
import { CadastroParticipante } from "./CadastroParticipante";

type EventoComPart = {
  id: string;
  participante_id: string;
  pontos: number;
  local: string;
  data: string;
  created_at: string;
  participante?: Participante;
};

export function LancarPontos({ userId }: { userId: string }) {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Participante[]>([]);
  const [selecionado, setSelecionado] = useState<Participante | null>(null);
  const [pontos, setPontos] = useState<number>(1);
  const [local, setLocal] = useState<"santo_antonio" | "fanfest" | "outro">("santo_antonio");
  const [historico, setHistorico] = useState<EventoComPart[]>([]);
  const [showCadastro, setShowCadastro] = useState(false);

  async function buscar(q: string) {
    setBusca(q);
    if (q.trim().length < 2) return setResultados([]);
    const termo = q.trim();
    const tel = limparTel(termo);
    const orFilters = [`nome.ilike.%${termo}%`];
    if (tel.length >= 3) orFilters.push(`telefone.ilike.%${tel}%`);
    if (/^\d+$/.test(termo.replace(/[.\-\s]/g, ""))) orFilters.push(`cpf.ilike.%${termo.replace(/\D/g, "")}%`);
    const { data } = await supabase
      .from("participantes")
      .select("*")
      .or(orFilters.join(","))
      .limit(10);
    setResultados(data ?? []);
  }

  async function carregarHistorico() {
    const { data } = await supabase
      .from("eventos_pontuacao")
      .select("*, participante:participantes(*)")
      .order("created_at", { ascending: false })
      .limit(10);
    setHistorico((data as EventoComPart[]) ?? []);
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function lancar() {
    if (!selecionado) return toast.error("Selecione um participante");
    if (pontos <= 0) return toast.error("Pontos precisam ser > 0");
    const { error } = await supabase.from("eventos_pontuacao").insert({
      participante_id: selecionado.id,
      pontos,
      local,
      criado_por: userId,
    });
    if (error) return toast.error("Falha ao lançar: " + error.message);
    toast.success(`+${pontos} ponto(s) para ${selecionado.nome}`);
    setPontos(1);
    setBusca("");
    setSelecionado(null);
    setResultados([]);
    carregarHistorico();
  }

  async function desfazer(id: string) {
    if (!confirm("Tem certeza que quer desfazer essa pontuação?")) return;
    const { error } = await supabase.from("eventos_pontuacao").delete().eq("id", id);
    if (error) return toast.error("Falha ao desfazer");
    toast.success("Pontuação revertida");
    carregarHistorico();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4 rounded-2xl bg-white p-5 shadow">
        <h2 className="display text-xl text-verde">LANÇAR PONTOS</h2>

        {!selecionado ? (
          <>
            <div>
              <Label>Buscar participante</Label>
              <Input
                value={busca}
                onChange={(e) => buscar(e.target.value)}
                placeholder="Nome, telefone ou CPF"
                autoFocus
              />
            </div>
            {resultados.length > 0 && (
              <div className="rounded-xl border bg-secondary/20">
                {resultados.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelecionado(p)}
                    className="flex w-full items-center justify-between border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-secondary"
                  >
                    <div>
                      <div className="font-bold">{p.nome}</div>
                      <div className="text-xs text-muted-foreground">{formatarTel(p.telefone)} · {formatarCpf(p.cpf)}</div>
                    </div>
                    <div className="text-xs font-bold text-laranja">{p.pontos_total} pts</div>
                  </button>
                ))}
              </div>
            )}
            {busca.length >= 2 && resultados.length === 0 && !showCadastro && (
              <div className="rounded-xl border-2 border-dashed border-laranja/40 bg-laranja/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Nenhum participante encontrado.</p>
                <Button
                  type="button"
                  onClick={() => setShowCadastro(true)}
                  className="mt-3 bg-laranja hover:bg-laranja-dark"
                >
                  <UserPlus size={16} /> Cadastrar "{busca}" agora
                </Button>
              </div>
            )}

            {showCadastro && (
              <CadastroParticipante
                nomeInicial={busca}
                onCadastrado={(novo) => {
                  setShowCadastro(false);
                  setSelecionado(novo);
                  setBusca("");
                  setResultados([]);
                }}
                onCancelar={() => setShowCadastro(false)}
              />
            )}
          </>
        ) : (
          <>
            <div className="rounded-xl bg-laranja/10 p-3">
              <div className="font-bold">{selecionado.nome}</div>
              <div className="text-xs text-muted-foreground">{formatarTel(selecionado.telefone)} · {selecionado.pontos_total} pts atuais</div>
              <button onClick={() => setSelecionado(null)} className="mt-1 text-xs font-bold text-laranja hover:underline">trocar</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Pontos</Label>
                <Input
                  type="number"
                  min={1}
                  value={pontos}
                  onChange={(e) => setPontos(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-xl font-bold"
                />
              </div>
              <div>
                <Label>Local</Label>
                <select
                  value={local}
                  onChange={(e) => setLocal(e.target.value as "santo_antonio" | "fanfest" | "outro")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="santo_antonio">Santo Antônio</option>
                  <option value="fanfest">FanFest</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <Button onClick={lancar} className="w-full bg-laranja text-lg hover:bg-laranja-dark">
              Lançar +{pontos} ponto{pontos > 1 ? "s" : ""}
            </Button>
          </>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow">
        <h3 className="mb-3 font-bold text-verde">Últimas 10 lançadas</h3>
        <div className="space-y-2">
          {historico.length === 0 && <p className="text-sm text-muted-foreground">Nada lançado ainda.</p>}
          {historico.map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-lg border bg-secondary/20 p-2 text-xs">
              <div>
                <div className="font-bold">{h.participante?.nome ?? "—"}</div>
                <div className="text-muted-foreground">+{h.pontos} · {h.local}</div>
              </div>
              <button onClick={() => desfazer(h.id)} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Desfazer">
                <Undo2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
