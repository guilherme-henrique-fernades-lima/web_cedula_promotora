import * as yup from "yup";

export const operacaoSchema = yup.object().shape({
  name: yup.string().required("Insira o nome da operação"),
  is_active: yup.string().required("Selecione uma opção"),
});
