import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "rapidin_cookie_consent_v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // sem localStorage (modo privado restrito) — não mostra
    }
  }, []);

  function aceitar() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-laranja bg-white shadow-2xl">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs text-foreground sm:text-sm">
          Usamos cookies essenciais para o funcionamento da página e para entender como você interage com a campanha.
          Ao continuar, você concorda com nossa{" "}
          <Link to="/privacidade" className="font-bold text-laranja hover:underline">Política de Privacidade</Link>{" "}
          e com o{" "}
          <Link to="/regulamento" className="font-bold text-laranja hover:underline">Regulamento da promoção</Link>.
        </p>
        <button
          onClick={aceitar}
          className="shrink-0 rounded-full bg-laranja px-5 py-2 text-sm font-bold text-white shadow hover:bg-laranja-dark"
        >
          Aceitar e continuar
        </button>
      </div>
    </div>
  );
}
