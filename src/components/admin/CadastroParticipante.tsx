import { useEffect, useState } from "react";
import { supabase, type Bairro, type Participante } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  formatarCpf,
  formatarTel,
  limparCpf,
  limparTel,
  validarCpf,
  validarTel,
} from "@/lib/validators";
import { toast } from "sonner";
import { UserPlus, X } from "lucide-react";

type Props = {
  /** Texto inicial — pode pré-popular o nome a partir da busca */
  nomeInicial?: string;
  /** Callback ao concluir cadastro com sucesso */
  onCadastrado?: (p: Participante) => void;
  /** Callback ao cancelar/fechar */
  onCancelar?: () => void;
};

export function CadastroParticipante({ nomeInicial = "", onCadastrado, onCancelar }: Props) {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [novoBairro, setNovoBairro] = useState("");
  const [showNovoBairro, setShowNovoBairro] = useState(false);
  const [form, setForm] = useState({ nome: nomeInicial, telefone: "", cpf: "", bairro_id: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("bairros").select("*").order("nome").then(({ data }) => data && setBairros(data));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (form.nome.trim().length < 3) return toast.error("Digite o nome completo.");
    if (!validarTel(form.telefone)) return toast.error("Telefone inválido.");
    if (!validarCpf(form.cpf)) return toast.error("CPF inválido.");

    let bairroId = form.bairro_id;

    if (showNovoBairro) {
      if (novoBairro.trim().length < 2) return toast.error("Digite o nome do bairro.");
      const { data: bairroExistente } = await supabase
        .from("bairros")
        .select("id")
        .ilike("nome", novoBairro.trim())
        .maybeSingle();
      if (bairroExistente) {
        bairroId = bairroExistente.id;
      } else {
        const { data: novo, error } = await supabase
          .from("bairros")
          .insert({ nome: novoBairro.trim() })
          .select("id")
          .single();
        if (error || !novo) return toast.error("Não consegui cadastrar o bairro.");
        bairroId = novo.id;
      }
    }

    if (!bairroId) return toast.error("Selecione um bairro.");

    setLoading(true);
    const { data, error } = await supabase
      .from("participantes")
      .insert({
        nome: form.nome.trim(),
        telefone: limparTel(form.telefone),
        cpf: limparCpf(form.cpf),
        bairro_id: bairroId,
      })
      .select("*")
      .single();
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        return toast.error("Já existe participante com esse CPF ou telefone.");
      }
      console.error("[CadastroParticipante]", error);
      return toast.error("Falha ao cadastrar: " + error.message);
    }

    toast.success(`${data.nome} cadastrado(a) com sucesso!`);
    setForm({ nome: "", telefone: "", cpf: "", bairro_id: "" });
    setNovoBairro("");
    setShowNovoBairro(false);
    onCadastrado?.(data as Participante);
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border-2 border-laranja/30 bg-laranja/5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="display flex items-center gap-2 text-lg text-verde">
          <UserPlus size={20} className="text-laranja" /> CADASTRAR PARTICIPANTE
        </h3>
        {onCancelar && (
          <button type="button" onClick={onCancelar} className="rounded-full p-1 text-muted-foreground hover:bg-secondary" aria-label="Fechar">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="adm-nome">Nome completo</Label>
          <Input id="adm-nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required autoFocus />
        </div>

        <div>
          <Label htmlFor="adm-tel">Telefone</Label>
          <Input
            id="adm-tel"
            value={formatarTel(form.telefone)}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            placeholder="(99) 99999-9999"
            inputMode="numeric"
            required
          />
        </div>

        <div>
          <Label htmlFor="adm-cpf">CPF</Label>
          <Input
            id="adm-cpf"
            value={formatarCpf(form.cpf)}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            placeholder="000.000.000-00"
            inputMode="numeric"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="adm-bairro">Bairro</Label>
          {!showNovoBairro ? (
            <>
              <select
                id="adm-bairro"
                value={form.bairro_id}
                onChange={(e) => setForm({ ...form, bairro_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                <option value="">Selecione o bairro</option>
                {bairros.map((b) => (
                  <option key={b.id} value={b.id}>{b.nome}</option>
                ))}
              </select>
              <button type="button" onClick={() => setShowNovoBairro(true)} className="mt-1 text-xs font-bold text-laranja hover:underline">
                Bairro não está na lista? Cadastrar novo.
              </button>
            </>
          ) : (
            <div className="space-y-1">
              <Input value={novoBairro} onChange={(e) => setNovoBairro(e.target.value)} placeholder="Nome do novo bairro" required />
              <button
                type="button"
                onClick={() => { setShowNovoBairro(false); setNovoBairro(""); }}
                className="text-xs font-bold text-muted-foreground hover:underline"
              >
                Escolher da lista
              </button>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-laranja hover:bg-laranja-dark">
        {loading ? "Cadastrando..." : "Cadastrar participante"}
      </Button>
    </form>
  );
}
