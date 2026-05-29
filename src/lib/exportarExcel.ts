import ExcelJS from "exceljs";
import type { Participante } from "@/lib/supabase";
import { formatarCpf, formatarTel } from "@/lib/validators";

// Paleta Rapidin
const VERDE = "FF0E7C3A";
const LARANJA = "FFF57A1F";
const AMARELO = "FFFFC72C";
const CINZA_CLARO = "FFF5F5F5";
const BRANCO = "FFFFFFFF";

export async function exportarParticipantesExcel(lista: Participante[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Copa Rapidin";
  workbook.created = new Date();
  workbook.title = "Participantes - Copa Rapidin";

  const sheet = workbook.addWorksheet("Participantes", {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  // Larguras das colunas
  sheet.columns = [
    { key: "pos", width: 8 },
    { key: "nome", width: 38 },
    { key: "telefone", width: 20 },
    { key: "cpf", width: 18 },
    { key: "pontos", width: 14 },
    { key: "numeros", width: 18 },
    { key: "cadastro", width: 22 },
  ];

  // --- Linha 1: Título grande ---
  sheet.mergeCells("A1:G1");
  const titulo = sheet.getCell("A1");
  titulo.value = "COPA RAPIDIN · PARTICIPANTES";
  titulo.font = { name: "Calibri", size: 20, bold: true, color: { argb: BRANCO } };
  titulo.alignment = { vertical: "middle", horizontal: "center" };
  titulo.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: VERDE },
  };
  sheet.getRow(1).height = 36;

  // --- Linha 2: Subtítulo com data e total ---
  sheet.mergeCells("A2:G2");
  const sub = sheet.getCell("A2");
  const agora = new Date();
  const dataStr = agora.toLocaleDateString("pt-BR");
  const horaStr = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  sub.value = `Exportado em ${dataStr} às ${horaStr}  ·  Total: ${lista.length} participante${lista.length === 1 ? "" : "s"}`;
  sub.font = { name: "Calibri", size: 11, italic: true, color: { argb: "FF555555" } };
  sub.alignment = { vertical: "middle", horizontal: "center" };
  sub.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: AMARELO },
  };
  sheet.getRow(2).height = 22;

  // --- Linha 3: vazia (respiro) ---
  sheet.getRow(3).height = 8;

  // --- Linha 4: Cabeçalho da tabela ---
  const headerRow = sheet.getRow(4);
  headerRow.values = [
    "#",
    "Nome",
    "Telefone",
    "CPF",
    "Pontos Totais",
    "Números da Sorte",
    "Cadastrado em",
  ];
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRANCO } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: LARANJA },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFFFFFFF" } },
      left: { style: "thin", color: { argb: "FFFFFFFF" } },
      bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
      right: { style: "thin", color: { argb: "FFFFFFFF" } },
    };
  });

  // Ordenar por pontos desc (já vem ordenado, mas garantia)
  const ordenado = [...lista].sort((a, b) => b.pontos_total - a.pontos_total);

  // --- Linhas de dados ---
  ordenado.forEach((p, i) => {
    const row = sheet.addRow({
      pos: i + 1,
      nome: p.nome,
      telefone: formatarTel(p.telefone || ""),
      cpf: formatarCpf(p.cpf || ""),
      pontos: p.pontos_total ?? 0,
      numeros: p.pontos_total ?? 0,
      cadastro: p.created_at
        ? new Date(p.created_at).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    });

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

    // Zebra
    if (i % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: CINZA_CLARO },
        };
      });
    }

    // Destaque pro Top 3
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

  // --- Rodapé com totais ---
  const totalLinha = sheet.addRow({});
  totalLinha.getCell("pos").value = "";
  const totalLabel = totalLinha.getCell("nome");
  totalLabel.value = "TOTAL GERAL";
  totalLabel.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRANCO } };
  totalLabel.alignment = { vertical: "middle", horizontal: "right" };
  totalLabel.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: VERDE },
  };

  const totalPontos = ordenado.reduce((acc, p) => acc + (p.pontos_total ?? 0), 0);
  const totalPontosCell = totalLinha.getCell("pontos");
  totalPontosCell.value = totalPontos;
  totalPontosCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRANCO } };
  totalPontosCell.alignment = { vertical: "middle", horizontal: "center" };
  totalPontosCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: VERDE },
  };

  const totalNumerosCell = totalLinha.getCell("numeros");
  totalNumerosCell.value = totalPontos;
  totalNumerosCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRANCO } };
  totalNumerosCell.alignment = { vertical: "middle", horizontal: "center" };
  totalNumerosCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: VERDE },
  };

  // Pintar células vazias do total
  [3, 4, 7].forEach((col) => {
    const cell = totalLinha.getCell(col);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: VERDE },
    };
  });
  totalLinha.getCell("pos").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: VERDE },
  };
  totalLinha.height = 24;

  // Autofiltro no cabeçalho da tabela
  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + ordenado.length, column: 7 },
  };

  // Gerar arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dataNomeArq = agora.toISOString().slice(0, 10);
  a.href = url;
  a.download = `participantes-copa-rapidin-${dataNomeArq}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
