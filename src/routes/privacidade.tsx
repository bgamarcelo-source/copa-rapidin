import { createFileRoute } from "@tanstack/react-router";
import { PaginaLegal } from "@/components/site/PaginaLegal";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Política de Privacidade · Rapidin Chute ao Gol" }] }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <PaginaLegal titulo="POLÍTICA DE PRIVACIDADE" atualizadoEm="29 de maio de 2026">
      <p>
        Esta política descreve como a Rapidin Internet coleta, usa, armazena e protege seus dados pessoais
        no contexto da Promoção de Chute ao Gol, em conformidade com a Lei Geral de Proteção de Dados
        Pessoais — LGPD (Lei nº 13.709/2018).
      </p>

      <h2>1. Quem somos</h2>
      <p>
        <strong>[REVISAR COM ADVOGADO — razão social, CNPJ, endereço completo da Rapidin]</strong>,
        controladora dos dados coletados nesta promoção.
      </p>
      <p>
        Encarregado de Proteção de Dados (DPO): <strong>[REVISAR — nome e e-mail do DPO ou contato responsável]</strong>.
      </p>

      <h2>2. Dados que coletamos</h2>
      <ul>
        <li><strong>Cadastro de participante:</strong> nome completo, CPF, telefone, bairro de residência.</li>
        <li><strong>Pontuação:</strong> registros das pontuações obtidas nos eventos da promoção, com data, horário e local.</li>
        <li><strong>Foto opcional:</strong> imagem do rosto, caso o participante seja escolhido para o card "Destaque do Dia".</li>
        <li><strong>Dados de navegação:</strong> informações técnicas básicas de acesso ao site (endereço IP, tipo de navegador, páginas visitadas), coletadas automaticamente para garantir o funcionamento da página.</li>
      </ul>

      <h2>3. Por que coletamos</h2>
      <ul>
        <li>Identificar você como participante e evitar cadastros duplicados (CPF como chave única).</li>
        <li>Calcular e exibir o ranking público da promoção.</li>
        <li>Comunicar com os ganhadores para entrega dos prêmios.</li>
        <li>Cumprir obrigações legais, regulatórias e tributárias da campanha.</li>
        <li>Prevenir fraudes.</li>
      </ul>

      <h2>4. Base legal</h2>
      <p>
        O tratamento dos dados se baseia em (a) <strong>consentimento</strong> do titular ao se cadastrar
        na promoção, (b) <strong>execução do regulamento</strong> ao qual o participante aderiu, e
        (c) <strong>cumprimento de obrigação legal</strong> aplicável a campanhas promocionais.
      </p>

      <h2>5. Com quem compartilhamos</h2>
      <ul>
        <li><strong>Supabase:</strong> banco de dados que armazena os cadastros e pontuações (servidores no Brasil, região São Paulo).</li>
        <li><strong>Provedores de hospedagem:</strong> infraestrutura técnica que entrega o site.</li>
        <li><strong>Autoridades públicas:</strong> quando exigido por lei ou ordem judicial.</li>
      </ul>
      <p>Não vendemos seus dados a terceiros. Não usamos seus dados para perfilamento publicitário fora desta promoção.</p>

      <h2>6. Por quanto tempo guardamos</h2>
      <ul>
        <li>Dados de participantes ganhadores: <strong>5 anos</strong> após o término da promoção, para fins fiscais e legais.</li>
        <li>Dados de participantes não ganhadores: até <strong>6 meses</strong> após o término, depois são anonimizados.</li>
        <li>Logs técnicos de acesso: até <strong>6 meses</strong>, conforme exigência do Marco Civil da Internet.</li>
      </ul>

      <h2>7. Seus direitos</h2>
      <p>De acordo com a LGPD, você pode a qualquer momento:</p>
      <ul>
        <li>Confirmar a existência de tratamento dos seus dados.</li>
        <li>Acessar e corrigir seus dados.</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.</li>
        <li>Revogar o consentimento (o que pode implicar a exclusão da promoção).</li>
        <li>Solicitar a portabilidade dos dados a outro fornecedor.</li>
      </ul>
      <p>
        Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
        <strong>[REVISAR — e-mail de contato LGPD]</strong> ou pelo WhatsApp oficial da Rapidin.
      </p>

      <h2>8. Segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados contra acessos não
        autorizados, perda, alteração ou destruição. Apesar disso, nenhum sistema é 100% seguro — incidentes
        relevantes serão comunicados a você e à Autoridade Nacional de Proteção de Dados (ANPD) conforme
        previsto em lei.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Usamos apenas cookies estritamente necessários para o funcionamento do site (lembrar que você já
        aceitou este aviso, manter sua sessão de admin logada, etc.). Não usamos cookies de marketing,
        publicidade ou rastreamento de terceiros.
      </p>

      <h2>10. Atualizações desta política</h2>
      <p>
        Esta política pode ser atualizada para refletir mudanças legais ou operacionais. A data de "última
        atualização" no topo desta página indica a versão vigente. Mudanças significativas serão comunicadas
        em destaque no site.
      </p>
    </PaginaLegal>
  );
}
