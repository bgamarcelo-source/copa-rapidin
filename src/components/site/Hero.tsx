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

  // Se admin subiu banner customizado, mostra ele em destaque (full width)
  if (banners.length > 0) {
    return (
      <section id="inicio" className="relative overflow-hidden bg-verde-dark">
        <div className="relative">
          <img
            src={banners[idx].imagem_url}
            alt=""
            className="h-auto w-full object-cover"
          />
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-2 bg-white/50"}`}
                  aria-label={`Banner ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 md:pb-6">
          <a
            href="https://rapidin.com.br"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-laranja shadow-lg hover:bg-amarelo"
          >
            Quero minha internet
          </a>
        </div>
      </section>
    );
  }

  // Hero default — gradiente + texto + mascote brasil02 sozinho
  return (
    <section id="inicio" className="relative overflow-hidden grad-copa text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:gap-8 md:py-16">
        <div className="text-center md:text-left">
          <div className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">
            Promoção de Chute ao Gol
          </div>
          <h1 className="display text-5xl leading-[0.95] md:text-7xl">
            SE TRAVOU<br />
            NÃO É <span className="text-amarelo drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)]">RAPIDIN!</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base font-medium opacity-95 md:mx-0 md:text-lg">
            A conexão que manda bem dentro e fora de campo. Vem chutar a gol e concorrer a prêmios incríveis.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="https://rapidin.com.br"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-laranja shadow hover:bg-amarelo"
            >
              Quero minha internet
            </a>
            <a
              href="#ranking"
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-laranja"
            >
              Ver ranking
            </a>
          </div>
        </div>

        <div className="relative flex items-end justify-center md:justify-end">
          <img
            src={asset("/assets/mascote/mascote-brasil02.png")}
            alt="Mascote Rapidin"
            className="h-auto w-[260px] drop-shadow-[0_25px_30px_rgba(0,0,0,0.35)] sm:w-[320px] md:w-[380px] lg:w-[440px]"
          />
        </div>
      </div>
    </section>
  );
}
