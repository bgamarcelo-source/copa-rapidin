import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Etapa = "iniciando" | "session" | "admins" | "pronto" | "erro";

function withTimeout<T>(p: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout em ${label} (${ms}ms)`)), ms)),
  ]);
}

function limparTudoElogar() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith("sb-")).forEach((k) => localStorage.removeItem(k));
  } catch {}
  try {
    Object.keys(sessionStorage).filter((k) => k.startsWith("sb-")).forEach((k) => sessionStorage.removeItem(k));
  } catch {}
  location.reload();
}

export function AuthGate({ children }: { children: (user: { id: string; email: string }) => React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [etapa, setEtapa] = useState<Etapa>("iniciando");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function checkSession() {
    setEtapa("session");
    console.log("[AuthGate] verificando sessão");
    try {
      const { data } = await withTimeout(supabase.auth.getSession(), 5000, "getSession");
      console.log("[AuthGate] sessão:", data.session?.user?.email ?? "nenhuma");
      if (data.session?.user) {
        const u = { id: data.session.user.id, email: data.session.user.email ?? "" };
        setUser(u);
        setEtapa("admins");
        try {
          const { data: adm, error } = await withTimeout(
            supabase.from("admins").select("user_id").eq("user_id", u.id).maybeSingle(),
            5000,
            "admins"
          );
          if (error) console.error("[AuthGate] admins error", error);
          console.log("[AuthGate] é admin?", !!adm);
          setIsAdmin(!!adm);
        } catch (e) {
          console.error("[AuthGate] admin check falhou", e);
          setIsAdmin(false);
          setErro("Não consegui validar permissão de admin.");
        }
      } else {
        setUser(null);
        setIsAdmin(null);
      }
      setEtapa("pronto");
    } catch (e) {
      console.error("[AuthGate] session check falhou", e);
      setUser(null);
      setIsAdmin(null);
      setEtapa("erro");
      setErro("Sessão local corrompida ou servidor de autenticação fora do ar.");
    } finally {
      console.log("[AuthGate] loading=false");
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      console.log("[AuthGate] auth event:", event);
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") checkSession();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password: senha }),
        8000,
        "signIn"
      );
      if (error) {
        console.error("[AuthGate] login error", error);
        setErro(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      }
    } catch (e) {
      console.error("[AuthGate] login timeout", e);
      setErro("Conexão demorou demais. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/40 p-4">
        <Loader2 className="animate-spin text-laranja" size={32} />
        <p className="text-sm text-muted-foreground">
          {etapa === "iniciando" && "Iniciando..."}
          {etapa === "session" && "Verificando sessão..."}
          {etapa === "admins" && "Verificando permissão..."}
          {etapa === "pronto" && "Carregando painel..."}
          {etapa === "erro" && "Algo deu errado."}
        </p>
        <button
          onClick={limparTudoElogar}
          className="mt-4 rounded-md border border-input bg-white px-3 py-1 text-xs font-medium hover:bg-secondary"
        >
          Travou? Limpar cache e recarregar
        </button>
      </div>
    );
  }

  if (etapa === "erro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-secondary/40 p-4 text-center">
        <p className="text-lg font-bold text-destructive">Falha ao carregar o painel</p>
        <p className="max-w-sm text-sm text-muted-foreground">{erro}</p>
        <Button onClick={limparTudoElogar} className="bg-laranja hover:bg-laranja-dark">
          Limpar cache e recarregar
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="display mb-1 text-2xl text-verde">PAINEL RAPIDIN</h1>
          <p className="mb-6 text-sm text-muted-foreground">Entre com sua conta de administrador.</p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
            </div>
            {erro && <p className="text-sm text-destructive">{erro}</p>}
            <Button type="submit" className="w-full bg-laranja hover:bg-laranja-dark">Entrar</Button>
          </div>
        </form>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 text-center">
        <p className="mb-3 text-lg font-bold text-destructive">Sua conta não tem permissão de admin.</p>
        <p className="mb-4 text-sm text-muted-foreground">{user.email}</p>
        <Button onClick={logout} variant="outline">Sair</Button>
      </div>
    );
  }

  return <>{children(user)}</>;
}
