import * as yup from "yup";

export const bancoSchema = yup.object().shape({
  nome: yup.string().required("Insira o nome do banco"),
  is_active: yup.string().required("Selecione uma opção"),
});
