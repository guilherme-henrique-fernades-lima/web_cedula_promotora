import * as yup from "yup";

export const convenioSchema = yup.object().shape({
  nome: yup.string().required("Insira o nome do convênio"),
  is_active: yup.string().required("Selecione uma opção"),
});
