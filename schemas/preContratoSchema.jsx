import * as yup from "yup";

export const preContratoSchema = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  tabela: yup
    .string()
    .required("Insira o nome da tabela")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  porcentagem: yup.string().required("Insira a porcentagem"),
  vl_parcela: yup.string().required("Insira o valor da parcela"),
  vl_contrato: yup.string().required("Insira o valor do contrato"),
  nr_contrato: yup.string().required("O número do contrato é obrigatório"),
  no_cliente: yup
    .string()
    .required("Insira o nome do cliente")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  promotora: yup.string().required("Selecione a promotora"),
  corretor: yup.string().required("Insira o corretor"),
  banco: yup.string().required("Insira o nome do banco"),
  operacao: yup.string().required("Selecione uma operação"),
  convenio: yup.string().required("Selecione um convênio"),
  iletrado: yup.string().required("Selecione uma opção"),
  tipo_contrato: yup.string().required("Selecione uma opção"),
  documentacao_salva: yup.string().required("Selecione uma opção"),
});

export const updatePreContratoSchemaSuperUser = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  tabela: yup
    .string()
    .required("Insira o nome da tabela")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  porcentagem: yup.string().required("Insira a porcentagem"),
  vl_parcela: yup.string().required("Insira o valor da parcela"),
  vl_contrato: yup.string().required("Insira o valor do contrato"),
  nr_contrato: yup.string().required("O número do contrato é obrigatório"),
  no_cliente: yup
    .string()
    .required("Insira o nome do cliente")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  promotora: yup.string().required("Selecione a promotora"),
  corretor: yup.string().required("Insira o corretor"),
  banco: yup.string().required("Insira o nome do banco"),
  operacao: yup.string().required("Selecione uma operação"),
  convenio: yup.string().required("Selecione um convênio"),
  iletrado: yup.string().required("Selecione uma opção"),
  tipo_contrato: yup.string().required("Selecione uma opção"),
  documentacao_salva: yup.string().required("Selecione uma opção"),
  status_comissao: yup.string().required("Selecione uma opção"),
});
