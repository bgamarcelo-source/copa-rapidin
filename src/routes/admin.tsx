import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGate } from "@/components/admin/AuthGate";
import { LancarPontos } from "@/components/admin/LancarPontos";
import { ParticipantesAdmin } from "@/components/admin/Participantes";
import { BairrosAdmin } from "@/components/admin/Bairros";
import { BannersAdmin } from "@/components/admin/Banners";
import { GaleriaAdmin } from "@/components/admin/Galeria";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { LogOut, Target, Users, MapPin, Image as ImageIcon, Camera } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin · Rapidin" }] }),
  component: AdminPage,
});

type Aba = "lancar" | "participantes" | "bairros" | "banners" | "galeria";

const abas: { id: Aba; titulo: string; icon: typeof Target }[] = [
  { id: "lancar", titulo: "Lançar pontos", icon: Target },
  { id: "participantes", titulo: "Participantes", icon: Users },
  { id: "bairros", titulo: "Bairros", icon: MapPin },
  { id: "banners", titulo: "Banners", icon: ImageIcon },
  { id: "galeria", titulo: "Galeria", icon: Camera },
];

function AdminPage() {
  return (
    <AuthGate>
      {(user) => <AdminInner userId={user.id} email={user.email} />}
    </AuthGate>
  );
}

function AdminInner({ userId, email }: { userId: string; email: string }) {
  const [aba, setAba] = useState<Aba>("lancar");

  return (
    <div className="min-h-screen bg-secondary/30">
      <Toaster position="top-right" richColors />
      <header className="bg-laranja text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <div className="display text-xl">PAINEL RAPIDIN</div>
            <div className="text-xs opacity-80">{email}</div>
          </div>
          <Button onClick={() => supabase.auth.signOut()} variant="outline" size="sm" className="bg-white/10 text-white">
            <LogOut size={14} /> Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2 border-b">
          {abas.map(({ id, titulo, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`-mb-px flex items-center gap-1 border-b-2 px-3 py-2 text-sm font-bold transition ${
                aba === id ? "border-laranja text-laranja" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={16} /> {titulo}
            </button>
          ))}
        </div>

        {aba === "lancar" && <LancarPontos userId={userId} />}
        {aba === "participantes" && <ParticipantesAdmin />}
        {aba === "bairros" && <BairrosAdmin />}
        {aba === "banners" && <BannersAdmin />}
        {aba === "galeria" && <GaleriaAdmin />}
      </div>
    </div>
  );
}
