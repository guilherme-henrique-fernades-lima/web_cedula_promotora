import * as yup from "yup";

export const despesaSchema = yup.object().shape({
  sgLoja: yup
    .string()
    .required("Insira o nome da loja")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  isActive: yup.string().required("Selecione uma opção"),
});
