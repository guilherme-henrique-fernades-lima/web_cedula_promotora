import * as yup from "yup";

export const despesaSchema = yup.object().shape({
  sgLoja: yup.string().required("Insira o nome da loja"),
  isActive: yup.string().required("Selecione uma opção"),
});
