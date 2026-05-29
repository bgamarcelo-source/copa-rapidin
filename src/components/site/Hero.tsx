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

  const heroImg = banners[idx]?.imagem_url ?? asset("/banner-principal.png");

  return (
    <section id="inicio" className="relative bg-laranja">
      <div className="relative mx-auto max-w-6xl">
        <img
          src={heroImg}
          alt="Promoção Chute ao Gol Rapidin · Se travou não é Rapidin"
          className="block h-auto w-full"
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
    </section>
  );
}
