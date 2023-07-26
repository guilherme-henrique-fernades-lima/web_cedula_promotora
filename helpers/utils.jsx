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
