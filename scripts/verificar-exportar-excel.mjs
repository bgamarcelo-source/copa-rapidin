// Script de verificação: gera um .xlsx de teste com a mesma lógica do exportarExcel.ts
// e relê o arquivo pra provar que o workbook é válido.
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
  const c = cpf.replace(/\D/g, "").slice(0, 11);
  return c
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTel(t) {
  const v = t.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

// Mock data (espelha estrutura de Participante)
const mockLista = [
  { id: "1", nome: "Isabela Almeida", telefone: "99987654321", cpf: "12345678901", bairro_id: "x", foto_url: null, pontos_total: 92, created_at: "2026-06-01T14:32:00Z" },
  { id: "2", nome: "Carlos Eduardo Santos", telefone: "99987654322", cpf: "23456789012", bairro_id: "x", foto_url: null, pontos_total: 87, created_at: "2026-06-02T10:15:00Z" },
  { id: "3", nome: "Mariana Oliveira", telefone: "99987654323", cpf: "34567890123", bairro_id: "x", foto_url: null, pontos_total: 81, created_at: "2026-06-02T11:00:00Z" },
  { id: "4", nome: "João Pedro Lima", telefone: "99987654324", cpf: "45678901234", bairro_id: "x", foto_url: null, pontos_total: 74, created_at: "2026-06-03T09:20:00Z" },
  { id: "5", nome: "Ana Carolina", telefone: "99987654325", cpf: "56789012345", bairro_id: "x", foto_url: null, pontos_total: 65, created_at: "2026-06-03T16:45:00Z" },
  { id: "6", nome: "Rafael Souza", telefone: "9998765432", cpf: "67890123456", bairro_id: "x", foto_url: null, pontos_total: 52, created_at: "2026-06-04T12:10:00Z" },
  { id: "7", nome: "Beatriz Costa", telefone: "99987654327", cpf: "78901234567", bairro_id: "x", foto_url: null, pontos_total: 41, created_at: "2026-06-04T18:30:00Z" },
  { id: "8", nome: "Test Vazio", telefone: "", cpf: "", bairro_id: "x", foto_url: null, pontos_total: 0, created_at: "2026-06-05T08:00:00Z" },
];

async function gerarWorkbook(lista) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Copa Rapidin";
  workbook.created = new Date();
  workbook.title = "Participantes - Copa Rapidin";

  const sheet = workbook.addWorksheet("Participantes", {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  sheet.columns = [
    { key: "pos", width: 8 },
    { key: "nome", width: 38 },
    { key: "telefone", width: 20 },
    { key: "cpf", width: 18 },
    { key: "pontos", width: 14 },
    { key: "numeros", width: 18 },
    { key: "cadastro", width: 22 },
  ];

  sheet.mergeCells("A1:G1");
  const titulo = sheet.getCell("A1");
  titulo.value = "COPA RAPIDIN · PARTICIPANTES";
  titulo.font = { name: "Calibri", size: 20, bold: true, color: { argb: BRANCO } };
  titulo.alignment = { vertical: "middle", horizontal: "center" };
  titulo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE } };
  sheet.getRow(1).height = 36;

  sheet.mergeCells("A2:G2");
  const sub = sheet.getCell("A2");
  const agora = new Date();
  sub.value = `Exportado em ${agora.toLocaleDateString("pt-BR")}  ·  Total: ${lista.length} participantes`;
  sub.font = { name: "Calibri", size: 11, italic: true, color: { argb: "FF555555" } };
  sub.alignment = { vertical: "middle", horizontal: "center" };
  sub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: AMARELO } };
  sheet.getRow(2).height = 22;

  sheet.getRow(3).height = 8;

  const headerRow = sheet.getRow(4);
  headerRow.values = ["#", "Nome", "Telefone", "CPF", "Pontos Totais", "Números da Sorte", "Cadastrado em"];
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRANCO } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LARANJA } };
  });

  const ordenado = [...lista].sort((a, b) => b.pontos_total - a.pontos_total);

  ordenado.forEach((p, i) => {
    const row = sheet.addRow({
      pos: i + 1,
      nome: p.nome,
      telefone: formatarTel(p.telefone || ""),
      cpf: formatarCpf(p.cpf || ""),
      pontos: p.pontos_total ?? 0,
      numeros: p.pontos_total ?? 0,
      cadastro: p.created_at ? new Date(p.created_at).toLocaleString("pt-BR") : "",
    });
    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Calibri", size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 2 ? "left" : "center",
      };
    });
    if (i % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CINZA_CLARO } };
      });
    }
    if (i < 3) {
      const medalha = ["🥇", "🥈", "🥉"][i];
      row.getCell("pos").value = `${medalha} ${i + 1}`;
    }
  });

  const totalLinha = sheet.addRow({});
  totalLinha.getCell("nome").value = "TOTAL GERAL";
  const totalPontos = ordenado.reduce((acc, p) => acc + (p.pontos_total ?? 0), 0);
  totalLinha.getCell("pontos").value = totalPontos;
  totalLinha.getCell("numeros").value = totalPontos;

  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + ordenado.length, column: 7 },
  };

  return await workbook.xlsx.writeBuffer();
}

async function verificarWorkbook(buffer) {
  // Relê o buffer pra provar que é um xlsx válido
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);

  const sheet = wb.getWorksheet("Participantes");
  if (!sheet) throw new Error("Worksheet 'Participantes' não encontrada");

  const titulo = sheet.getCell("A1").value;
  if (!titulo || !String(titulo).includes("COPA RAPIDIN")) {
    throw new Error(`Título inválido: ${titulo}`);
  }

  const header = sheet.getRow(4).values;
  const expectedHeaders = ["#", "Nome", "Telefone", "CPF", "Pontos Totais", "Números da Sorte", "Cadastrado em"];
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (header[i + 1] !== expectedHeaders[i]) {
      throw new Error(`Header coluna ${i + 1}: esperado "${expectedHeaders[i]}", recebido "${header[i + 1]}"`);
    }
  }

  // Verifica que o 1º colocado é Isabela (92 pts)
  const linha5 = sheet.getRow(5).values;
  if (!String(linha5[2]).includes("Isabela")) {
    throw new Error(`1º colocado esperado Isabela, recebido: ${linha5[2]}`);
  }
  if (linha5[5] !== 92) {
    throw new Error(`Pontos do 1º esperado 92, recebido: ${linha5[5]}`);
  }

  // Verifica medalha 🥇
  if (!String(linha5[1]).includes("🥇")) {
    throw new Error(`Medalha 🥇 ausente na linha 5: ${linha5[1]}`);
  }

  // Verifica total
  // (depois das 8 linhas de dados, linha 13 é o total)
  const totalRow = sheet.getRow(4 + mockLista.length + 1);
  const totalPontos = totalRow.getCell("E").value;
  const esperado = mockLista.reduce((a, p) => a + p.pontos_total, 0);
  if (totalPontos !== esperado) {
    throw new Error(`Total esperado ${esperado}, recebido ${totalPontos}`);
  }

  return {
    abas: wb.worksheets.length,
    linhas: sheet.rowCount,
    colunas: sheet.columnCount,
    titulo: String(titulo),
    totalPontos,
  };
}

(async () => {
  console.log("→ Gerando workbook...");
  const buffer = await gerarWorkbook(mockLista);
  console.log(`  buffer gerado: ${buffer.byteLength} bytes`);

  const outPath = join(tmpdir(), "verificar-exportar-excel.xlsx");
  writeFileSync(outPath, Buffer.from(buffer));
  const stats = statSync(outPath);
  console.log(`  arquivo escrito: ${outPath} (${stats.size} bytes)`);

  // Confere assinatura ZIP (xlsx é zip → PK\x03\x04)
  const head = readFileSync(outPath).subarray(0, 4);
  if (head[0] !== 0x50 || head[1] !== 0x4b || head[2] !== 0x03 || head[3] !== 0x04) {
    throw new Error(`Assinatura ZIP inválida: ${head.toString("hex")}`);
  }
  console.log("  assinatura ZIP OK (PK\\x03\\x04)");

  console.log("→ Relendo workbook pra validar conteúdo...");
  const info = await verificarWorkbook(buffer);
  console.log("  ✓ válido:", info);

  unlinkSync(outPath);
  console.log("\n✅ Verificação passou. Workbook gera, salva e abre corretamente.");
})().catch((e) => {
  console.error("\n❌ Verificação FALHOU:", e);
  process.exit(1);
});
