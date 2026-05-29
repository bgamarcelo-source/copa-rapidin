import { createFileRoute } from "@tanstack/react-router";
import { PaginaLegal } from "@/components/site/PaginaLegal";

export const Route = createFileRoute("/regulamento")({
  head: () => ({ meta: [{ title: "Regulamento · Do Arraiá pro Gol é Rapidin" }] }),
  component: Regulamento,
});

function Regulamento() {
  return (
    <PaginaLegal titulo="REGULAMENTO OFICIAL DA CAMPANHA — DO ARRAIÁ PRO GOL É RAPIDIN" atualizadoEm="29 de maio de 2026">
      <h2>1. Da Campanha</h2>
      <p>
        A campanha promocional <strong>"Do Arraiá pro Gol é Rapidin"</strong> é uma ação realizada
        pela Rapidin Internet com o objetivo de promover interação, entretenimento, engajamento e
        relacionamento com seus clientes e com a comunidade das cidades atendidas pela empresa.
      </p>
      <p>
        A campanha será realizada por meio de ativações presenciais, participação em jogos na mesa
        promocional da campanha e sistema de pontuação que dará direito à geração de números da
        sorte para participação na premiação final.
      </p>

      <h2>2. Período da Campanha</h2>
      <p>A campanha terá início em <strong>01 de junho de 2026</strong>.</p>
      <p>
        O encerramento ocorrerá na data em que a Seleção Brasileira for eliminada da competição
        esportiva que motiva a campanha ou, caso a Seleção Brasileira seja campeã, na data de sua
        conquista do título.
      </p>
      <p>A data oficial de encerramento será divulgada nos canais oficiais da Rapidin.</p>

      <h2>3. Abrangência</h2>
      <p>
        A campanha é válida para <strong>todas as cidades atendidas pela Rapidin Internet</strong>
        {" "}durante o período promocional.
      </p>

      <h2>4. Quem Pode Participar</h2>
      <p>Poderão participar da campanha:</p>
      <h3>Clientes Ativos da Rapidin</h3>
      <p>
        Clientes que possuam contrato ativo e estejam com suas mensalidades quitadas até a data de
        encerramento da campanha.
      </p>
      <h3>Novos Clientes</h3>
      <p>
        Pessoas que realizarem nova contratação de serviços Rapidin durante o período da campanha e
        mantenham sua situação financeira regular até o encerramento.
      </p>
      <h3>Participantes das Ativações Presenciais</h3>
      <p>
        Pessoas que participarem das ações presenciais promovidas pela Rapidin por meio da mesa
        promocional oficial da campanha.
      </p>
      <p><strong>A participação é livre para todas as idades.</strong></p>

      <h2>5. Impedimentos</h2>
      <p>Não poderão participar:</p>
      <ul>
        <li>Funcionários da Rapidin;</li>
        <li>Prestadores de serviços diretamente envolvidos na organização e execução da campanha.</li>
      </ul>

      <h2>6. Mecânica da Campanha</h2>
      <p>A campanha será composta por um sistema de pontuação acumulativa.</p>
      <p>
        Os participantes poderão acumular pontos por meio de participação nas ativações presenciais,
        manutenção da adimplência junto à Rapidin e novas contratações.
      </p>

      <h2>7. Sistema de Pontuação</h2>
      <h3>7.1 Participação na Mesa Promocional</h3>
      <p>Cada partida realizada na mesa promocional oficial da campanha dará direito a:</p>
      <ul>
        <li><strong>01 ponto por participação.</strong></li>
      </ul>
      <p>O resultado da partida não influenciará a pontuação do participante.</p>
      <p>
        Todos os participantes receberão a mesma pontuação por partida realizada, independentemente
        de vitória ou derrota.
      </p>
      <p>Não haverá eliminação dos participantes.</p>
      <p>
        Todos poderão continuar participando e acumulando pontos ao longo da campanha, respeitando o
        limite diário estabelecido neste regulamento.
      </p>

      <h3>7.2 Limite Diário de Participação</h3>
      <p>
        Cada participante poderá realizar no máximo <strong>05 (cinco) partidas por dia</strong>.
      </p>
      <p>
        Após atingir o limite diário, o participante poderá retornar no dia seguinte para novas
        partidas, respeitando novamente o limite estabelecido.
      </p>
      <p>
        A organização poderá solicitar documento de identificação para controle e validação das
        participações.
      </p>
      <p>
        O objetivo desta regra é garantir equilíbrio competitivo, ampliar a participação do público
        e assegurar igualdade de oportunidades entre todos os participantes.
      </p>

      <h3>7.3 Clientes Adimplentes</h3>
      <p>
        Todos os clientes Rapidin que permanecerem com suas mensalidades pagas e situação regular
        até a data de encerramento da campanha receberão:
      </p>
      <ul>
        <li><strong>01 ponto adicional.</strong></li>
      </ul>

      <h3>7.4 Novas Contratações</h3>
      <p>Toda nova contratação efetivada durante o período da campanha receberá:</p>
      <ul>
        <li><strong>01 ponto adicional.</strong></li>
      </ul>

      <h2>8. Números da Sorte</h2>
      <p>Cada ponto acumulado será convertido em:</p>
      <p><strong>01 Número da Sorte</strong></p>
      <p>Exemplos:</p>
      <ul>
        <li>01 ponto = 01 número da sorte;</li>
        <li>10 pontos = 10 números da sorte;</li>
        <li>50 pontos = 50 números da sorte.</li>
      </ul>
      <p>
        Quanto mais pontos o participante acumular, maior será a quantidade de números gerados e,
        consequentemente, maiores serão suas chances de ser contemplado na apuração final.
      </p>

      <h2>9. Ranking Oficial</h2>
      <p>Durante toda a campanha será divulgado um ranking atualizado dos participantes.</p>
      <p>O ranking possui caráter informativo e de acompanhamento da campanha.</p>
      <p>A posição no ranking não garante premiação automática.</p>

      <h2>10. Premiação Diária</h2>
      <p>
        Ao final de cada dia será realizado um sorteio entre todos os participantes que tenham
        realizado ao menos uma partida na mesa promocional naquele respectivo dia.
      </p>
      <h3>Prêmio Diário</h3>
      <ul>
        <li>01 Camisa Oficial da Campanha;</li>
        <li>01 Copo Oficial Rapidin.</li>
      </ul>
      <p>
        Os ganhadores diários poderão continuar participando normalmente da campanha e concorrendo
        às premiações finais.
      </p>

      <h2>11. Premiação Final</h2>
      <p>
        Ao término da campanha será realizada a apuração dos números da sorte gerados por todos os
        participantes.
      </p>
      <p>Serão contemplados <strong>03 (três) participantes</strong>.</p>

      <h3>🥇 1º Prêmio — Kit Campeão Rapidin</h3>
      <ul>
        <li>01 Smart TV 55 Polegadas;</li>
        <li>01 Ano de Internet Rapidin 1000 Mega;</li>
        <li>Acesso ao App Premiere durante o período correspondente à premiação.</li>
      </ul>

      <h3>🥈 2º Prêmio — Kit Conexão Rapidin</h3>
      <ul>
        <li>01 Tablet 10 Polegadas;</li>
        <li>06 Meses de Internet Rapidin 1000 Mega.</li>
      </ul>

      <h3>🥉 3º Prêmio — Kit Torcedor Rapidin</h3>
      <ul>
        <li>01 Camisa Oficial da Campanha;</li>
        <li>02 Copos Oficiais da Campanha.</li>
      </ul>

      <h2>12. Apuração</h2>
      <p>Ao final da campanha:</p>
      <ol>
        <li>Será realizada a consolidação da pontuação de todos os participantes;</li>
        <li>Serão gerados os respectivos números da sorte;</li>
        <li>Será realizado o sorteio;</li>
        <li>Os números contemplados definirão os vencedores dos prêmios.</li>
      </ol>
      <p>
        Caso um participante seja contemplado mais de uma vez, será realizado novo sorteio para o
        prêmio subsequente, garantindo que cada participante seja contemplado apenas uma única vez
        na premiação final.
      </p>

      <h3>12.1 Do Sorteio</h3>
      <p>
        O sorteio será realizado <strong>ao vivo</strong> em data, horário e local previamente
        divulgados pela Rapidin.
      </p>
      <p>
        A apuração será realizada por meio de sistema desenvolvido em Google Sheets, alimentado com
        a base oficial de participantes e respectivos números da sorte gerados durante a campanha.
      </p>
      <p>
        Durante a transmissão ao vivo, será realizada a demonstração do processo de sorteio,
        garantindo transparência e acompanhamento público dos resultados.
      </p>
      <p>
        Os números contemplados serão exibidos em tempo real, bem como a identificação dos
        respectivos participantes vencedores.
      </p>
      <p>
        A Rapidin reserva-se o direito de gravar e disponibilizar posteriormente a íntegra do
        sorteio em seus canais oficiais.
      </p>

      <h2>13. Divulgação dos Ganhadores</h2>
      <p>Os ganhadores poderão ser divulgados por meio:</p>
      <ul>
        <li>site oficial da campanha;</li>
        <li>redes sociais da Rapidin;</li>
        <li>canais oficiais da empresa;</li>
        <li>materiais institucionais e promocionais.</li>
      </ul>

      <h2>14. Entrega dos Prêmios</h2>
      <p>Os vencedores serão contatados pela organização para validação dos dados cadastrais.</p>
      <p>A entrega dos prêmios ocorrerá em data e local definidos pela Rapidin.</p>
      <p>
        Caso o vencedor não seja localizado ou não apresente as informações necessárias para
        validação da participação, a organização poderá realizar nova apuração.
      </p>

      <h2>15. Uso de Imagem</h2>
      <p>
        Os participantes contemplados autorizam gratuitamente o uso de seu nome, imagem e voz para
        divulgação da campanha em materiais físicos e digitais da Rapidin pelo período de até
        {" "}<strong>12 meses</strong> após o encerramento da campanha.
      </p>

      <h2>16. Proteção de Dados</h2>
      <p>
        Os dados fornecidos pelos participantes serão utilizados exclusivamente para fins
        relacionados à operacionalização da campanha, comunicação institucional e identificação dos
        contemplados.
      </p>

      <h2>17. Disposições Finais</h2>
      <p>A participação nesta campanha implica na aceitação total e irrestrita deste regulamento.</p>
      <p>
        Os casos omissos e situações não previstas serão analisados e decididos exclusivamente pela
        organização da campanha.
      </p>

      <hr />
      <p style={{ textAlign: "center", fontWeight: "bold", marginTop: "2rem" }}>
        RAPIDIN INTERNET — Campanha Oficial
      </p>
      <p style={{ textAlign: "center", fontStyle: "italic", color: "#0E7C3A" }}>
        "Se travou, não é Rapidin."
      </p>
    </PaginaLegal>
  );
}
