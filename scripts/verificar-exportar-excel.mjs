// Verificação: gera os DOIS relatórios (geral + dia) com a mesma lógica do
// exportarExcel.ts e relê cada arquivo pra confirmar que é xlsx válido.
// NÃO faz parte do build do site.

import ExcelJS from "exceljs";
import { writeFileSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const VERDE = "FF0E7C3A";
const LARANJA = "FFF57A1F";
const AMARELO = "FFFFC72C";
const CINZA_CLARO = "FFF5F5F5";
const BRANCO = "FFFFFFFF";

function formatarCpf(cpf) {
  const c = (cpf ?? "").replace(/\D/g, "").slice(0, 11);
  return c
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTel(t) {
  const v = (t ?? "").replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

async function gerarPlanilha(linhas, cfg) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Copa Rapidin";
  workbook.title = cfg.tituloPlanilha;

  const sheet = workbook.addWorksheet(cfg.abaNome, {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  const colunas = [
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

  sheet.mergeCells(`A1:${ultimaColLetra}1`);
  const titulo = sheet.getCell("A1");
  titulo.value = cfg.tituloTopo;
  titulo.font = { size: 20, bold: true, color: { argb: BRANCO } };
  titulo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE } };

  sheet.mergeCells(`A2:${ultimaColLetra}2`);
  const sub = sheet.getCell("A2");
  sub.value = cfg.subtitulo;
  sub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: AMARELO } };

  const headers = ["#", "Nome", "Telefone", "CPF", cfg.rotuloPontos];
  if (cfg.mostrarNumerosDaSorte) headers.push("Números da Sorte");
  if (cfg.mostrarCadastro) headers.push("Cadastrado em");

  const headerRow = sheet.getRow(4);
  headerRow.values = headers;
  headerRow.eachCell((c) => {
    c.font = { bold: true, color: { argb: BRANCO } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LARANJA } };
  });

  const ordenado = [...linhas].sort((a, b) => b.pontos - a.pontos);

  ordenado.forEach((p, i) => {
    const dados = {
      pos: i + 1,
      nome: p.nome,
      telefone: formatarTel(p.telefone || ""),
      cpf: formatarCpf(p.cpf || ""),
      pontos: p.pontos ?? 0,
    };
    if (cfg.mostrarNumerosDaSorte) dados.numeros = p.pontos ?? 0;
    if (cfg.mostrarCadastro) {
      dados.cadastro = p.created_at ? new Date(p.created_at).toLocaleString("pt-BR") : "";
    }
    const row = sheet.addRow(dados);
    if (i % 2 === 1) {
      row.eachCell((c) => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CINZA_CLARO } };
      });
    }
    if (i < 3) {
      const medalha = ["🥇", "🥈", "🥉"][i];
      row.getCell("pos").value = `${medalha} ${i + 1}`;
    }
  });

  const totalLinha = sheet.addRow({});
  totalLinha.getCell("nome").value = "TOTAL GERAL";
  const totalPontos = ordenado.reduce((acc, p) => acc + (p.pontos ?? 0), 0);
  totalLinha.getCell("pontos").value = totalPontos;
  if (cfg.mostrarNumerosDaSorte) totalLinha.getCell("numeros").value = totalPontos;
  for (let c = 1; c <= totalCols; c++) {
    totalLinha.getCell(c).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: VERDE },
    };
  }

  if (ordenado.length === 0) {
    const vazia = sheet.addRow({});
    sheet.mergeCells(`A${vazia.number}:${ultimaColLetra}${vazia.number}`);
    vazia.getCell("A").value = "Sem registros para este relatório.";
  }

  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + ordenado.length, column: totalCols },
  };

  return await workbook.xlsx.writeBuffer();
}

async function validarBuffer(buffer, nome, esperado) {
  const out = join(tmpdir(), `verificar-${nome}.xlsx`);
  writeFileSync(out, Buffer.from(buffer));
  const stats = statSync(out);
  const head = readFileSync(out).subarray(0, 4);
  if (head[0] !== 0x50 || head[1] !== 0x4b || head[2] !== 0x03 || head[3] !== 0x04) {
    throw new Error(`[${nome}] assinatura ZIP inválida`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const sheet = wb.getWorksheet(esperado.abaNome);
  if (!sheet) throw new Error(`[${nome}] aba '${esperado.abaNome}' não encontrada`);

  const titulo = String(sheet.getCell("A1").value ?? "");
  if (!titulo.includes(esperado.tituloContem)) {
    throw new Error(`[${nome}] título esperado contendo '${esperado.tituloContem}', recebido: ${titulo}`);
  }

  const header5 = sheet.getRow(4).getCell(5).value;
  if (header5 !== esperado.rotuloPontos) {
    throw new Error(`[${nome}] header coluna 5 esperado '${esperado.rotuloPontos}', recebido: ${header5}`);
  }

  // total geral
  if (esperado.totalEsperado != null) {
    const linhaTotal = sheet.getRow(4 + esperado.linhasDados + 1);
    const total = linhaTotal.getCell(5).value;
    if (total !== esperado.totalEsperado) {
      throw new Error(`[${nome}] total esperado ${esperado.totalEsperado}, recebido ${total}`);
    }
  }

  unlinkSync(out);
  return { bytes: stats.size, abas: wb.worksheets.length, linhas: sheet.rowCount };
}

// ============================================================
// MOCK DATA
// ============================================================
const mockGeral = [
  { nome: "Isabela Almeida", telefone: "99987654321", cpf: "12345678901", pontos: 92, created_at: "2026-06-01T14:32:00Z" },
  { nome: "Carlos Eduardo Santos", telefone: "99987654322", cpf: "23456789012", pontos: 87, created_at: "2026-06-02T10:15:00Z" },
  { nome: "Mariana Oliveira", telefone: "99987654323", cpf: "34567890123", pontos: 81, created_at: "2026-06-02T11:00:00Z" },
  { nome: "João Pedro Lima", telefone: "99987654324", cpf: "45678901234", pontos: 74, created_at: "2026-06-03T09:20:00Z" },
  { nome: "Ana Carolina", telefone: "99987654325", cpf: "56789012345", pontos: 65, created_at: "2026-06-03T16:45:00Z" },
];

const mockDia = [
  { nome: "Isabela Almeida", telefone: "99987654321", cpf: "12345678901", pontos: 19 },
  { nome: "Beatriz Costa", telefone: "99987654327", cpf: "78901234567", pontos: 12 },
  { nome: "Rafael Souza", telefone: "9998765432", cpf: "67890123456", pontos: 8 },
];

const mockVazio = [];

// ============================================================
// EXECUTA
// ============================================================
(async () => {
  console.log("→ Gerando RELATÓRIO GERAL...");
  const bufGeral = await gerarPlanilha(mockGeral, {
    abaNome: "Geral",
    tituloPlanilha: "Relatório Geral - Copa Rapidin",
    tituloTopo: "COPA RAPIDIN · RELATÓRIO GERAL",
    subtitulo: "Pontos acumulados",
    rotuloPontos: "Pontos Totais",
    mostrarNumerosDaSorte: true,
    mostrarCadastro: true,
  });
  const infoGeral = await validarBuffer(bufGeral, "geral", {
    abaNome: "Geral",
    tituloContem: "RELATÓRIO GERAL",
    rotuloPontos: "Pontos Totais",
    linhasDados: mockGeral.length,
    totalEsperado: 92 + 87 + 81 + 74 + 65, // 399
  });
  console.log("  ✓ válido:", infoGeral);

  console.log("\n→ Gerando RELATÓRIO DO DIA...");
  const bufDia = await gerarPlanilha(mockDia, {
    abaNome: "Ranking do dia",
    tituloPlanilha: "Relatório do Dia - Copa Rapidin",
    tituloTopo: "COPA RAPIDIN · RANKING DO DIA — 29/05/2026",
    subtitulo: "Pontos do dia (zera todo amanhecer)",
    rotuloPontos: "Pontos Hoje",
    mostrarNumerosDaSorte: false,
    mostrarCadastro: false,
  });
  const infoDia = await validarBuffer(bufDia, "dia", {
    abaNome: "Ranking do dia",
    tituloContem: "RANKING DO DIA",
    rotuloPontos: "Pontos Hoje",
    linhasDados: mockDia.length,
    totalEsperado: 19 + 12 + 8, // 39
  });
  console.log("  ✓ válido:", infoDia);

  console.log("\n→ Gerando RELATÓRIO DO DIA VAZIO (ninguém pontuou)...");
  const bufVazio = await gerarPlanilha(mockVazio, {
    abaNome: "Ranking do dia",
    tituloPlanilha: "Relatório do Dia - Copa Rapidin",
    tituloTopo: "COPA RAPIDIN · RANKING DO DIA — 29/05/2026",
    subtitulo: "Pontos do dia (zera todo amanhecer)",
    rotuloPontos: "Pontos Hoje",
    mostrarNumerosDaSorte: false,
    mostrarCadastro: false,
  });
  const infoVazio = await validarBuffer(bufVazio, "vazio", {
    abaNome: "Ranking do dia",
    tituloContem: "RANKING DO DIA",
    rotuloPontos: "Pontos Hoje",
    linhasDados: 0,
    totalEsperado: 0,
  });
  console.log("  ✓ válido:", infoVazio);

  console.log("\n✅ Os 3 cenários (geral, do dia, vazio) geram .xlsx válidos.");
})().catch((e) => {
  console.error("\n❌ Verificação FALHOU:", e);
  process.exit(1);
});
