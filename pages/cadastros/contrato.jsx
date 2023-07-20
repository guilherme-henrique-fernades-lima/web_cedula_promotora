import { useState, useEffect } from "react";

//Next.js
import { useRouter } from "next/router";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";
import { useSession } from "next-auth/react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";

//Mui components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import {
  SITUACAO_PAGAMENTO,
  NATUREZA_DESPESA,
  TIPO_DESPESA,
} from "@/helpers/constants";

//Formatters
import { converterDataParaJS } from "@/helpers/utils";

const desepesaSchema = yup.object().shape({
  descricaoDespesa: yup.string().required("Descreva a despesa"),
  valorDespesa: yup.string().required("Insira o valor desta despesa"),
  situacaoPagamentoDespesa: yup
    .string()
    .required("Selecione uma situação de pagamento para esta despesa"),
  tipoDespesa: yup.string().required("Selecione o tipo desta despesa"),
  naturezaDespesa: yup.string().required("Selecione a natureza desta despesa"),
});

//Schema validation
import { contratoSchema } from "@/schemas/despesaSchema";

export default function CadastrarContrato() {
  const [contrato, setContrato] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(contratoSchema),
  });

  // id = models.BigAutoField(primary_key=True)
  // promotora = models.CharField(max_length=255, null=True, blank=True)
  // dt_digitacao = models.DateField(null=True, blank=True)
  // nr_contrato = models.CharField(max_length=255, null=True, blank=True)
  // no_cliente = models.CharField(max_length=255, null=True, blank=True)
  // cpf = models.CharField(max_length=255, null=True, blank=True)
  // convenio = models.CharField(max_length=255, null=True, blank=True)
  // operacao = models.CharField(max_length=255, null=True, blank=True)
  // banco = models.CharField(max_length=255, null=True, blank=True)
  // vl_contrato = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  // qt_parcelas = models.CharField(max_length=255, null=True, blank=True)
  // vl_parcela = models.CharField(max_length=255, null=True, blank=True)
  // dt_pag_cliente = models.DateField(null=True, blank=True)
  // dt_pag_comissao = models.CharField(max_length=255, null=True, blank=True)
  // vl_comissao = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  // porcentagem = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  // corretor = models.CharField(max_length=255, null=True, blank=True)

  return (
    <ContentWrapper title="Cadastrar contrato">
      <Box
        component="form"
        sx={{ width: "100%" }}
        // onSubmit={handleSubmit(() => {
        //   salvarDespesa();
        // })}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("contrato")}
              error={Boolean(errors.contrato)}
              value={contrato}
              onChange={(e) => {
                setContrato(e.target.value);
              }}
              size="small"
              label="Número do contrato"
              placeholder="Insira o número do contrato"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.contrato?.message}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </ContentWrapper>
  );
}
