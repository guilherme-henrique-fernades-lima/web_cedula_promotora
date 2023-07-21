import * as yup from "yup";

export const contratoSchema = yup.object().shape({
  contrato: yup.string().required("O número do contrato é obrigatório"),
  promotora: yup.string().required("Selecione a promotora"),
  no_cliente: yup.string().required("Insira o nome do cliente"),
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  convenio: yup.string().required("Selecione um convênio"),
  operacao: yup.string().required("Selecione uma operação"),
  banco: yup.string().required("Insira o nome do banco"),
  vl_contrato: yup.string().required("Insira o valor do contrato"),
  //qt_parcelas: yup.string().required("Insira a quantidade de parcelas"),
  vl_parcela: yup.string().required("Insira o valor da parcela"),
  vl_comissao: yup.string().required("Insira o valor da comissão"),
  porcentagem: yup.string().required("Insira a porcentagem"),
  corretor: yup.string().required("Insira o corretor"),
});
