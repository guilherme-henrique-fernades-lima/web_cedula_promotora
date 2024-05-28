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
import MenuItem from "@mui/material/MenuItem";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import { TP_CONVENIO, TP_OPERACAO } from "@/helpers/constants";

//Schema validation
import { contratoSchema } from "@/schemas/contratoSchema";

export default function CadastrarContrato(props) {
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
    resolver: yupResolver(contratoSchema),
  });

  useEffect(() => {
    if (session?.user?.token) {
      getConveniosPicklist();
      getOperacoesPicklist();
      getCorretoresPicklist();
      getPromotorasPicklist();
      getBancosPicklist();
    }
  }, [session?.user?.token]);

  const [loadingButton, setLoadingButton] = useState(false);

  const [id, setId] = useState("");
  const [nr_contrato, setNrContrato] = useState("");
  const [promotora, setPromotora] = useState("");
  const [dt_digitacao, setDtDigitacao] = useState(null);
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

  //States dos dados dos picklists
  const [convenioPicklist, setConvenioPicklist] = useState([]);
  const [operacaoPicklist, setOperacaoPicklist] = useState([]);
  const [bancoPicklist, setBancoPicklist] = useState([]);
  const [corretorPicklist, setCorretorPicklist] = useState([]);
  const [promotoraPicklist, setPromotoraPicklist] = useState([]);

  function getPayload() {
    const data = {
      //id: id,
      promotora: promotora.toUpperCase(),
      dt_digitacao: dt_digitacao
        ? moment(dt_digitacao).format("YYYY-MM-DD")
        : null,
      nr_contrato: nr_contrato,
      no_cliente: no_cliente.toUpperCase(),
      cpf: cpf,
      convenio: convenio,
      operacao: operacao,
      banco: banco.toUpperCase(),
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
      porcentagem: parseFloat(porcentagem),
      corretor: corretor.toUpperCase(),
    };

    return data;
  }

  async function getConveniosPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/convenios/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setConvenioPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getOperacoesPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/operacoes/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setOperacaoPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getCorretoresPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/corretores/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setCorretorPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getPromotorasPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/promotoras/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setPromotoraPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getBancosPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/bancos/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setBancoPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function salvarContrato() {
    setLoadingButton(true);
    const payload = getPayload();

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
      setValue("no_cliente", json.nome);
    } else {
      setNoCliente("");
      resetField("no_cliente");
      toast.error(
        "Cliente não existe na base de dados do callcenter, insira manualmente ou cadastre-o."
      );
    }
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setId("");
    setPromotora("");
    setDtDigitacao(null);
    setNrContrato("");
    setNoCliente("");
    setCpf("");
    setConvenio("");
    setOperacao("");
    setBanco("");
    setVlContrato("");
    setQtParcelas("");
    setVlParcela("");
    setDtPagCliente(null);
    setDtPagComissao(null);
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
              label="Tipo de promotora (ANTIGO)"
              placeholder="Insira a promotora"
              size="small"
              value={promotora}
              autoComplete="off"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setPromotora(e.target.value);
              }}
            />

            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.promotora?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("promotora")}
              error={Boolean(errors.promotora)}
              select
              fullWidth
              label="Promotora"
              size="small"
              value={promotora}
              helperText={errors.promotora?.message}
              onChange={(e) => {
                setPromotora(e.target.value);
              }}
            >
              {promotoraPicklist?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
              {errors?.cpf?.message}
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
            <TextField
              {...register("convenio")}
              error={Boolean(errors.convenio)}
              select
              fullWidth
              label="Convênio (ANTIGO)"
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
              {...register("convenio")}
              error={Boolean(errors.convenio)}
              select
              fullWidth
              label="Convênio"
              size="small"
              value={convenio}
              helperText={errors.convenio?.message}
              onChange={(e) => {
                setConvenio(e.target.value);
              }}
            >
              {convenioPicklist?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("operacao")}
              error={Boolean(errors.operacao)}
              select
              fullWidth
              label="Operação (ANTIGO)"
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
              {...register("operacao")}
              error={Boolean(errors.operacao)}
              select
              fullWidth
              label="Operação"
              size="small"
              value={operacao}
              helperText={errors?.operacao?.message}
              onChange={(e) => {
                setOperacao(e.target.value);
              }}
            >
              {operacaoPicklist?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
              label="Banco (ANTIGO)"
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
              {...register("banco")}
              error={Boolean(errors.banco)}
              select
              fullWidth
              label="Banco"
              size="small"
              value={banco}
              helperText={errors.banco?.message}
              onChange={(e) => {
                setBanco(e.target.value);
              }}
            >
              {bancoPicklist?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <Controller
              name="vl_contrato"
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
                    setVlContrato(values?.floatValue);
                  }}
                  error={Boolean(errors.vl_contrato)}
                  size="small"
                  label="Valor do contrato"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
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
            <Controller
              name="vl_parcela"
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
                    setVlParcela(values?.floatValue);
                  }}
                  error={Boolean(errors.vl_parcela)}
                  size="small"
                  label="Valor da parcela"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
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
                disableHighlightToday
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <Controller
              name="porcentagem"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  decimalSeparator=","
                  isNumericString
                  suffix="%"
                  allowEmptyFormatting
                  onValueChange={(values) => {
                    setPorcentagem(values?.floatValue);
                  }}
                  //Aqui pra baixo textfield
                  error={Boolean(errors.porcentagem)}
                  size="small"
                  label="(%) Porcentagem"
                  placeholder="% de juros"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.porcentagem?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <Controller
              name="vl_comissao"
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
                    setVlComissao(values?.floatValue);
                  }}
                  error={Boolean(errors.vl_comissao)}
                  size="small"
                  label="Valor da comissão"
                  placeholder="R$ 0,00"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  fullWidth
                  inputProps={{ maxLength: 16 }}
                />
              )}
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.vl_comissao?.message}
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
              label="Corretor(a) (ANTIGO)"
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

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("corretor")}
              error={Boolean(errors.corretor)}
              select
              fullWidth
              label="Corretor(a)"
              size="small"
              value={corretor}
              helperText={errors.corretor?.message}
              onChange={(e) => {
                setCorretor(e.target.value);
              }}
            >
              {corretorPicklist?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
