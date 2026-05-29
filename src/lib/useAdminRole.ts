import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AdminRole = "master" | "promotora";

/**
 * Retorna o role do admin logado.
 * - "master" = acesso total (inclui exportar Excel)
 * - "promotora" = uso operacional (sem exportar Excel)
 * - null = ainda carregando / não logado / não é admin
 */
export function useAdminRole(): { role: AdminRole | null; loading: boolean } {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        if (!cancelado) {
          setRole(null);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("admins")
        .select("role")
        .eq("user_id", uid)
        .maybeSingle();
      if (cancelado) return;
      setRole((data?.role as AdminRole) ?? null);
      setLoading(false);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  return { role, loading };
}
