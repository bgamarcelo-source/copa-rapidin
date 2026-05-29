import { useEffect, useState } from "react";
import { supabase, type Participante } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Undo2, UserPlus, Trophy, ShieldOff, UserCheck, Receipt, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatarCpf, formatarTel, limparTel } from "@/lib/validators";
import { CadastroParticipante } from "./CadastroParticipante";

type TipoPonto = "vitoria" | "derrota" | "novo_assinante" | "boleto_julho" | "outro";

type EventoComPart = {
  id: string;
  participante_id: string;
  pontos: number;
  local: string;
  tipo: TipoPonto;
  data: string;
  created_at: string;
  participante?: Participante;
};

const TIPOS: { id: TipoPonto; label: string; pontos: number; icon: typeof Trophy; cor: string }[] = [
  { id: "vitoria", label: "Ganhou chute", pontos: 2, icon: Trophy, cor: "bg-amarelo text-laranja-dark" },
  { id: "derrota", label: "Perdeu chute", pontos: 1, icon: ShieldOff, cor: "bg-laranja text-white" },
  { id: "novo_assinante", label: "Novo assinante", pontos: 1, icon: UserCheck, cor: "bg-verde text-white" },
  { id: "boleto_julho", label: "Boleto julho em dia", pontos: 1, icon: Receipt, cor: "bg-verde text-white" },
];

const TIPO_LABEL: Record<TipoPonto, string> = {
  vitoria: "Ganhou chute",
  derrota: "Perdeu chute",
  novo_assinante: "Novo assinante",
  boleto_julho: "Boleto julho",
  outro: "Outro",
};

export function LancarPontos({ userId }: { userId: string }) {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Participante[]>([]);
  const [selecionado, setSelecionado] = useState<Participante | null>(null);
  const [pontosCustom, setPontosCustom] = useState<number>(1);
  const [local, setLocal] = useState<"santo_antonio" | "fanfest" | "outro">("santo_antonio");
  const [historico, setHistorico] = useState<EventoComPart[]>([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [modoCustom, setModoCustom] = useState(false);

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

  async function lancarTipo(tipo: TipoPonto, pontos: number) {
    if (!selecionado) return toast.error("Selecione um participante");
    if (pontos <= 0) return toast.error("Pontos precisam ser > 0");
    const { error } = await supabase.from("eventos_pontuacao").insert({
      participante_id: selecionado.id,
      pontos,
      local,
      tipo,
      criado_por: userId,
    });
    if (error) {
      console.error("[LancarPontos] insert", error);
      return toast.error("Falha ao lançar: " + error.message);
    }
    toast.success(`+${pontos} ${TIPO_LABEL[tipo]} para ${selecionado.nome}`);
    setPontosCustom(1);
    setBusca("");
    setSelecionado(null);
    setResultados([]);
    setModoCustom(false);
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
              <button onClick={() => { setSelecionado(null); setModoCustom(false); }} className="mt-1 text-xs font-bold text-laranja hover:underline">trocar</button>
            </div>

            <div>
              <Label className="mb-2 block">Local</Label>
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

            {!modoCustom ? (
              <>
                <Label className="mb-2 block">Tipo de pontuação</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TIPOS.map(({ id, label, pontos, icon: Icon, cor }) => (
                    <button
                      key={id}
                      onClick={() => lancarTipo(id, pontos)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-left shadow-sm transition hover:scale-[1.02] hover:shadow-md ${cor}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={18} />
                        <span className="text-sm font-bold">{label}</span>
                      </div>
                      <span className="text-lg font-bold">+{pontos}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setModoCustom(true)}
                  className="w-full rounded-xl border-2 border-dashed border-muted-foreground/30 px-4 py-3 text-sm font-bold text-muted-foreground hover:border-laranja hover:text-laranja"
                >
                  <Plus size={14} className="inline" /> Lançar quantidade personalizada
                </button>
              </>
            ) : (
              <>
                <div>
                  <Label>Pontos (personalizado)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={pontosCustom}
                    onChange={(e) => setPontosCustom(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-xl font-bold"
                    autoFocus
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button onClick={() => lancarTipo("outro", pontosCustom)} className="bg-laranja text-lg hover:bg-laranja-dark">
                    Lançar +{pontosCustom} ponto{pontosCustom > 1 ? "s" : ""}
                  </Button>
                  <Button onClick={() => setModoCustom(false)} variant="outline">
                    Voltar
                  </Button>
                </div>
              </>
            )}
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
                <div className="text-muted-foreground">+{h.pontos} · {TIPO_LABEL[h.tipo] ?? h.tipo}</div>
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
