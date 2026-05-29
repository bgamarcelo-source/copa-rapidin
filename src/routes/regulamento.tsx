import { createFileRoute } from "@tanstack/react-router";
import { PaginaLegal } from "@/components/site/PaginaLegal";

export const Route = createFileRoute("/regulamento")({
  head: () => ({ meta: [{ title: "Regulamento · Promoção Chute ao Gol Rapidin" }] }),
  component: Regulamento,
});

function Regulamento() {
  return (
    <PaginaLegal titulo="REGULAMENTO DA PROMOÇÃO" atualizadoEm="29 de maio de 2026">
      <p>
        Este é o regulamento da <strong>Promoção de Chute ao Gol</strong> realizada pela Rapidin Internet
        durante a Copa do Mundo. Ao participar, você declara ter lido, compreendido e aceito integralmente
        as condições aqui descritas.
      </p>

      <h2>1. Empresa promotora</h2>
      <p>
        <strong>[REVISAR COM ADVOGADO — preencher razão social completa da Rapidin Internet, CNPJ, endereço]</strong>,
        doravante denominada "Rapidin".
      </p>

      <h2>2. Período da promoção</h2>
      <p>
        A promoção começa em <strong>01 de junho de 2026</strong> e se encerra na data em que a Seleção
        Brasileira for eliminada da Copa do Mundo de 2026, ou no dia da final caso o Brasil chegue até lá.
      </p>

      <h2>3. Quem pode participar</h2>
      <ul>
        <li>Pessoas físicas, residentes em Balsas/MA, com idade igual ou superior a <strong>18 anos</strong>.</li>
        <li>Não é necessário ser cliente Rapidin para participar.</li>
        <li>Novos assinantes do período da promoção recebem chances extras (detalhes no item 6).</li>
        <li>Funcionários da Rapidin, fornecedores envolvidos na operação e seus parentes de até 2º grau não podem participar.</li>
      </ul>

      <h2>4. Como participar</h2>
      <ol>
        <li>Procure o estande Rapidin durante a Festa de Santo Antônio (toda noite) ou na FanFest nos dias de jogo do Brasil — ambos na Praça da Matriz, Balsas/MA.</li>
        <li>Faça seu cadastro presencial ou pelo QR code do estande, informando nome completo, CPF, telefone e bairro.</li>
        <li>Participe da brincadeira de Chute ao Gol e some pontos a cada chute certeiro.</li>
        <li>Os pontos são lançados pelo atendente Rapidin diretamente na plataforma e ficam visíveis no ranking público.</li>
      </ol>

      <h2>5. Pontuação</h2>
      <ul>
        <li>Cada chute certeiro vale <strong>[REVISAR COM ADVOGADO — definir pontos por chute, número máximo de chutes por noite, regras de desempate]</strong>.</li>
        <li>O ranking da torcida na página inicial mostra a pontuação <strong>do dia</strong> e é zerado todo amanhecer.</li>
        <li>O Top 10 Atletas mostra a pontuação <strong>acumulada</strong> durante toda a promoção.</li>
        <li>A pontuação total de cada participante é usada para calcular números da sorte: quanto mais pontos, mais números o participante recebe e maiores são suas chances de ganhar.</li>
      </ul>

      <h2>6. Chances extras para novos assinantes</h2>
      <p>
        Novos clientes que contratarem qualquer plano Rapidin durante o período da promoção ganham
        <strong> [REVISAR COM ADVOGADO — definir quantos pontos/multiplicador de chances]</strong>.
      </p>

      <h2>7. Prêmios</h2>
      <ul>
        <li><strong>1º Prêmio:</strong> Smart TV 55" + 1 ano de internet 1000 Mbps + assinatura Premiere.</li>
        <li><strong>2º Prêmio:</strong> Tablet Android + 6 meses de internet 700 Mbps.</li>
        <li><strong>3º Prêmio:</strong> Kit Copa Rapidin (1 camisa oficial + 2 copos comemorativos).</li>
      </ul>
      <p>*Imagens dos prêmios divulgadas são meramente ilustrativas.</p>

      <h2>8. Apuração e entrega</h2>
      <p>
        Ao término da promoção, os 3 participantes com maior pontuação total acumulada serão declarados
        vencedores. A apuração será feita em até <strong>[REVISAR COM ADVOGADO — prazo]</strong> dias após
        o encerramento, e a entrega dos prêmios ocorrerá no escritório da Rapidin em Balsas/MA, mediante
        agendamento e apresentação de documento oficial com foto.
      </p>
      <p>
        Em caso de empate, prevalece quem tiver pontuado por mais dias distintos da promoção.
        Permanecendo o empate, prevalece o participante com cadastro mais antigo.
      </p>

      <h2>9. Direito de imagem</h2>
      <p>
        Ao participar, o concorrente autoriza a Rapidin a divulgar seu nome, imagem e voz, capturados
        durante a promoção ou na entrega de prêmios, em peças publicitárias da campanha, redes sociais
        oficiais e materiais institucionais, sem ônus para a empresa, pelo prazo de <strong>12 meses</strong>
        após o encerramento.
      </p>

      <h2>10. Disposições gerais</h2>
      <ul>
        <li>Os prêmios não podem ser convertidos em dinheiro nem trocados por outros produtos.</li>
        <li>Em caso de impossibilidade de entrega do prêmio em até 90 dias após a apuração por motivo imputável ao ganhador, o prêmio será revertido para a Rapidin sem qualquer compensação.</li>
        <li>Qualquer tentativa de fraude (cadastros duplicados, falsa identidade etc.) implica desclassificação imediata.</li>
        <li>A Rapidin se reserva o direito de alterar este regulamento a qualquer momento, comunicando as alterações nesta página e em suas redes oficiais.</li>
      </ul>

      <h2>11. Autorização SECAP/Caixa</h2>
      <p>
        <strong>[REVISAR COM ADVOGADO — verificar se a mecânica caracteriza concurso (perícia) ou sorteio.
        Se sorteio: obter Certificado de Autorização SECAP e citar número aqui. Se concurso de habilidade pura: justificar enquadramento.]</strong>
      </p>

      <h2>12. Foro</h2>
      <p>
        Fica eleito o foro da comarca de Balsas/MA para dirimir quaisquer questões oriundas deste
        regulamento, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
      </p>
    </PaginaLegal>
  );
}
