import * as yup from "yup";

export const resetPassword = yup.object().shape({
  newPassword: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmNewPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([yup.ref("newPassword"), null], "As senhas precisam ser iguais"),
});
