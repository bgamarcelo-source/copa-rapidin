import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Bairro } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  formatarCpf,
  formatarTel,
  limparCpf,
  limparTel,
  validarCpf,
  validarTel,
} from "@/lib/validators";

export const Route = createFileRoute("/participar")({
  head: () => ({ meta: [{ title: "Cadastro · Rapidin Chute ao Gol" }] }),
  component: Participar,
});

function Participar() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [novoBairro, setNovoBairro] = useState("");
  const [showNovoBairro, setShowNovoBairro] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", cpf: "", bairro_id: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ tipo: "ok" | "erro" | "duplicado"; msg: string } | null>(null);

  useEffect(() => {
    supabase
      .from("bairros")
      .select("*")
      .order("nome")
      .then(({ data }) => data && setBairros(data));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (form.nome.trim().length < 3) return setStatus({ tipo: "erro", msg: "Digite seu nome completo." });
    if (!validarTel(form.telefone)) return setStatus({ tipo: "erro", msg: "Telefone inválido." });
    if (!validarCpf(form.cpf)) return setStatus({ tipo: "erro", msg: "CPF inválido." });

    let bairroId = form.bairro_id;

    if (showNovoBairro) {
      if (novoBairro.trim().length < 2) return setStatus({ tipo: "erro", msg: "Digite o nome do bairro." });
      const { data: bairroExistente } = await supabase
        .from("bairros")
        .select("id")
        .ilike("nome", novoBairro.trim())
        .maybeSingle();
      if (bairroExistente) {
        bairroId = bairroExistente.id;
      } else {
        const { data: novo, error: erroBairro } = await supabase
          .from("bairros")
          .insert({ nome: novoBairro.trim() })
          .select("id")
          .single();
        if (erroBairro || !novo) {
          return setStatus({ tipo: "erro", msg: "Não consegui cadastrar o bairro. Tenta de novo." });
        }
        bairroId = novo.id;
      }
    }

    if (!bairroId) return setStatus({ tipo: "erro", msg: "Selecione seu bairro." });

    setLoading(true);
    const { error } = await supabase.from("participantes").insert({
      nome: form.nome.trim(),
      telefone: limparTel(form.telefone),
      cpf: limparCpf(form.cpf),
      bairro_id: bairroId,
    });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        return setStatus({ tipo: "duplicado", msg: "Você já está cadastrado! Vai lá no estande dar seus chutes." });
      }
      return setStatus({ tipo: "erro", msg: "Algo deu errado. Tenta de novo em instantes." });
    }

    setStatus({ tipo: "ok", msg: "Pronto! Procure o atendente Rapidin pra começar a chutar." });
    setForm({ nome: "", telefone: "", cpf: "", bairro_id: "" });
    setNovoBairro("");
    setShowNovoBairro(false);
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="display mb-1 text-3xl text-verde">CADASTRO</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Preenche aí pra entrar no jogo. Depois é só procurar o atendente Rapidin no estande.
          </p>

          {status?.tipo === "ok" && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-verde/10 p-3 text-sm text-verde">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-bold">Cadastro confirmado!</div>
                <div>{status.msg}</div>
                <Link to="/" className="mt-2 inline-block text-xs font-bold underline">Voltar pra home</Link>
              </div>
            </div>
          )}

          {status?.tipo === "duplicado" && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amarelo/20 p-3 text-sm text-foreground">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-laranja" />
              <div>{status.msg}</div>
            </div>
          )}

          {status?.tipo === "erro" && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>{status.msg}</div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formatarTel(form.telefone)}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(99) 99999-9999"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formatarCpf(form.cpf)}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                placeholder="000.000.000-00"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro</Label>
              {!showNovoBairro ? (
                <>
                  <select
                    id="bairro"
                    value={form.bairro_id}
                    onChange={(e) => setForm({ ...form, bairro_id: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
                    required
                  >
                    <option value="">Selecione seu bairro</option>
                    {bairros.map((b) => (
                      <option key={b.id} value={b.id}>{b.nome}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNovoBairro(true)}
                    className="mt-1 text-xs font-bold text-laranja hover:underline"
                  >
                    Meu bairro não está na lista
                  </button>
                </>
              ) : (
                <div className="space-y-1">
                  <Input
                    value={novoBairro}
                    onChange={(e) => setNovoBairro(e.target.value)}
                    placeholder="Digite o nome do seu bairro"
                    required
                  />
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

            <Button type="submit" disabled={loading} className="w-full bg-laranja hover:bg-laranja-dark">
              {loading ? "Enviando..." : "Quero participar"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
