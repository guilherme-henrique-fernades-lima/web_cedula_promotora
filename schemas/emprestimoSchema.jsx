import * as yup from "yup";

export const emprestimoSchema = yup.object().shape({
  noCliente: yup.string().required("O nome é obrigatório"),
  vlEmprestimo: yup.string().required("Insira o valor do empréstimo"),
  vlCapital: yup.string().required("Insira o valor do capital"),
  vlJuros: yup.string().required("Insira o valor do juros"),
  vlTotal: yup.string().required("Insira o valor total"),
  qtParcela: yup.string().required("Insira a quantidade de parcelas"),
  observacao: yup.string().required("Insira uma observação"),
});
