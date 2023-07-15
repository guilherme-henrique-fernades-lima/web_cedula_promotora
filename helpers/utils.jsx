export function formatarData(data) {
  const partes = data.split("-");
  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];
  const dataFormatada = `${dia}/${mes}/${ano}`;
  return dataFormatada;
}

export function formatarValorBRL(valor) {
  const options = {
    style: "currency",
    currency: "BRL",
  };
  const valorFormatado = valor.toLocaleString("pt-BR", options);
  return valorFormatado;
}

export function formatarCPFSemAnonimidade(cpf) {
  // Remove todos os caracteres que não sejam números
  cpf = cpf.replace(/\D/g, "");

  // Aplica a formatação
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return cpf;
}

export function formatarTelefone(telefone) {
  // Remover todos os caracteres não numéricos do número de telefone
  const numeroLimpo = telefone.replace(/\D/g, "");

  // Verificar se o número de telefone possui o formato correto (11 dígitos)
  if (numeroLimpo.length !== 11) {
    throw new Error(
      "Número de telefone inválido. Certifique-se de que o número contenha 11 dígitos."
    );
  }

  // Formatar o número de telefone no formato desejado
  const codigoArea = numeroLimpo.slice(0, 2);
  const digito9 = numeroLimpo.slice(2, 3);
  const digitosRestantes = numeroLimpo.slice(3);
  const telefoneFormatado = `(${codigoArea}) ${digito9} ${digitosRestantes.slice(
    0,
    4
  )}-${digitosRestantes.slice(4)}`;

  return telefoneFormatado;
}
