import Chip from "@mui/material/Chip";

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
  // Removendo caracteres não numéricos do telefone
  const numeroLimpo = telefone.replace(/\D/g, "");

  if (!telefone) {
    return "";
  }

  // Verificando se o número tem 11 dígitos (incluindo o DDD)
  if (numeroLimpo.length === 11) {
    // Formato com DDD, 9 e 4 primeiros dígitos após o DDD
    return `${numeroLimpo.slice(0, 2)} ${numeroLimpo.slice(
      2,
      3
    )} ${numeroLimpo.slice(3, 7)}-${numeroLimpo.slice(7)}`;
  } else if (numeroLimpo.length === 10) {
    // Formato com DDD e 4 primeiros dígitos após o DDD
    return `${numeroLimpo.slice(0, 2)} ${numeroLimpo.slice(
      2,
      6
    )}-${numeroLimpo.slice(6)}`;
  } else {
    // Caso não corresponda a nenhum padrão conhecido, retornar o número original
    return telefone;
  }
}

export function converterDataParaJS(dataNoFormatoYYYYMMDD) {
  const partesDaData = dataNoFormatoYYYYMMDD.split("-");
  const ano = parseInt(partesDaData[0]);
  const mes = parseInt(partesDaData[1]) - 1;
  const dia = parseInt(partesDaData[2]);

  return new Date(ano, mes, dia);
}

export function renderTipoPagamentoEmprestimo(value) {
  if (value === "JUROS") {
    return <Chip label="JUROS" color="error" size="small" />;
  } else if (value === "PARCELA") {
    return <Chip label="PARCELA" color="success" size="small" />;
  } else {
    return "";
  }
}

export function renderNaturezaDespesa(value) {
  if (value === "aluguel") {
    return "ALUGUEL";
  } else if (value === "aux_familia") {
    return "AUXÍLIO FAMÍLIA";
  } else if (value === "corretor") {
    return "CORRETOR(A)";
  } else if (value === "fgts") {
    return "FGTS";
  } else if (value === "inss") {
    return "INSS";
  } else if (value === "iptu") {
    return "INSS";
  } else if (value === "refeicao") {
    return "REFEIÇÃO";
  } else if (value === "salario") {
    return "SALÁRIO";
  } else if (value === "vale_transporte") {
    return "VALE TRANSPORTE";
  } else if (value === "outro") {
    return "OUTRO";
  } else {
    return "";
  }
}

export function renderTipoDespesa(value) {
  if (value === "fixa") {
    return "FIXA";
  } else if (value === "variavel") {
    return "VARIÁVEL";
  } else {
    return "";
  }
}

export function formatarCEP(cep) {
  cep = cep.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
  if (cep.length === 8) {
    cep = cep.replace(/(\d{5})(\d{3})/, "$1-$2"); // Formata o CEP no padrão xxxxx-xxx
    return cep;
  } else {
    return "CEP inválido";
  }
}

export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#20B2AA",
  "#ADFF2F",
  "#FF00FF",
  "#FFD700",
  "#746758",
  "#87CEFA",
  "#228B22",
  "#000080",
  "#008B8B",
  "#778899",
  "#800000",
  "#FFFF00",
  "#DE3163",
  "#CCCCFF",
];

export function formatarReal(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
