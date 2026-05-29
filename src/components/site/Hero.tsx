import { useEffect, useState } from "react";
import { supabase, type Banner } from "@/lib/supabase";
import { asset } from "@/lib/assets";

export function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("banners")
      .select("*")
      .eq("ativo", true)
      .order("ordem")
      .then(({ data }) => data && setBanners(data));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  // Imagem hero: banner customizado do admin (se houver) ou o banner oficial da campanha
  const heroImg = banners[idx]?.imagem_url ?? asset("/banner-principal.png");

  return (
    <section id="inicio" className="relative overflow-hidden bg-laranja">
      {/* Banner full-width — mascote + slogan já compostos na arte oficial */}
      <div className="relative">
        <img
          src={heroImg}
          alt="Do Arraiá pro Gol é Rapidin"
          className="block h-auto w-full object-cover"
        />

        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-2 bg-white/60"}`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Faixa abaixo do banner: slogan + CTAs */}
      <div className="grad-copa relative px-4 py-8 text-center text-white md:py-12">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">
            Promoção de Chute ao Gol · 01/jun até a final
          </div>
          <h1 className="display text-4xl leading-[0.95] md:text-6xl">
            SE TRAVOU NÃO É <span className="text-amarelo drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)]">RAPIDIN!</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium opacity-95 md:text-lg">
            A conexão que manda bem dentro e fora de campo. Vem chutar a gol e concorrer a prêmios incríveis.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://rapidin.com.br"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-laranja shadow-lg hover:bg-amarelo"
            >
              Quero minha internet
            </a>
            <a
              href="#ranking"
              className="rounded-full border-2 border-white px-7 py-3 text-sm font-bold text-white hover:bg-white hover:text-laranja"
            >
              Ver ranking
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
