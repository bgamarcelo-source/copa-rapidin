import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Beneficios } from "@/components/site/Beneficios";
import { Ranking } from "@/components/site/Ranking";
import { Premios } from "@/components/site/Premios";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { Participe } from "@/components/site/Participe";
import { Galeria } from "@/components/site/Galeria";
import { Duvidas } from "@/components/site/Duvidas";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rapidin · Promoção Chute ao Gol" },
      { name: "description", content: "Participe da promoção de Chute ao Gol da Rapidin e concorra a Smart TV, Tablet e Kit Copa." },
      { property: "og:title", content: "Rapidin · Promoção Chute ao Gol" },
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
      <Premios />
      <ComoFunciona />
      <Participe />
      <Galeria />
      <Duvidas />
      <Footer />
    </div>
  );
}
