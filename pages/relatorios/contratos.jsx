import { useState, useEffect } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import { formatarData, formatarValorBRL } from "@/helpers/utils";
import Spinner from "@/components/Spinner";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

//Constants
import { TP_CONVENIO, TP_OPERACAO } from "@/helpers/constants";

//Formatters
import {
  converterDataParaJS,
  formatarCPFSemAnonimidade,
} from "@/helpers/utils";

//Schema validation
import { contratoSchema } from "@/schemas/contratoSchema";

//Icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

var DATA_HOJE = new Date();

export default function RelatorioContratos() {
  const { data: session } = useSession();
  const [contratos, setContratos] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);

  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());

  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingDataFetch, setLoadingDataFetch] = useState(true);
  const [openDialogExcluir, setOpenDialogExcluir] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(contratoSchema),
  });

  useEffect(() => {
    getContratos();
  }, [session?.user]);

  const handleOpenDialogExcluir = () => {
    setOpenDialogExcluir(!openDialogExcluir);
  };

  async function excluirContrato() {
    setLoadingButton(true);

    const response = await fetch(`/api/relatorios/contratos/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      toast.success("Contrato excluída com sucesso");
      getContratos();
      setId("");
      handleOpenDialogExcluir();
    } else {
      toast.error("Erro ao excluir contrato");
    }

    setLoadingButton(false);
  }

  async function getContratos() {
    setLoadingDataFetch(true);
    const response = await fetch(
      `/api/relatorios/contratos/?dt_inicio=${moment(dataInicio).format(
        "YYYY-MM-DD"
      )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      }
    );

    const json = await response.json();
    setContratos(json);

    setLoadingDataFetch(false);
  }

  async function editarDadosContrato() {
    setLoadingButton(true);

    const payload = getPayload();

    const response = await fetch(`/api/relatorios/contratos/?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Contrato atualizado com sucesso");
      getContratos();
    } else {
      toast.error("Erro ao atualizar contrato");
    }

    setLoadingButton(false);
  }

  function getPayload() {
    const data = {
      id: id,
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
      corretor: corretor,
    };

    return data;
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

  function getDataForEdit(data) {
    clearErrors();

    setValue("contrato", data.nr_contrato);
    setValue("promotora", data.promotora);
    setValue("no_cliente", data.no_cliente);
    setValue("cpf", formatarCPFSemAnonimidade(data.cpf));
    setValue("convenio", data.convenio);
    setValue("operacao", data.operacao);
    setValue("banco", data.banco);
    setValue("vl_contrato", parseFloat(data.vl_contrato));
    setValue("vl_parcela", parseFloat(data.vl_parcela));
    setValue("vl_comissao", parseFloat(data.vl_comissao));
    setValue("porcentagem", data.porcentagem);
    setValue("corretor", data.corretor);

    setId(data.id);
    setPromotora(data.promotora);
    setDtDigitacao(converterDataParaJS(data.dt_digitacao));
    setNrContrato(data.nr_contrato);
    setNoCliente(data.no_cliente);
    setCpf(formatarCPFSemAnonimidade(data.cpf));
    setConvenio(data.convenio);
    setOperacao(data.operacao);
    setBanco(data.banco);
    setVlContrato(data.vl_contrato);
    setQtParcelas(data.qt_parcelas);
    setVlParcela(data.vl_parcela);
    setDtPagCliente(converterDataParaJS(data.dt_pag_cliente));
    setDtPagComissao(converterDataParaJS(data.dt_pag_comissao));
    setVlComissao(data.vl_comissao);
    setPorcentagem(data.porcentagem);
    setCorretor(data.corretor);
  }

  const columns = [
    {
      field: "id",
      headerName: "AÇÃO",
      renderHeader: (params) => <strong>AÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Stack direction="row">
            <Tooltip title="Editar contrato" placement="top">
              <IconButton
                onClick={() => {
                  setShowEditForm(!showEditForm);
                  getDataForEdit(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deletar contrato" placement="top">
              <IconButton
                color="error"
                sx={{ ml: 1 }}
                onClick={() => {
                  setId(params.value);
                  handleOpenDialogExcluir();
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "promotora",
      headerName: "PROMOTORA",
      renderHeader: (params) => <strong>PROMOTORA</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_digitacao",
      headerName: "DATA DIGITAÇÃO",
      renderHeader: (params) => <strong>DATA DIGITAÇÃO</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "nr_contrato",
      headerName: "NR. CONTRATO",
      renderHeader: (params) => <strong>NR. CONTRATO</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "no_cliente",
      headerName: "NOME CLIENTE",
      renderHeader: (params) => <strong>NOME CLIENTE</strong>,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cpf",
      headerName: "CPF CLIENTE",
      renderHeader: (params) => <strong>CPF CLIENTE</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarCPFSemAnonimidade(params.value);
        }
      },
    },
    {
      field: "convenio",
      headerName: "CONVÊNIO",
      renderHeader: (params) => <strong>CONVÊNIO</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "operacao",
      headerName: "OPERAÇÃO",
      renderHeader: (params) => <strong>OPERAÇÃO</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "banco",
      headerName: "BANCO",
      renderHeader: (params) => <strong>BANCO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_contrato",
      headerName: "VLR. CONTRATO",
      renderHeader: (params) => <strong>VLR. CONTRATO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "qt_parcelas",
      headerName: "QTD. PARCELAS",
      renderHeader: (params) => <strong>QTD. PARCELAS</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_parcela",
      headerName: "VLR. PARCELA",
      renderHeader: (params) => <strong>VLR. PARCELA</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "dt_pag_cliente",
      headerName: "DT. PAG. CLIENTE",
      renderHeader: (params) => <strong>DT. PAG. CLIENTE</strong>,
      minWidth: 230,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "dt_pag_comissao",
      headerName: "DT. PAG. COMISSÃO",
      renderHeader: (params) => <strong>DT. PAG. COMISSÃO</strong>,
      minWidth: 230,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "vl_comissao",
      headerName: "VLR. COMISSÃO",
      renderHeader: (params) => <strong>VLR. COMISSÃO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "porcentagem",
      headerName: "(%) PORCENTAGEM",
      renderHeader: (params) => <strong>(%) PORCENTAGEM</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "corretor",
      headerName: "CORRETOR",
      renderHeader: (params) => <strong>CORRETOR</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  try {
    var rows = contratos?.data?.map((row) => {
      return {
        id: row.id,
        promotora: row.promotora,
        dt_digitacao: row.dt_digitacao,
        nr_contrato: row.nr_contrato,
        no_cliente: row.no_cliente,
        cpf: row.cpf,
        convenio: row.convenio,
        operacao: row.operacao,
        banco: row.banco,
        vl_contrato: row.vl_contrato,
        qt_parcelas: row.qt_parcelas,
        vl_parcela: row.vl_parcela,
        dt_pag_cliente: row.dt_pag_cliente,
        dt_pag_comissao: row.dt_pag_comissao,
        vl_comissao: row.vl_comissao,
        porcentagem: row.porcentagem,
        corretor: row.corretor,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de contratos">
      <Toaster position="bottom-center" reverseOrder={true} />
      {showEditForm && (
        <Fade in={showEditForm}>
          <Button
            disableElevation
            variant="outlined"
            onClick={() => {
              setShowEditForm(!showEditForm);
              clearStatesAndErrors();
              setLoadingButton(false);
            }}
            sx={{ mt: 2 }}
            startIcon={<ArrowBackIosRoundedIcon />}
          >
            VOLTAR
          </Button>
        </Fade>
      )}

      <Fade in={showEditForm}>
        <Box
          sx={{
            display: showEditForm ? "flex" : "none",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            width: "100%",
            mt: 4,
          }}
          component="form"
          onSubmit={handleSubmit(() => {
            editarDadosContrato();
          })}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <TextField
                {...register("promotora")}
                error={Boolean(errors.promotora)}
                fullWidth
                label="Tipo de despesa"
                size="small"
                value={promotora}
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
      </Fade>

      <Fade in={!showEditForm}>
        <Box sx={{ width: "100%", display: !showEditForm ? "block" : "none" }}>
          <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                <DesktopDatePicker
                  leftArrowButtonText="Mês anterior"
                  rightArrowButtonText="Próximo mês"
                  label="Início"
                  onChange={(newValue) => {
                    setDataInicio(newValue);
                  }}
                  value={dataInicio}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" />
                  )}
                  shouldDisableDate={(dateParam) => {
                    // if (dateParam < dataFim) {
                    //   return false;
                    // } else if (dateParam > dataFim) {
                    //   return true;
                    // }
                  }}
                  
                  disableHighlightToday
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                <DesktopDatePicker
                  leftArrowButtonText="Mês anterior"
                  rightArrowButtonText="Próximo mês"
                  label="Fim"
                  onChange={(newValue) => {
                    setDataFim(newValue);
                  }}
                  value={dataFim}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" />
                  )}
                  shouldDisableDate={(dateParam) => {
                    // if (dateParam > dataInicio) {
                    //   return false;
                    // } else if (dateParam < dataInicio) {
                    //   return true;
                    // }
                  }}
                  
                  disableHighlightToday
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                onClick={getContratos}
              >
                PESQUISAR
              </Button>
            </Grid>
          </Grid>

          {loadingDataFetch ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
                mb: 5,
              }}
            >
              <Spinner />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Total contratos: {""}
                  {contratos?.indicadores?.vl_contrato
                    ? formatarValorBRL(contratos?.indicadores?.vl_comissao)
                    : formatarValorBRL(0)}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Total parcelas: {""}
                  {contratos?.indicadores?.vl_parcela
                    ? formatarValorBRL(contratos?.indicadores?.vl_parcela)
                    : formatarValorBRL(0)}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Total comissão: {""}
                  {contratos?.indicadores?.vl_comissao
                    ? formatarValorBRL(contratos?.indicadores?.vl_comissao)
                    : formatarValorBRL(0)}
                </Typography>
              </Box>

              <DataTable rows={rows} columns={columns} />
            </>
          )}
        </Box>
      </Fade>

      <Dialog
        open={openDialogExcluir}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
          Deseja deletar o contrato?
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              handleOpenDialogExcluir();
              setId("");
            }}
          >
            CANCELAR
          </Button>

          <LoadingButton
            onClick={excluirContrato}
            color="error"
            variant="contained"
            disableElevation
            loading={loadingButton}
          >
            EXCLUIR
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </ContentWrapper>
  );
}
