import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faq = [
  {
    q: "Quem pode participar?",
    a: "Participação livre para todas as idades, em todas as cidades atendidas pela Rapidin. Vale pra cliente Rapidin (ativo ou novo assinante) e também pra quem não é cliente mas vai jogar na mesa promocional. Só não podem participar funcionários da Rapidin e prestadores envolvidos na organização da campanha.",
  },
  {
    q: "Quando começa e quando termina?",
    a: "Começa em 01 de junho de 2026 e vai até o Brasil ser eliminado da competição, ou até o dia do título caso a Seleção seja campeã. Vamos torcer!",
  },
  {
    q: "Onde participo?",
    a: "Nas ativações presenciais da Rapidin, na mesa promocional oficial da campanha. Datas e locais são divulgados nos canais oficiais da Rapidin (Instagram, WhatsApp e site).",
  },
  {
    q: "Como funciona o jogo na mesa promocional?",
    a: "Você joga uma partida na mesa promocional oficial e ganha 1 ponto por participação — vencer ou perder não muda nada na pontuação. Não tem eliminação: todo mundo joga e todo mundo pontua.",
  },
  {
    q: "Quantas partidas posso jogar por dia?",
    a: "No máximo 5 partidas por dia, por participante. Depois de atingir o limite, é só voltar no dia seguinte. A organização pode pedir documento com foto pra controlar as participações. A regra existe pra dar oportunidade pra todo mundo jogar.",
  },
  {
    q: "Como ganho pontos?",
    a: "1 ponto por cada partida jogada (até 5 por dia). Cliente Rapidin com mensalidades em dia até o fim da campanha ganha + 1 ponto. Cada nova contratação Rapidin feita no período da campanha ganha + 1 ponto. Os pontos são cumulativos do começo ao fim.",
  },
  {
    q: "Qual a diferença entre o Ranking da Torcida e o Top 10 Atletas?",
    a: "O Ranking da Torcida mostra a pontuação do dia e zera todo amanhecer. O Top 10 Atletas mostra a pontuação acumulada de toda a campanha, somando todos os dias. O ranking é informativo — a posição nele não garante prêmio.",
  },
  {
    q: "Tem prêmio diário?",
    a: "Tem! Todo dia rola um sorteio entre quem jogou pelo menos uma partida naquele dia. O ganhador leva 1 camisa oficial da campanha + 1 copo oficial Rapidin. Quem ganha no dia continua concorrendo normalmente aos prêmios finais.",
  },
  {
    q: "Como funciona o sorteio dos prêmios finais?",
    a: "Cada ponto acumulado vale 1 número da sorte. No fim da campanha tem o sorteio ao vivo, feito num sistema em Google Sheets alimentado com a base oficial. Os números sorteados aparecem em tempo real durante a transmissão. Data, horário e local são divulgados nos canais oficiais.",
  },
  {
    q: "Quais são os prêmios finais?",
    a: "1º Kit Campeão Rapidin: Smart TV 55” + 1 ano de internet 1000 Mega + acesso ao Premiere · 2º Kit Conexão Rapidin: tablet 10” + 6 meses de internet 1000 Mega · 3º Kit Torcedor Rapidin: 1 camisa oficial + 2 copos oficiais.",
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
