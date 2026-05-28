import { Instagram, Facebook, Globe, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-laranja text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="display text-2xl">+rapidin</div>
          <p className="mt-2 text-sm opacity-90">Internet rápida pra sua casa, sua família e sua torcida.</p>
        </div>
        <div>
          <div className="mb-2 text-sm font-bold uppercase">Siga a Rapidin</div>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Instagram size={18} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Facebook size={18} /></a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><MessageCircle size={18} /></a>
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-bold uppercase">Acesse</div>
          <a href="https://rapidin.com.br" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:underline">
            <Globe size={16} /> rapidin.com.br
          </a>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} Rapidin Internet · Promoção de Chute ao Gol · Balsas/MA
      </div>
    </footer>
  );
}
