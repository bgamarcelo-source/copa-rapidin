import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faq = [
  {
    q: "Quem pode participar?",
    a: "Qualquer pessoa maior de 18 anos, residente em Balsas/MA, sendo cliente ou não da Rapidin. Novos assinantes ganham pontos extras.",
  },
  {
    q: "Quando começa e quando termina?",
    a: "Começa em 01 de junho e vai até o Brasil ser eliminado da Copa, ou até o dia da final caso a Seleção chegue lá. Vamos torcer!",
  },
  {
    q: "Onde participo?",
    a: "Na Festa de Santo Antônio (toda noite) e na FanFest nos dias de jogo do Brasil — ambos na Praça da Matriz, Balsas/MA. É só procurar o estande da Rapidin.",
  },
  {
    q: "Como funciona o jogo do Chute ao Gol?",
    a: "Você senta numa ponta do campinho com os pés dentro do campo e, sem levantar nem usar as mãos, tenta fazer gol enquanto defende o seu lado. Vence quem marcar 3 gols primeiro. Pode jogar quantas vezes quiser — não tem limite de partidas.",
  },
  {
    q: "Como ganho pontos?",
    a: "Vencer uma partida vale 2 pontos e perder vale 1 ponto (ponto de participação). Você também ganha 1 ponto ao virar novo assinante Rapidin no período e 1 ponto se o boleto de julho for pago dentro do prazo. Os pontos são cumulativos durante toda a promoção.",
  },
  {
    q: "Qual a diferença entre o Ranking da Torcida e o Top 10 Atletas?",
    a: "O Ranking da Torcida mostra a pontuação do dia e zera todo amanhecer. O Top 10 Atletas mostra a pontuação acumulada de toda a promoção, somando todos os dias.",
  },
  {
    q: "Como funciona o sorteio dos prêmios?",
    a: "Cada ponto acumulado vale 1 número da sorte. No fim da promoção é feito um sorteio para definir os 3 ganhadores. Quanto mais pontos você somar, mais números recebe e maiores são suas chances. Data, local e forma do sorteio serão avisados nos canais oficiais da Rapidin.",
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
