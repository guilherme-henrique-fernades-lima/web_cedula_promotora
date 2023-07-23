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

//Schema validation
import { emprestimoSchema } from "@/schemas/emprestimoSchema";

export default function CadastrarCobrança() {
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
    resolver: yupResolver(emprestimoSchema),
  });

  const [loadingButton, setLoadingButton] = useState(false);

  const [dtEmprestimo, setDtEmprestimo] = useState(null);
  const [noCliente, setNoCliente] = useState("");
  const [vlEmprestimo, setVlEmprestimo] = useState("");
  const [vlCapital, setVlCapital] = useState("");
  const [vlJuros, setVlJuros] = useState("");
  const [vlTotal, setVlTotal] = useState("");
  const [qtParcela, setQtParcela] = useState("");
  const [observacao, setObservacao] = useState("");

  function getPayload() {
    const data = {
      dt_emprestimo: dtEmprestimo
        ? moment(dtEmprestimo).format("YYYY-MM-DD")
        : null,
      no_cliente: noCliente.toUpperCase(),
      vl_emprestimo: parseFloat(vlEmprestimo),
      vl_capital: parseFloat(vlCapital),
      vl_juros: parseFloat(vlJuros),
      vl_total: parseFloat(vlTotal),
      qt_parcela: parseInt(qtParcela),
      observacao: observacao,
    };

    return data;
  }

  async function salvarEmprestimo() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch("/api/cadastros/emprestimo", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Empréstimo cadastrado com sucesso!");
      clearStatesAndErrors();
    } else {
      toast.error("Erro ao cadastrar o empréstimo.");
    }

    setLoadingButton(false);
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setDtEmprestimo(null);
    setNoCliente("");
    setVlEmprestimo("");
    setVlCapital("");
    setVlJuros("");
    setVlTotal("");
    setQtParcela("");
    setObservacao("");
  }

  return (
    <ContentWrapper title="Cadastrar empréstimo">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box
        component="form"
        sx={{ width: "100%" }}
        onSubmit={handleSubmit(() => {
          salvarEmprestimo();
        })}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data do empréstimo"
                value={dtEmprestimo}
                onChange={(newValue) => {
                  setDtEmprestimo(newValue);
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
              {...register("noCliente")}
              error={Boolean(errors.noCliente)}
              value={noCliente}
              onChange={(e) => {
                setNoCliente(e.target.value);
              }}
              size="small"
              label="Nome do cliente"
              placeholder="Insira o nome"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
              }
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.noCliente?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("vlEmprestimo")}
              error={Boolean(errors.vlEmprestimo)}
              value={vlEmprestimo}
              onChange={(e) => {
                setVlEmprestimo(e.target.value);
              }}
              size="small"
              label="Valor do empréstimo"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 10 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.vlEmprestimo?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("vlCapital")}
              error={Boolean(errors.vlCapital)}
              value={vlCapital}
              onChange={(e) => {
                setVlCapital(e.target.value);
              }}
              size="small"
              label="Valor do capital"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 10 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.vlCapital?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("vlJuros")}
              error={Boolean(errors.vlJuros)}
              value={vlJuros}
              onChange={(e) => {
                setVlJuros(e.target.value);
              }}
              size="small"
              label="Valor do juros"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 10 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.vlJuros?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("vlTotal")}
              error={Boolean(errors.vlTotal)}
              value={vlTotal}
              onChange={(e) => {
                setVlTotal(e.target.value);
              }}
              size="small"
              label="Valor total"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 10 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.vlTotal?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("qtParcela")}
              error={Boolean(errors.qtParcela)}
              value={qtParcela}
              onChange={(e) => {
                setQtParcela(e.target.value);
              }}
              size="small"
              label="Quantidade de parcelas"
              // placeholder=""
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 2 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              multiline
              rows={3}
              value={observacao}
              onChange={(e) => {
                setObservacao(e.target.value);
              }}
              size="small"
              label="Observação"
              placeholder="Insira a observação"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disableElevation
              //loading={loadingButton}
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
