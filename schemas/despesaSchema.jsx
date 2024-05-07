import * as yup from "yup";

export const despesaSchema = yup.object().shape({
  descricaoDespesa: yup.string().required("Descreva a despesa"),
  valorDespesa: yup.string().required("Insira o valor desta despesa"),
  situacaoPagamentoDespesa: yup
    .string()
    .required("Selecione uma situação de pagamento para esta despesa"),
  tipoDespesa: yup.string().required("Selecione o tipo desta despesa"),
  naturezaDespesa: yup.string().required("Selecione a natureza desta despesa"),
  tipoLoja: yup.string().required("Selecione a loja desta despesa"),
});
