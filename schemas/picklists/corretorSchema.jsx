import * as yup from "yup";

export const corretorSchema = yup.object().shape({
  name: yup.string().required("Insira o nome do corretor"),
  is_active: yup.string().required("Selecione uma opção"),
});
