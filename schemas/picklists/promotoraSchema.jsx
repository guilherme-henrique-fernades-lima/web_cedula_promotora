import * as yup from "yup";

export const promotoraSchema = yup.object().shape({
  name: yup
    .string()
    .required("Insira o nome da promotora")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  is_active: yup.string().required("Selecione uma opção"),
});
