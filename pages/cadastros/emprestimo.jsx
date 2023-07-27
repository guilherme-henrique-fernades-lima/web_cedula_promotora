import { useState, useEffect } from "react";

//Next.js
import { useRouter } from "next/router";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";

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

//Formatters
import { converterDataParaJS, formatarValorBRL } from "@/helpers/utils";

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
    resetField,
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(emprestimoSchema),
  });

  const [loadingButton, setLoadingButton] = useState(false);

  const [dtEmprestimo, setDtEmprestimo] = useState(new Date());
  const [noCliente, setNoCliente] = useState("");
  const [vlEmprestimo, setVlEmprestimo] = useState("");
  const [qtParcela, setQtParcela] = useState("");
  const [vlCapital, setVlCapital] = useState("");
  const [vlJuros, setVlJuros] = useState("");
  const [vlJurosUm, setVlJurosUm] = useState("");
  const [vlJurosDois, setVlJurosDois] = useState("");
  const [vlTotal, setVlTotal] = useState("");
  const [observacao, setObservacao] = useState("");

  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numLogr, setNumLogr] = useState("");
  const [complLogr, setComplLogr] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    if (vlEmprestimo && qtParcela) {
      const vlCapitalValue = parseFloat(vlEmprestimo) / parseInt(qtParcela);
      setVlCapital(vlCapitalValue.toFixed(2));

      const vlJurosValue = parseFloat(vlEmprestimo) * 0.1;
      setVlJurosUm(vlJurosValue.toFixed(2));

      const vlJurosValueDois = parseFloat(vlEmprestimo) * 0.1;
      setVlJurosDois(vlJurosValueDois.toFixed(2));

      const vlTotalValue =
        parseFloat(vlCapitalValue) +
        parseFloat(vlJurosValue) +
        parseFloat(vlJurosValueDois);

      setVlTotal(vlTotalValue.toFixed(2));
    } else {
      setVlCapital("");
      setVlTotal("");
      setVlJurosUm("");
      setVlJurosDois("");
    }
  }, [vlEmprestimo, qtParcela]);

  function getPayload() {
    const data = {
      dt_emprestimo: dtEmprestimo
        ? moment(dtEmprestimo).format("YYYY-MM-DD")
        : null,
      no_cliente: noCliente.toUpperCase(),
      vl_emprestimo: parseFloat(vlEmprestimo),
      vl_capital: parseFloat(vlCapital),
      vl_juros: parseFloat(vlJurosUm) + parseFloat(vlJurosDois),
      vl_total: parseFloat(vlTotal),
      qt_parcela: parseInt(qtParcela),
      observacao: observacao,

      cpf: cpf.replace(/\D/g, ""),
      logradouro: logradouro,
      numLogr: numLogr,
      complLogr: complLogr,
      cep: cep,
      bairro: bairro,
      cidade: cidade.replace(/\D/g, ""),
      estado: estado,
      telefone: telefone,
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

  async function getCliente(cpfSearch) {
    const response = await fetch(
      `/api/cadastros/contrato/?cpf=${cpfSearch.replace(/\D/g, "")}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      }
    );

    if (response.ok) {
      const json = await response.json();
      setNoCliente(json.nome);
      setValue("noCliente", json.nome);
    } else {
      setNoCliente("");
      resetField("noCliente");
      toast.error(
        "Cliente não existe na base de dados do callcenter, insira manualmente ou cadastre-o."
      );
    }
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setDtEmprestimo(null);
    setNoCliente("");
    setVlEmprestimo("");
    setVlCapital("");
    setVlTotal("");
    setQtParcela("");
    setObservacao("");
    setVlJurosUm("");
    setVlJurosDois("");
    setCpf("");
    setLogradouro("");
    setNumLogr("");
    setComplLogr("");
    setCep("");
    setTelefone("");
    setBairro("");
    setCidade("");
    setEstado("");
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
            <Controller
              name="vlEmprestimo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="R$ "
                  onValueChange={(values) => {
                    setVlEmprestimo(values?.floatValue);
                  }}
                  error={Boolean(errors.vlEmprestimo)}
                  size="small"
                  label="Valor do empréstimo"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.vlEmprestimo?.message}
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
              placeholder="Insira a quantidade de parcelas do empréstimo"
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

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              disabled
              value={
                vlCapital
                  ? formatarValorBRL(parseFloat(vlCapital))
                  : formatarValorBRL(parseFloat(0))
              }
              size="small"
              label="Valor do capital"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />

            {/* <Controller
              name="vlCapital"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  disabled
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="R$ "
                  size="small"
                  label="Valor do capital"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              disabled
              value={
                vlJurosUm
                  ? formatarValorBRL(parseFloat(vlJurosUm))
                  : formatarValorBRL(parseFloat(0))
              }
              size="small"
              label="1 - Valor dos juros 10%"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />

            {/* <Controller
              name="vlJurosUm"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  disabled
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="R$ "
                  size="small"
                  label="1 - Valor dos juros 10%"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            /> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              disabled
              value={
                vlJurosDois
                  ? formatarValorBRL(parseFloat(vlJurosDois))
                  : formatarValorBRL(parseFloat(0))
              }
              size="small"
              label="2 - Valor dos juros 10%"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />

            {/* <Controller
              name="vlJurosDois"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  disabled
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="R$ "
                  size="small"
                  label="2 - Valor dos juros 10%"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              disabled
              value={
                vlTotal
                  ? formatarValorBRL(parseFloat(vlTotal))
                  : formatarValorBRL(parseFloat(0))
              }
              size="small"
              label="Valor total"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />

            {/* <Controller
              name="vlTotal"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  disabled
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="R$ "
                  size="small"
                  label="Valor total"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            /> */}
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

          {/* NOVOS CAMPOS A PARTIR DAQUI */}

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              {...register("cpf")}
              error={Boolean(errors.cpf)}
              mask="999.999.999-99"
              maskChar={null}
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value);

                if (e.target.value?.length === 14) {
                  getCliente(e.target.value);
                }
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
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={logradouro}
              onChange={(e) => {
                setLogradouro(e.target.value);
              }}
              size="small"
              label="Endereço"
              placeholder="Insira o endereço"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={numLogr}
              onChange={(e) => {
                setNumLogr(e.target.value);
              }}
              size="small"
              label="Número"
              // placeholder=""
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={complLogr}
              onChange={(e) => {
                setComplLogr(e.target.value);
              }}
              size="small"
              label="Complemento"
              placeholder="Insira um complemento"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={cep}
              onChange={(e) => {
                setCep(e.target.value);
              }}
              size="small"
              label="CEP"
              placeholder="Insira o CEP"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={bairro}
              onChange={(e) => {
                setBairro(e.target.value);
              }}
              size="small"
              label="Bairro"
              placeholder="Insira o bairro"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={cidade}
              onChange={(e) => {
                setCidade(e.target.value);
              }}
              size="small"
              label="Bairro"
              placeholder="Insira a cidade"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              mask="(99) 9 9999-9999"
              maskChar={null}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="Telefone"
                  placeholder="00 00000-0000"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("qtParcela")}
              // error={Boolean(errors.qtParcela)}
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
              }}
              size="small"
              label="Bairro"
              placeholder="Selecione o estado"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 250 }}
            />
            {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.qtParcela?.message}
            </Typography> */}
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disableElevation
              loading={loadingButton}
            >
              SALVAR
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </ContentWrapper>
  );
}
