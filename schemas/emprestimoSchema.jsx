import * as yup from "yup";

export const emprestimoSchema = yup.object().shape({
  noCliente: yup.string().required("O nome é obrigatório"),
  vlEmprestimo: yup.string().required("Insira o valor do empréstimo"),
  qtParcela: yup.string().required("Insira a quantidade de parcelas"),
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
});
