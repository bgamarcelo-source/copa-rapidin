import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-laranja text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wide">+rapidin</span>
          <span className="hidden text-xs uppercase opacity-80 sm:inline">internet</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#inicio" className="text-sm font-semibold hover:underline">Início</a>
          <a href="#ranking" className="text-sm font-semibold hover:underline">Rankings</a>
          <a href="#atletas" className="text-sm font-semibold hover:underline">Atletas</a>
          <a href="#como-funciona" className="text-sm font-semibold hover:underline">Como Funciona</a>
          <a href="#premiacoes" className="text-sm font-semibold hover:underline">Premiações</a>
          <a href="#duvidas" className="text-sm font-semibold hover:underline">Dúvidas</a>
        </nav>

        <a
          href="https://rapidin.com.br"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full bg-white px-5 py-2 text-sm font-bold text-laranja shadow hover:bg-amarelo md:inline-block"
        >
          Contrate já
        </a>

        <button
          aria-label="Menu"
          className="rounded-md p-1 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/20 bg-laranja-dark md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            <a href="#inicio" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold">Início</a>
            <a href="#ranking" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold">Rankings</a>
            <a href="#atletas" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold">Atletas</a>
            <a href="#como-funciona" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold">Como Funciona</a>
            <a href="#premiacoes" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold">Premiações</a>
            <a href="#duvidas" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold">Dúvidas</a>
            <a
              href="https://rapidin.com.br"
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-white px-5 py-2 text-center text-sm font-bold text-laranja"
            >
              Contrate já
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
