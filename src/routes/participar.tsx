import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
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
  const [form, setForm] = useState({ nome: "", telefone: "", cpf: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ tipo: "ok" | "erro" | "duplicado"; msg: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (form.nome.trim().length < 3) return setStatus({ tipo: "erro", msg: "Digite seu nome completo." });
    if (!validarTel(form.telefone)) return setStatus({ tipo: "erro", msg: "Telefone inválido." });
    if (!validarCpf(form.cpf)) return setStatus({ tipo: "erro", msg: "CPF inválido." });

    setLoading(true);
    const { error } = await supabase.from("participantes").insert({
      nome: form.nome.trim(),
      telefone: limparTel(form.telefone),
      cpf: limparCpf(form.cpf),
    });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        return setStatus({ tipo: "duplicado", msg: "Você já está cadastrado! Vai lá no estande dar seus chutes." });
      }
      return setStatus({ tipo: "erro", msg: "Algo deu errado. Tenta de novo em instantes." });
    }

    setStatus({ tipo: "ok", msg: "Pronto! Procure o atendente Rapidin pra começar a chutar." });
    setForm({ nome: "", telefone: "", cpf: "" });
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
