import * as yup from "yup";

export const promotoraSchema = yup.object().shape({
  nome: yup.string().required("Insira o nome da promotora"),
  is_active: yup.string().required("Selecione uma opção"),
});
