import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Link } from "@tanstack/react-router";

export function PaginaLegal({ titulo, atualizadoEm, children }: { titulo: string; atualizadoEm: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/" className="mb-4 inline-block text-xs font-bold text-laranja hover:underline">← Voltar para a campanha</Link>
        <h1 className="display mb-2 text-3xl text-verde md:text-4xl">{titulo}</h1>
        <p className="mb-8 text-xs text-muted-foreground">Última atualização: {atualizadoEm}</p>
        <article className="space-y-4 text-sm leading-relaxed text-foreground [&_h2]:display [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:text-verde [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
