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
import MenuItem from "@mui/material/MenuItem";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import { TP_CONVENIO, TP_OPERACAO } from "@/helpers/constants";

//Formatters
import { converterDataParaJS } from "@/helpers/utils";

//Schema validation
import { contratoSchema } from "@/schemas/contratoSchema";

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
  const [dt_pag_cliente, setDtPagCliente] = useState(null);
  const [dt_pag_comissao, setDtPagComissao] = useState(null);
  const [vl_comissao, setVlComissao] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [corretor, setCorretor] = useState("");

  // const MOCK_DATA = {
  //   id: id,
  //   promotora: "EFETIVA",
  //   dt_digitacao: "2023-07-21",
  //   nr_contrato: "111111111",
  //   no_cliente: "GLAYSON SILVA VISGUEIRA",
  //   cpf: "05251596308",
  //   convenio: "FGTS",
  //   operacao: "REFIN",
  //   banco: "BANCO DO BRASIL",
  //   vl_contrato: 200,
  //   qt_parcelas: "6",
  //   vl_parcela: 200,
  //   dt_pag_cliente: "2023-07-21",
  //   dt_pag_comissao: "2023-07-21",
  //   vl_comissao: 200,
  //   porcentagem: 2,
  //   corretor: "teste",
  // };

  function getPayload() {
    const data = {
      //id: id,
      promotora: promotora,
      dt_digitacao: dt_digitacao
        ? moment(dt_digitacao).format("YYYY-MM-DD")
        : null,
      nr_contrato: nr_contrato,
      no_cliente: no_cliente.toUpperCase(),
      cpf: cpf,
      convenio: convenio,
      operacao: operacao,
      banco: banco,
      vl_contrato: parseFloat(vl_contrato),
      qt_parcelas: qt_parcelas,
      vl_parcela: parseFloat(vl_parcela),
      dt_pag_cliente: dt_pag_cliente
        ? moment(dt_pag_cliente).format("YYYY-MM-DD")
        : null,
      dt_pag_comissao: dt_pag_comissao
        ? moment(dt_pag_comissao).format("YYYY-MM-DD")
        : null,
      vl_comissao: parseFloat(vl_comissao),
      porcentagem: porcentagem,
      corretor: corretor,
    };

    return data;
  }

  async function salvarContrato() {
    setLoadingButton(true);
    const payload = getPayload();
    // const payload = MOCK_DATA;
    console.log(payload);

    const response = await fetch("/api/cadastros/contrato", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    console.log(response);

    if (response.ok) {
      toast.success("Contrato cadastrado com sucesso!");
      clearStatesAndErrors();
    } else {
      toast.error("Erro ao cadastrar o contrato.");
    }

    setLoadingButton(false);
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
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("promotora")}
              error={Boolean(errors.promotora)}
              fullWidth
              label="Tipo de despesa"
              size="small"
              value={promotora}
              autoComplete="off"
              onChange={(e) => {
                setPromotora(e.target.value);
              }}
            />

            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.promotora?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data de digitação"
                value={dt_digitacao}
                onChange={(newValue) => {
                  setDtDigitacao(newValue);
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
              {...register("contrato")}
              error={Boolean(errors.contrato)}
              value={nr_contrato}
              onChange={(e) => {
                setNrContrato(e.target.value);
              }}
              size="small"
              label="Número do contrato"
              placeholder="Insira o contrato"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 50 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.contrato?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("no_cliente")}
              error={Boolean(errors.no_cliente)}
              value={no_cliente}
              onChange={(e) => {
                setNoCliente(e.target.value);
              }}
              size="small"
              label="Nome do cliente"
              placeholder="Insira o nome completo do cliente"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
              }
              inputProps={{ maxLength: 255 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.no_cliente?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              {...register("cpf")}
              error={Boolean(errors.cpf)}
              mask="999.999.999-99"
              maskChar={null}
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value);
              }}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="CPF"
                  placeholder="000.000.000-000"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            </InputMask>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.cpf?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("convenio")}
              error={Boolean(errors.convenio)}
              select
              fullWidth
              label="Convênio"
              size="small"
              value={convenio}
              onChange={(e) => {
                setConvenio(e.target.value);
              }}
            >
              {TP_CONVENIO.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.convenio?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("operacao")}
              error={Boolean(errors.operacao)}
              select
              fullWidth
              label="Operação"
              size="small"
              value={operacao}
              onChange={(e) => {
                setOperacao(e.target.value);
              }}
            >
              {TP_OPERACAO.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.operacao?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("banco")}
              error={Boolean(errors.banco)}
              value={banco}
              onChange={(e) => {
                setBanco(e.target.value);
              }}
              size="small"
              label="Banco"
              placeholder="Insira o nome do banco"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 255 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.banco?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("vl_contrato")}
              error={Boolean(errors.vl_contrato)}
              value={vl_contrato}
              onChange={(e) => {
                setVlContrato(e.target.value);
              }}
              size="small"
              label="Valor do contrato"
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
              {errors.vl_contrato?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qt_parcelas")}
              // error={Boolean(errors.qt_parcelas)}
              value={qt_parcelas}
              onChange={(e) => {
                setQtParcelas(e.target.value);
              }}
              size="small"
              label="Quantidade de parcelas"
              placeholder="Insira a quantidade de parcelas"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 5 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qt_parcelas?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("vl_parcela")}
              error={Boolean(errors.vl_parcela)}
              value={vl_parcela}
              onChange={(e) => {
                setVlParcela(e.target.value);
              }}
              size="small"
              label="Valor da parcela"
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
              {errors.vl_parcela?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data de pagamento ao cliente"
                value={dt_pag_cliente}
                onChange={(newValue) => {
                  setDtPagCliente(newValue);
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
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data de pagamento comissão"
                value={dt_pag_comissao}
                onChange={(newValue) => {
                  setDtPagComissao(newValue);
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
              {...register("vl_comissao")}
              error={Boolean(errors.vl_comissao)}
              value={vl_comissao}
              onChange={(e) => {
                setVlComissao(e.target.value);
              }}
              size="small"
              label="Valor da comissão"
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
              {errors.vl_comissao?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("porcentagem")}
              error={Boolean(errors.porcentagem)}
              value={porcentagem}
              onChange={(e) => {
                setPorcentagem(e.target.value);
              }}
              size="small"
              label="(%) Porcentagem"
              placeholder="% de juros"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
              inputProps={{ maxLength: 3 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.porcentagem?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("corretor")}
              error={Boolean(errors.corretor)}
              value={corretor}
              onChange={(e) => {
                setCorretor(e.target.value);
              }}
              size="small"
              label="Correto"
              placeholder="Insira o corretor"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 50 }}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.corretor?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disableElevation
              loading={loadingButton}
              //onClick={salvarContrato}
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
