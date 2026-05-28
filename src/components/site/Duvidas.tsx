import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faq = [
  {
    q: "Quem pode participar?",
    a: "Todo mundo, cliente ou não cliente da Rapidin. Novos assinantes ganham chances extras.",
  },
  {
    q: "Quando começa e quando termina?",
    a: "Começa em 01 de junho e vai até o Brasil ser eliminado da Copa. Vamos torcer pela final!",
  },
  {
    q: "Onde participo?",
    a: "Na Festa de Santo Antônio (toda noite) e na FanFest nos dias de jogo do Brasil — Praça da Matriz, Balsas.",
  },
  {
    q: "Como ganho pontos?",
    a: "Acertando chutes a gol no estande da Rapidin. Cada chute vira pontos no seu cadastro.",
  },
  {
    q: "Quais são os prêmios?",
    a: "1º Smart TV 55” + 1 ano de internet + Premiere · 2º Tablet Android + 6 meses de internet · 3º Kit Copa Rapidin (camisa + 2 copos).",
  },
];

export function Duvidas() {
  return (
    <section id="duvidas" className="bg-secondary/40 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="display mb-6 text-center text-3xl text-verde md:text-4xl">DÚVIDAS FREQUENTES</h2>
        <Accordion type="single" collapsible className="rounded-2xl bg-white px-4 shadow-sm">
          {faq.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left text-sm font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
