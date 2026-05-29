import ExcelJS from "exceljs";
import type { Participante } from "@/lib/supabase";
import { formatarCpf, formatarTel } from "@/lib/validators";

// Paleta Rapidin
const VERDE = "FF0E7C3A";
const LARANJA = "FFF57A1F";
const AMARELO = "FFFFC72C";
const CINZA_CLARO = "FFF5F5F5";
const BRANCO = "FFFFFFFF";

type LinhaRelatorio = {
  nome: string;
  telefone: string;
  cpf: string;
  pontos: number;
  created_at?: string | null;
};

type Config = {
  abaNome: string; // nome da aba
  tituloPlanilha: string; // título do workbook
  tituloTopo: string; // linha 1
  subtitulo: string; // linha 2
  rotuloPontos: string; // header da coluna de pontos
  mostrarNumerosDaSorte: boolean; // só faz sentido no relatório geral
  mostrarCadastro: boolean; // só faz sentido no relatório geral
  nomeArquivo: string;
};

function baixar(buffer: ArrayBuffer, nomeArquivo: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function gerarPlanilha(linhas: LinhaRelatorio[], cfg: Config) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Copa Rapidin";
  workbook.created = new Date();
  workbook.title = cfg.tituloPlanilha;

  const sheet = workbook.addWorksheet(cfg.abaNome, {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  // Configura colunas conforme o tipo de relatório
  const colunas: Partial<ExcelJS.Column>[] = [
    { key: "pos", width: 8 },
    { key: "nome", width: 38 },
    { key: "telefone", width: 20 },
    { key: "cpf", width: 18 },
    { key: "pontos", width: 16 },
  ];
  if (cfg.mostrarNumerosDaSorte) colunas.push({ key: "numeros", width: 18 });
  if (cfg.mostrarCadastro) colunas.push({ key: "cadastro", width: 22 });
  sheet.columns = colunas;

  const totalCols = colunas.length;
  const ultimaColLetra = String.fromCharCode("A".charCodeAt(0) + totalCols - 1);

  // --- Linha 1: Título ---
  sheet.mergeCells(`A1:${ultimaColLetra}1`);
  const titulo = sheet.getCell("A1");
  titulo.value = cfg.tituloTopo;
  titulo.font = { name: "Calibri", size: 20, bold: true, color: { argb: BRANCO } };
  titulo.alignment = { vertical: "middle", horizontal: "center" };
  titulo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE } };
  sheet.getRow(1).height = 36;

  // --- Linha 2: Subtítulo ---
  sheet.mergeCells(`A2:${ultimaColLetra}2`);
  const sub = sheet.getCell("A2");
  sub.value = cfg.subtitulo;
  sub.font = { name: "Calibri", size: 11, italic: true, color: { argb: "FF555555" } };
  sub.alignment = { vertical: "middle", horizontal: "center" };
  sub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: AMARELO } };
  sheet.getRow(2).height = 22;

  // --- Linha 3: respiro ---
  sheet.getRow(3).height = 8;

  // --- Linha 4: cabeçalho ---
  const headers: string[] = ["#", "Nome", "Telefone", "CPF", cfg.rotuloPontos];
  if (cfg.mostrarNumerosDaSorte) headers.push("Números da Sorte");
  if (cfg.mostrarCadastro) headers.push("Cadastrado em");

  const headerRow = sheet.getRow(4);
  headerRow.values = headers;
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRANCO } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LARANJA } };
    cell.border = {
      top: { style: "thin", color: { argb: BRANCO } },
      left: { style: "thin", color: { argb: BRANCO } },
      bottom: { style: "thin", color: { argb: BRANCO } },
      right: { style: "thin", color: { argb: BRANCO } },
    };
  });

  // Ordenado por pontos desc (garantia)
  const ordenado = [...linhas].sort((a, b) => b.pontos - a.pontos);

  // --- Dados ---
  ordenado.forEach((p, i) => {
    const dados: Record<string, string | number> = {
      pos: i + 1,
      nome: p.nome,
      telefone: formatarTel(p.telefone || ""),
      cpf: formatarCpf(p.cpf || ""),
      pontos: p.pontos ?? 0,
    };
    if (cfg.mostrarNumerosDaSorte) dados.numeros = p.pontos ?? 0;
    if (cfg.mostrarCadastro) {
      dados.cadastro = p.created_at
        ? new Date(p.created_at).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
    }
    const row = sheet.addRow(dados);

    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Calibri", size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 2 ? "left" : "center",
      };
      cell.border = {
        top: { style: "hair", color: { argb: "FFE0E0E0" } },
        bottom: { style: "hair", color: { argb: "FFE0E0E0" } },
        left: { style: "hair", color: { argb: "FFE0E0E0" } },
        right: { style: "hair", color: { argb: "FFE0E0E0" } },
      };
    });

    if (i % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CINZA_CLARO } };
      });
    }

    if (i < 3) {
      const medalha = ["🥇", "🥈", "🥉"][i];
      const posCell = row.getCell("pos");
      posCell.value = `${medalha} ${i + 1}`;
      posCell.font = { name: "Calibri", size: 12, bold: true };
      const nomeCell = row.getCell("nome");
      nomeCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: VERDE } };
      const pontosCell = row.getCell("pontos");
      pontosCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: LARANJA } };
    } else {
      const pontosCell = row.getCell("pontos");
      pontosCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: LARANJA } };
    }
  });

  // --- Rodapé total ---
  const totalLinha = sheet.addRow({});
  const totalLabel = totalLinha.getCell("nome");
  totalLabel.value = "TOTAL GERAL";
  totalLabel.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRANCO } };
  totalLabel.alignment = { vertical: "middle", horizontal: "right" };

  const totalPontos = ordenado.reduce((acc, p) => acc + (p.pontos ?? 0), 0);
  const totalPontosCell = totalLinha.getCell("pontos");
  totalPontosCell.value = totalPontos;
  totalPontosCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRANCO } };
  totalPontosCell.alignment = { vertical: "middle", horizontal: "center" };

  if (cfg.mostrarNumerosDaSorte) {
    const totalNumerosCell = totalLinha.getCell("numeros");
    totalNumerosCell.value = totalPontos;
    totalNumerosCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRANCO } };
    totalNumerosCell.alignment = { vertical: "middle", horizontal: "center" };
  }

  // Pinta toda a linha de verde
  for (let c = 1; c <= totalCols; c++) {
    const cell = totalLinha.getCell(c);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE } };
  }
  totalLinha.height = 24;

  // Autofiltro
  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + ordenado.length, column: totalCols },
  };

  // Estado vazio (sem registros) — adiciona uma linha amigável
  if (ordenado.length === 0) {
    const vazia = sheet.addRow({});
    sheet.mergeCells(`A${vazia.number}:${ultimaColLetra}${vazia.number}`);
    const cell = vazia.getCell("A");
    cell.value = "Sem registros para este relatório.";
    cell.font = { name: "Calibri", size: 11, italic: true, color: { argb: "FF888888" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    vazia.height = 28;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  baixar(buffer, cfg.nomeArquivo);
}

// =============================================================
// Relatório Geral — todos os participantes, pontos acumulados
// =============================================================
export async function exportarRelatorioGeral(lista: Participante[]) {
  const agora = new Date();
  const dataStr = agora.toLocaleDateString("pt-BR");
  const horaStr = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const linhas: LinhaRelatorio[] = lista.map((p) => ({
    nome: p.nome,
    telefone: p.telefone,
    cpf: p.cpf,
    pontos: p.pontos_total ?? 0,
    created_at: p.created_at,
  }));

  await gerarPlanilha(linhas, {
    abaNome: "Geral",
    tituloPlanilha: "Relatório Geral - Copa Rapidin",
    tituloTopo: "COPA RAPIDIN · RELATÓRIO GERAL",
    subtitulo: `Pontos acumulados · Exportado em ${dataStr} às ${horaStr}  ·  Total: ${lista.length} participante${lista.length === 1 ? "" : "s"}`,
    rotuloPontos: "Pontos Totais",
    mostrarNumerosDaSorte: true,
    mostrarCadastro: true,
    nomeArquivo: `relatorio-geral-copa-rapidin-${agora.toISOString().slice(0, 10)}.xlsx`,
  });
}

// =============================================================
// Relatório do Dia — só quem pontuou hoje (ranking da torcida)
// =============================================================
export type LinhaHojeExport = {
  nome: string;
  telefone: string;
  cpf: string;
  pontos_hoje: number;
};

/**
 * @param lista linhas do ranking do dia escolhido (já agregadas + filtradas)
 * @param dataIso "yyyy-mm-dd" do dia exportado; se omitido, usa hoje (timezone do navegador)
 */
export async function exportarRelatorioDoDia(
  lista: LinhaHojeExport[],
  dataIso?: string,
) {
  const agora = new Date();
  const horaStr = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // Formata DD/MM/AAAA a partir do ISO sem cair em problema de fuso
  const iso = dataIso ?? agora.toISOString().slice(0, 10);
  const [y, m, d] = iso.split("-");
  const dataBr = `${d}/${m}/${y}`;

  const linhas: LinhaRelatorio[] = lista.map((p) => ({
    nome: p.nome,
    telefone: p.telefone,
    cpf: p.cpf,
    pontos: p.pontos_hoje ?? 0,
  }));

  const ehHoje = iso === agora.toISOString().slice(0, 10);
  const rotuloPontos = ehHoje ? "Pontos Hoje" : "Pontos no Dia";

  await gerarPlanilha(linhas, {
    abaNome: "Ranking do dia",
    tituloPlanilha: `Relatório do Dia ${dataBr} - Copa Rapidin`,
    tituloTopo: `COPA RAPIDIN · RANKING DO DIA — ${dataBr}`,
    subtitulo: `Pontos do dia ${dataBr} · Exportado às ${horaStr}  ·  ${lista.length} participante${lista.length === 1 ? "" : "s"} pontuaram nesse dia`,
    rotuloPontos,
    mostrarNumerosDaSorte: false,
    mostrarCadastro: false,
    nomeArquivo: `relatorio-do-dia-${iso}-copa-rapidin.xlsx`,
  });
}
