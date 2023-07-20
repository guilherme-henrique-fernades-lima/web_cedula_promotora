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
import { TP_PROMOTORA } from "@/helpers/constants";

//Formatters
import { converterDataParaJS } from "@/helpers/utils";

//Schema validation
import { contratoSchema } from "@/schemas/despesaSchema";

export default function CadastrarContrato() {
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
    resolver: yupResolver(contratoSchema),
  });

  const [loadingButton, setLoadingButton] = useState(false);

  const [id, setId] = useState("");
  const [promotora, setPromotora] = useState("");
  const [dt_digitacao, setDtDigitacao] = useState(null);
  const [nr_contrato, setNrContrato] = useState("");
  const [no_cliente, setNoCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [convenio, setConvenio] = useState("");
  const [operacao, setOperacao] = useState("");
  const [banco, setBanco] = useState("");
  const [vl_contrato, setVlContrato] = useState("");
  const [qt_parcelas, setQtParcelas] = useState("");
  const [vl_parcela, setVlParcela] = useState("");
  const [dt_pag_cliente, setDtPagCliente] = useState("");
  const [dt_pag_comissao, setDtPagComissao] = useState("");
  const [vl_comissao, setVlComissao] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [corretor, setCorretor] = useState("");

  function getPayload() {
    const data = {
      id: id,
      promotora: promotora,
      dt_digitacao: dt_digitacao,
      nr_contrato: nr_contrato,
      no_cliente: no_cliente,
      cpf: cpf,
      convenio: convenio,
      operacao: operacao,
      banco: banco,
      vl_contrato: vl_contrato,
      qt_parcelas: qt_parcelas,
      vl_parcela: vl_parcela,
      dt_pag_cliente: dt_pag_cliente,
      dt_pag_comissao: dt_pag_comissao,
      vl_comissao: vl_comissao,
      porcentagem: porcentagem,
      corretor: corretor,
    };

    return data;
  }

  async function salvarContrato() {
    //setLoadingButton(true);
    const payload = getPayload();
    console.log(payload);

    const response = await fetch("/api/cadastros/contrato", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Contrato cadastrado com sucesso!");
      clearStatesAndErrors();
    } else {
      toast.error("Erro ao cadastrar o contrato.");
    }

    //setLoadingButton(false);
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setId("");
    setPromotora("");
    setDtDigitacao("");
    setNrContrato("");
    setNoCliente("");
    setCpf("");
    setConvenio("");
    setOperacao("");
    setBanco("");
    setVlContrato("");
    setQtParcelas("");
    setVlParcela("");
    setDtPagCliente("");
    setDtPagComissao("");
    setVlComissao("");
    setPorcentagem("");
    setCorretor("");
  }

  return (
    <ContentWrapper title="Cadastrar contrato">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box
        component="form"
        sx={{ width: "100%" }}
        onSubmit={handleSubmit(() => {
          salvarContrato();
        })}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              size="small"
              label="(%) Porcentagem"
              value={porcentagem}
              onChange={(e) => {
                setPorcentagem(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              disabled
            />
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
