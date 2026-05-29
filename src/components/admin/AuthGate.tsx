import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: (user: { id: string; email: string }) => React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function checkSession() {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = { id: data.session.user.id, email: data.session.user.email ?? "" };
        setUser(u);
        try {
          const { data: adm } = await supabase
            .from("admins")
            .select("user_id")
            .eq("user_id", u.id)
            .maybeSingle();
          setIsAdmin(!!adm);
        } catch (e) {
          console.error("admin check falhou", e);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(null);
      }
    } catch (e) {
      console.error("session check falhou", e);
      setUser(null);
      setIsAdmin(null);
      // limpa sessão corrompida
      try { await supabase.auth.signOut(); } catch {}
    } finally {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro("E-mail ou senha incorretos.");
    setLoading(false);
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
