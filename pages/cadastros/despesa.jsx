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
import { despesaSchema } from "@/schemas/despesaSchema";

export default function CadastrarDespesa() {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(desepesaSchema),
  });

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [dataVencimentoDespesa, setDataVencimentoDespesa] = useState(null);
  const [descricaoDespesa, setDescricaoDespesa] = useState("");
  const [valorDespesa, setValorDespesa] = useState("");
  const [situacaoPagamentoDespesa, setSituacaoPagamentoDespesa] = useState("");
  const [naturezaDespesa, setNaturezaDespesa] = useState("");
  const [tipoDespesa, setTipoDespesa] = useState("");

  const handleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  function getPayload() {
    const data = {
      dt_vencimento: dataVencimentoDespesa
        ? moment(dataVencimentoDespesa).format("YYYY-MM-DD")
        : null,
      descricao: descricaoDespesa.toUpperCase(),
      valor: parseFloat(valorDespesa),
      situacao: situacaoPagamentoDespesa,
      tp_despesa: tipoDespesa,
      natureza_despesa: naturezaDespesa,
    };

    return data;
  }

  async function salvarDespesa() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch("/api/cadastros/despesa", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Despesa cadastrada com sucesso!");
      clearStatesAndErrors();
    } else {
      toast.error("Erro ao cadastrar despesa.");
    }

    setLoadingButton(false);
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();
    setDataVencimentoDespesa(null);
    setDescricaoDespesa("");
    setValorDespesa("");
    setTipoDespesa("");
    setNaturezaDespesa("");
    setSituacaoPagamentoDespesa("");
  }

  return (
    <ContentWrapper title="Cadastrar despesa">
      <Toaster position="bottom-center" reverseOrder={true} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        component="form"
        sx={{ width: "100%" }}
        onSubmit={handleSubmit(() => {
          salvarDespesa();
        })}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data de vencimento"
                value={dataVencimentoDespesa}
                onChange={(newValue) => {
                  setDataVencimentoDespesa(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    autoComplete="off"
                  />
                )}
                disableFuture
                disableHighlightToday
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("descricaoDespesa")}
              error={Boolean(errors.descricaoDespesa)}
              value={descricaoDespesa}
              onChange={(e) => {
                setDescricaoDespesa(e.target.value);
              }}
              size="small"
              label="Descrição da despesa"
              placeholder="Insira descrição"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.descricaoDespesa?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("valorDespesa")}
              error={Boolean(errors.valorDespesa)}
              value={valorDespesa}
              onChange={(e) => {
                setValorDespesa(e.target.value);
              }}
              size="small"
              label="Valor da despesa"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.valorDespesa?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("situacaoPagamentoDespesa")}
              error={Boolean(errors.situacaoPagamentoDespesa)}
              select
              fullWidth
              label="Situação"
              size="small"
              value={situacaoPagamentoDespesa}
              onChange={(e) => {
                setSituacaoPagamentoDespesa(e.target.value);
              }}
            >
              {SITUACAO_PAGAMENTO.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.situacaoPagamentoDespesa?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("naturezaDespesa")}
              error={Boolean(errors.naturezaDespesa)}
              select
              fullWidth
              label="Natureza da despesa"
              size="small"
              value={naturezaDespesa}
              onChange={(e) => {
                setNaturezaDespesa(e.target.value);
              }}
            >
              {NATUREZA_DESPESA.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.naturezaDespesa?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("tipoDespesa")}
              error={Boolean(errors.tipoDespesa)}
              select
              fullWidth
              label="Tipo de despesa"
              size="small"
              value={tipoDespesa}
              onChange={(e) => {
                setTipoDespesa(e.target.value);
              }}
            >
              {TIPO_DESPESA.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.tipoDespesa?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disableElevation
              loading={loadingButton}
              // fullWidth
            >
              SALVAR
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </ContentWrapper>
  );
}
