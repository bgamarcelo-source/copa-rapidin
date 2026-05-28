export function limparCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

export function formatarCpf(cpf: string) {
  const c = limparCpf(cpf).slice(0, 11);
  return c
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function validarCpf(cpf: string) {
  const c = limparCpf(cpf);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(c[i]) * (10 - i);
  let dig1 = 11 - (soma % 11);
  if (dig1 >= 10) dig1 = 0;
  if (dig1 !== parseInt(c[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(c[i]) * (11 - i);
  let dig2 = 11 - (soma % 11);
  if (dig2 >= 10) dig2 = 0;
  return dig2 === parseInt(c[10]);
}

export function limparTel(t: string) {
  return t.replace(/\D/g, "");
}

export function formatarTel(t: string) {
  const v = limparTel(t).slice(0, 11);
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function validarTel(t: string) {
  const v = limparTel(t);
  return v.length === 10 || v.length === 11;
}
