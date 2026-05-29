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

      <h2>5. Como funciona o jogo (Chute ao Gol)</h2>
      <ul>
        <li>Cada jogador senta em uma ponta do campinho, com os <strong>pés dentro do campo</strong>.</li>
        <li>Sem se levantar, o participante tenta chutar a bola e fazer gol no lado do adversário.</li>
        <li>Ao mesmo tempo, deve defender o próprio gol usando os pés para bloquear os chutes.</li>
        <li><strong>Vence quem marcar 3 (três) gols primeiro.</strong></li>
        <li><strong>É proibido:</strong> levantar do chão, usar as mãos ou sair do próprio lado do campo. O descumprimento desclassifica o jogador da partida.</li>
        <li>Não há limite de partidas por participante — você pode jogar o quanto conseguir e quantas vezes aguentar.</li>
      </ul>

      <h2>6. Pontuação</h2>
      <p>Os pontos são <strong>cumulativos</strong> ao longo de toda a promoção e podem ser obtidos das seguintes formas:</p>
      <ul>
        <li><strong>2 pontos</strong> — vencer uma partida de Chute ao Gol.</li>
        <li><strong>1 ponto</strong> — perder uma partida (ponto de participação).</li>
        <li><strong>1 ponto</strong> — novo assinante Rapidin durante o período da promoção.</li>
        <li><strong>1 ponto</strong> — boleto de julho pago dentro do prazo (opt-in por contrato).</li>
      </ul>
      <p>
        O Ranking da Torcida na página inicial mostra a pontuação <strong>do dia</strong> (zera todo
        amanhecer). O Top 10 Atletas mostra a pontuação <strong>acumulada</strong> de toda a promoção.
      </p>
      <p>
        <strong>Cada ponto acumulado equivale a 1 (um) número da sorte.</strong> Os números da sorte
        de cada participante serão usados para o sorteio final dos prêmios (item 8). Quanto mais pontos
        você acumular, mais números receberá e maiores serão suas chances de ganhar.
      </p>

      <h2>7. Chances extras</h2>
      <p>
        Conforme item 6, dois movimentos garantem pontos extras (e, portanto, mais números da sorte)
        sem precisar disputar partidas adicionais:
      </p>
      <ul>
        <li><strong>1 ponto extra</strong> para cada novo assinante que contratar qualquer plano Rapidin durante o período da promoção.</li>
        <li><strong>1 ponto extra</strong> para clientes ativos cujo boleto de julho seja pago dentro do prazo (mediante opt-in por contrato).</li>
      </ul>

      <h2>8. Prêmios</h2>
      <ul>
        <li><strong>1º Prêmio:</strong> Smart TV 55" + 1 ano de internet 1000 Mbps + assinatura Premiere.</li>
        <li><strong>2º Prêmio:</strong> Tablet Android + 6 meses de internet 700 Mbps.</li>
        <li><strong>3º Prêmio:</strong> Kit Copa Rapidin (1 camisa oficial + 2 copos comemorativos).</li>
      </ul>
      <p>*Imagens dos prêmios divulgadas são meramente ilustrativas.</p>

      <h2>9. Apuração e sorteio</h2>
      <p>
        Ao término da promoção, todos os números da sorte gerados serão submetidos a sorteio
        público para definição dos 3 ganhadores, sendo o 1º número sorteado o vencedor do 1º prêmio,
        o 2º o vencedor do 2º prêmio e o 3º o vencedor do 3º prêmio.
      </p>
      <p>
        A data, o local e a forma do sorteio serão comunicados pelos canais oficiais da Rapidin
        (Instagram, WhatsApp e site) com antecedência mínima razoável.
      </p>
      <p>
        A entrega dos prêmios ocorrerá no escritório da Rapidin em Balsas/MA, mediante agendamento e
        apresentação de documento oficial com foto.
      </p>
      <p>
        Caso o número da sorte sorteado pertença a um participante desclassificado, ausente ou
        impossibilitado de receber, será realizado um novo sorteio entre os números restantes para
        aquele prêmio.
      </p>

      <h2>10. Direito de imagem</h2>
      <p>
        Ao participar, o concorrente autoriza a Rapidin a divulgar seu nome, imagem e voz, capturados
        durante a promoção ou na entrega de prêmios, em peças publicitárias da campanha, redes sociais
        oficiais e materiais institucionais, sem ônus para a empresa, pelo prazo de <strong>12 meses</strong>
        após o encerramento.
      </p>

      <h2>11. Disposições gerais</h2>
      <ul>
        <li>Os prêmios não podem ser convertidos em dinheiro nem trocados por outros produtos.</li>
        <li>Em caso de impossibilidade de entrega do prêmio em até 90 dias após a apuração por motivo imputável ao ganhador, o prêmio será revertido para a Rapidin sem qualquer compensação.</li>
        <li>Qualquer tentativa de fraude (cadastros duplicados, falsa identidade etc.) implica desclassificação imediata.</li>
        <li>A Rapidin se reserva o direito de alterar este regulamento a qualquer momento, comunicando as alterações nesta página e em suas redes oficiais.</li>
      </ul>

      <h2>12. Foro</h2>
      <p>
        Fica eleito o foro da comarca de Balsas/MA para dirimir quaisquer questões oriundas deste
        regulamento, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
      </p>
    </PaginaLegal>
  );
}
