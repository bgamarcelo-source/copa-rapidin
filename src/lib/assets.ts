export function asset(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${clean}`;
}

// Data "hoje" no fuso horário de Brasília/Balsas (UTC-3) no formato YYYY-MM-DD.
// Casa com o default do banco que usa now() at time zone 'America/Sao_Paulo'.
export function hojeBR(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date()); // YYYY-MM-DD
}
