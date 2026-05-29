import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Promete um valor; se demorar mais que ms, lança erro
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout ${label} (${ms}ms)`)), ms)),
  ]);
}

export function AuthGate({ children }: { children: (user: { id: string; email: string }) => React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function checkSession() {
    console.log("[AuthGate] checkSession start");
    try {
      const { data } = await withTimeout(supabase.auth.getSession(), 8000, "getSession");
      console.log("[AuthGate] getSession ->", data.session?.user?.email ?? "no session");
      if (data.session?.user) {
        const u = { id: data.session.user.id, email: data.session.user.email ?? "" };
        setUser(u);
        try {
          const { data: adm, error } = await withTimeout(
            supabase.from("admins").select("user_id").eq("user_id", u.id).maybeSingle(),
            8000,
            "admins"
          );
          if (error) console.error("[AuthGate] admins query error", error);
          console.log("[AuthGate] is admin?", !!adm);
          setIsAdmin(!!adm);
        } catch (e) {
          console.error("[AuthGate] admin check falhou", e);
          setIsAdmin(false);
          setErro("Não consegui validar permissão de admin. Tenta de novo.");
        }
      } else {
        setUser(null);
        setIsAdmin(null);
      }
    } catch (e) {
      console.error("[AuthGate] session check falhou", e);
      setUser(null);
      setIsAdmin(null);
      setErro("Conexão com servidor de autenticação falhou. Recarregue a página.");
      try { await supabase.auth.signOut(); } catch {}
    } finally {
      console.log("[AuthGate] checkSession end -> loading=false");
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
    const { data: sub } = supabase.auth.onAuthStateChange(() => checkSession());
    return () => sub.subscription.unsubscribe();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password: senha }),
        10000,
        "signIn"
      );
      if (error) {
        console.error("[AuthGate] login error", error);
        setErro(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      }
    } catch (e) {
      console.error("[AuthGate] login timeout/falha", e);
      setErro("Conexão com servidor demorou demais. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40">
        <Loader2 className="animate-spin text-laranja" size={32} />
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
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
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
