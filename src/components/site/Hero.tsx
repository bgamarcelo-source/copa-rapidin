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

  return (
    <section id="inicio" className="relative overflow-hidden grad-copa text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="display text-4xl leading-tight md:text-6xl">
            SE TRAVOU<br />
            <span className="text-white">NÃO É</span> <span className="text-amarelo drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">RAPIDIN!</span>
          </h1>
          <p className="mt-4 max-w-md text-lg font-medium opacity-95">
            A conexão que manda bem dentro e fora de campo. Participe da promoção de Chute ao Gol e concorra a prêmios incríveis.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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

        <div className="relative flex justify-center">
          {banners[idx] ? (
            <img
              src={banners[idx].imagem_url}
              alt=""
              className="max-h-[460px] w-auto rounded-2xl object-contain shadow-2xl"
            />
          ) : (
            <div className="relative">
              <img
                src={asset("/banner-principal.png")}
                alt=""
                className="max-h-[420px] w-auto rounded-2xl object-contain opacity-90"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <img
                src={asset("/assets/mascote/Mascote-Rapidin-copa.png")}
                alt="Mascote Rapidin"
                className="absolute -bottom-4 left-1/2 max-h-[480px] w-auto -translate-x-1/2 object-contain drop-shadow-2xl"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
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
      </div>
    </section>
  );
}
