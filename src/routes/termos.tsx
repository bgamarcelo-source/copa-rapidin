import { createFileRoute } from "@tanstack/react-router";
import { PaginaLegal } from "@/components/site/PaginaLegal";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de Uso · Rapidin Chute ao Gol" }] }),
  component: Termos,
});

function Termos() {
  return (
    <PaginaLegal titulo="TERMOS DE USO" atualizadoEm="29 de maio de 2026">
      <p>
        Estes Termos regulam o uso do site da Promoção de Chute ao Gol da Rapidin Internet. Ao acessar
        ou utilizar esta página, você concorda integralmente com as condições aqui descritas. Se não
        concordar, por favor não utilize o site.
      </p>

      <h2>1. Aceitação</h2>
      <p>
        Estes Termos formam um acordo entre você ("usuário") e <strong>[REVISAR — Rapidin Internet, CNPJ]</strong>,
        operadora deste site. O uso continuado da página equivale à aceitação destes Termos, do
        Regulamento da promoção e da Política de Privacidade.
      </p>

      <h2>2. Para que serve este site</h2>
      <ul>
        <li>Apresentar a Promoção de Chute ao Gol da Rapidin.</li>
        <li>Permitir o cadastro de participantes presenciais (via QR code do estande).</li>
        <li>Exibir o ranking diário e o ranking acumulado de participantes.</li>
        <li>Divulgar prêmios e galeria de entregas.</li>
      </ul>

      <h2>3. Cadastro e responsabilidades do usuário</h2>
      <ul>
        <li>Você se compromete a fornecer dados verdadeiros, completos e atualizados.</li>
        <li>É proibido criar múltiplos cadastros, usar identidade alheia ou qualquer forma de fraude.</li>
        <li>Você é responsável por manter a confidencialidade do seu próprio acesso quando aplicável.</li>
      </ul>

      <h2>4. Condutas proibidas</h2>
      <p>É expressamente vedado ao usuário:</p>
      <ul>
        <li>Tentar acessar áreas restritas do site (como o painel administrativo) sem autorização.</li>
        <li>Inserir, transmitir ou hospedar conteúdo ilícito, ofensivo, difamatório ou que viole direitos de terceiros.</li>
        <li>Executar varreduras, ataques, scraping massivo ou qualquer ação que comprometa a estabilidade do serviço.</li>
        <li>Usar bots, scripts automatizados ou qualquer recurso que simule participação humana na promoção.</li>
      </ul>

      <h2>5. Propriedade intelectual</h2>
      <p>
        Todos os textos, imagens, ícones, mascote, logotipo, layouts e demais elementos visuais desta
        página são de propriedade da Rapidin ou licenciados a ela. Qualquer uso fora do contexto da
        promoção depende de autorização prévia e escrita.
      </p>

      <h2>6. Disponibilidade do serviço</h2>
      <p>
        Buscamos manter o site disponível 24 horas por dia, 7 dias por semana, mas não garantimos
        disponibilidade ininterrupta. O site pode ficar temporariamente indisponível por manutenção,
        atualizações ou eventos fora do nosso controle (queda de provedores, ataques etc.).
      </p>

      <h2>7. Limitação de responsabilidade</h2>
      <p>
        Na máxima extensão permitida pela legislação aplicável, a Rapidin não responde por danos
        indiretos, lucros cessantes ou prejuízos decorrentes de:
      </p>
      <ul>
        <li>Indisponibilidade temporária do site.</li>
        <li>Inserção de dados incorretos pelo próprio usuário.</li>
        <li>Uso indevido por terceiros não autorizados.</li>
      </ul>
      <p>
        A responsabilidade pela mecânica da promoção, prêmios e entrega permanece regida pelo Regulamento
        específico da campanha.
      </p>

      <h2>8. Privacidade e dados pessoais</h2>
      <p>
        O tratamento dos seus dados pessoais é descrito em detalhes na nossa{" "}
        <a href="/privacidade" className="font-bold text-laranja hover:underline">Política de Privacidade</a>,
        em conformidade com a LGPD.
      </p>

      <h2>9. Alterações destes Termos</h2>
      <p>
        Estes Termos podem ser revisados a qualquer momento. A versão vigente é sempre a publicada nesta
        página, com a data de última atualização indicada no topo. Mudanças relevantes serão comunicadas
        com destaque no site.
      </p>

      <h2>10. Legislação aplicável e foro</h2>
      <p>
        Aplica-se a estes Termos a legislação brasileira. Fica eleito o foro da comarca de Balsas/MA
        para dirimir quaisquer controvérsias, com renúncia expressa a qualquer outro.
      </p>
    </PaginaLegal>
  );
}
