import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Beneficios } from "@/components/site/Beneficios";
import { Ranking } from "@/components/site/Ranking";
import { TopAtletas } from "@/components/site/TopAtletas";
import { Premios } from "@/components/site/Premios";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { Participe } from "@/components/site/Participe";
import { Galeria } from "@/components/site/Galeria";
import { Duvidas } from "@/components/site/Duvidas";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rapidin · Do Arraiá pro Gol é Rapidin" },
      { name: "description", content: "Participe da campanha Do Arraiá pro Gol é Rapidin e concorra a Smart TV, Tablet e Kit Torcedor." },
      { property: "og:title", content: "Rapidin · Do Arraiá pro Gol é Rapidin" },
      { property: "og:description", content: "Se travou, não é Rapidin! Acompanhe o ranking ao vivo da torcida." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Beneficios />
      <Ranking />
      <TopAtletas />
      <Premios />
      <ComoFunciona />
      <Participe />
      <Galeria />
      <Duvidas />
      <Footer />
      <CookieBanner />
    </div>
  );
}
