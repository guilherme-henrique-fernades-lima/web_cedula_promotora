import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import moment from "moment";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import {
  formatarData,
  formatarValorBRL,
  converterDataParaJS,
  renderTipoPagamentoEmprestimo,
  formatarCPFSemAnonimidade,
  formatarTelefone,
  formatarCEP,
} from "@/helpers/utils";
import Spinner from "@/components/Spinner";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InputIcon from "@mui/icons-material/Input";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

//Schema validation
import { emprestimoSchema } from "@/schemas/emprestimoSchema";

var DATA_HOJE = new Date();

export default function RelatorioEmprestimos() {
  const { data: session } = useSession();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [emprestimos, setEmprestimos] = useState([]);

  const [emprestimoItem, setEmprestimoItem] = useState([]);

  const [showEditForm, setShowEditForm] = useState(false);
  const [loadingDataFetch, setLoadingDataFetch] = useState(true);
  const [openDialogExcluir, setOpenDialogExcluir] = useState(false);

  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());

  const [loadingButton, setLoadingButton] = useState(false);
  const [tpBaixaParcela, setTpBaixaParcela] = useState("");
  const [dadosEmprestimoItem, setDadosEmprestimoItem] = useState({});

  //Estados para armazenar os dados de cada row caso seja necessário habilitar a edição dos empréstimos
  const [id, setId] = useState("");
  const [dtEmprestimo, setDtEmprestimo] = useState(null);
  const [noCliente, setNoCliente] = useState("");
  const [vlEmprestimo, setVlEmprestimo] = useState("");
  const [vlCapital, setVlCapital] = useState("");
  const [vlJuros, setVlJuros] = useState("");
  const [vlTotal, setVlTotal] = useState("");
  const [qtParcela, setQtParcela] = useState("");
  const [observacao, setObservacao] = useState("");

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

  useEffect(() => {
    getEmprestimos();
  }, [session?.user]);

  const handleOpenDialogExcluir = () => {
    setOpenDialogExcluir(!openDialogExcluir);
  };

  const handleOpenCloseModal = () => setOpenModal(!openModal);

  const handleOpenCloseDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleRadioChange = (event) => {
    setTpBaixaParcela(event.target.value);
  };

  async function excluirEmprestimo() {
    setLoadingButton(true);

    const response = await fetch(`/api/relatorios/emprestimos/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      toast.success("Empréstimo excluído com sucesso");
      getEmprestimos();
      setId("");
      handleOpenDialogExcluir();
    } else {
      toast.error("Erro ao excluir empréstimo");
    }

    setLoadingButton(false);
  }

  async function editarDadosEmprestimo() {
    setLoadingButton(true);

    const payload = getPayload();
    console.log(payload);

    const response = await fetch(`/api/relatorios/emprestimos/?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Empréstimo atualizado com sucesso");
      getEmprestimos();
    } else {
      toast.error("Erro ao atualizar empréstimo");
    }

    setLoadingButton(false);
  }

  function getPayload() {
    const data = {
      id: id,
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

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setId("");
    setDtEmprestimo(null);
    setNoCliente("");
    setVlEmprestimo("");
    setVlCapital("");
    setVlJuros("");
    setVlTotal("");
    setQtParcela("");
    setObservacao("");
  }

  function getDataForEdit(data) {
    clearErrors();

    setValue("noCliente", data.no_cliente);
    setValue("vlEmprestimo", data.vl_emprestimo);
    setValue("vlCapital", data.vl_capital);
    setValue("vlJuros", data.vl_juros);
    setValue("vlTotal", data.vl_total);
    setValue("qtParcela", data.qt_parcela);
    setValue("observacao", data.observacao);

    setId(data.id);
    setDtEmprestimo(converterDataParaJS(data.dt_emprestimo));
    setNoCliente(data.no_cliente);
    setVlEmprestimo(data.vl_emprestimo);
    setVlCapital(data.vl_capital);
    setVlJuros(data.vl_juros);
    setVlTotal(data.vl_total);
    setQtParcela(data.qt_parcela);
    setObservacao(data.observacao);
  }

  async function getEmprestimos() {
    setLoadingDataFetch(true);
    const response = await fetch(
      `/api/relatorios/emprestimos/?dt_inicio=${moment(dataInicio).format(
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
    setEmprestimos(json);

    setLoadingDataFetch(false);
  }

  async function getEmprestimoItem(idEmprestimo) {
    const response = await fetch(
      `/api/relatorios/emprestimos-item/?id=${idEmprestimo}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      }
    );

    if (response.ok) {
      const json = await response.json();
      setEmprestimoItem(json);
    }
  }

  async function baixarParcelaJuros() {
    const payload = {
      id_emprestimo_item: dadosEmprestimoItem?.id,
      emprestimo: dadosEmprestimoItem?.emprestimo,
      dt_pagamento: moment(new Date()).format("YYYY-MM-DD"),
      tp_pagamento: tpBaixaParcela,
    };

    const response = await fetch(`/api/relatorios/emprestimos-item`, {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso!");
      handleOpenCloseDialog();
      setDadosEmprestimoItem({});
      setTpBaixaParcela("");
      handleOpenCloseModal();
    } else {
      toast.success("Erro na operação, tente novamente.");
    }
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
            {/* <Tooltip title="Editar dados do empréstimo" placement="top">
              <IconButton
                onClick={() => {
                  setShowEditForm(!showEditForm);
                  getDataForEdit(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Visualizar parcelas" placement="top">
              <IconButton
                onClick={() => {
                  getEmprestimoItem(params.value);
                  handleOpenCloseModal();
                }}
                sx={{ ml: 1 }}
              >
                <CurrencyExchangeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deletar empréstimo" placement="top">
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
      field: "dt_emprestimo",
      headerName: "DT. EMPRÉSTIMO",
      renderHeader: (params) => <strong>DT. EMPRÉSTIMO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "no_cliente",
      headerName: "NOME DO CLIENTE",
      renderHeader: (params) => <strong>NOME DO CLIENTE</strong>,
      minWidth: 300,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_emprestimo",
      headerName: "VLR. DO EMPRÉSTIMO",
      renderHeader: (params) => <strong>VLR. DO EMPRÉSTIMO</strong>,
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
      field: "vl_capital",
      headerName: "VLR. DO CAPITAL",
      renderHeader: (params) => <strong>VLR. DO CAPITAL</strong>,
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
      field: "vl_juros_um",
      headerName: "1 -  VLR. DO JUROS 10%",
      renderHeader: (params) => <strong>1 - VLR. DO JUROS 10%</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "vl_juros_dois",
      headerName: "1 - VLR. DO JUROS 10%",
      renderHeader: (params) => <strong>2 - VLR. DO JUROS 10%</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "vl_total",
      headerName: "VLR. TOTAL",
      renderHeader: (params) => <strong>VLR. TOTAL</strong>,
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
      field: "qt_parcela",
      headerName: "QTD. PARCELAS",
      renderHeader: (params) => <strong>QTD. PARCELAS</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "observacao",
      headerName: "OBSERVAÇÃO",
      renderHeader: (params) => <strong>OBSERVAÇÃO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cpf",
      headerName: "CPF",
      renderHeader: (params) => <strong>CPF</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarCPFSemAnonimidade(params.value);
        }
      },
    },
    {
      field: "logradouro",
      headerName: "LOGRADOURO",
      renderHeader: (params) => <strong>LOGRADOURO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "numLogr",
      headerName: "NÚMERO",
      renderHeader: (params) => <strong>NÚMERO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "complLogr",
      headerName: "COMPLEMENTO",
      renderHeader: (params) => <strong>COMPLEMENTO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "cep",
      headerName: "CEP",
      renderHeader: (params) => <strong>CEP</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarCEP(params.value);
        }
      },
    },
    {
      field: "bairro",
      headerName: "BAIRRO",
      renderHeader: (params) => <strong>BAIRRO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "cidade",
      headerName: "CIDADE",
      renderHeader: (params) => <strong>CIDADE</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "estado",
      headerName: "ESTADO",
      renderHeader: (params) => <strong>ESTADO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "telefone",
      headerName: "TELEFONE",
      renderHeader: (params) => <strong>TELEFONE</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarTelefone(params.value);
        }
      },
    },
  ];

  try {
    var rows = emprestimos?.data?.map((row) => {
      return {
        id: row.id,
        dt_emprestimo: row.dt_emprestimo,
        no_cliente: row.no_cliente,
        vl_emprestimo: row.vl_emprestimo,
        vl_capital: row.vl_capital,
        vl_juros: row.vl_juros,
        vl_juros_um: row.vl_juros / 2,
        vl_juros_dois: row.vl_juros / 2,
        vl_total: row.vl_total,
        qt_parcela: row.qt_parcela,
        observacao: row.observacao,
        cpf: row.cpf,
        logradouro: row.logradouro,
        numLogr: row.numLogr,
        complLogr: row.complLogr,

        cep: row.cep,
        bairro: row.bairro,
        cidade: row.cidade,
        estado: row.estado,
        telefone: row.telefone,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de empréstimos">
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
            editarDadosEmprestimo();
          })}
        >
          <Grid container spacing={1}>
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
                loading={loadingButton}
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
                  disableHighlightToday
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                onClick={getEmprestimos}
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
                  Total empréstimos: {""}
                  {emprestimos?.indicadores?.vl_emprestimo
                    ? formatarValorBRL(emprestimos?.indicadores?.vl_emprestimo)
                    : formatarValorBRL(0)}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Total capital: {""}
                  {emprestimos?.indicadores?.vl_capital
                    ? formatarValorBRL(emprestimos?.indicadores?.vl_capital)
                    : formatarValorBRL(0)}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  1 - Total juros 10%: {""}
                  {emprestimos?.indicadores?.vl_juros
                    ? formatarValorBRL(emprestimos?.indicadores?.vl_juros / 2)
                    : formatarValorBRL(0)}
                </Typography>

                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  2 - Total juros 10%: {""}
                  {emprestimos?.indicadores?.vl_juros
                    ? formatarValorBRL(emprestimos?.indicadores?.vl_juros / 2)
                    : formatarValorBRL(0)}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Total: {""}
                  {emprestimos?.indicadores?.vl_total
                    ? formatarValorBRL(emprestimos?.indicadores?.vl_total)
                    : formatarValorBRL(0)}
                </Typography>
              </Box>

              <DataTable rows={rows} columns={columns} />
            </>
          )}
        </Box>
      </Fade>

      <Modal
        open={openModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "8px",
              padding: "20px 30px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-start",
              flexDirection: "column",

              maxHeight: 500,
              maxHeight: "80%",
              overflowY: "auto",
              overflowX: "hidden",
              height: "auto",

              ["@media (max-width:600px)"]: {
                height: "100%",
                borderRadius: 0,
                maxHeight: "100%",
              },
            }}
          >
            <IconButton
              color="error"
              onClick={() => {
                clearStatesAndErrors();
                handleOpenCloseModal();
                setEmprestimoItem([]);
                setDadosEmprestimoItem({});
              }}
            >
              <CloseIcon />
            </IconButton>

            {emprestimoItem.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Spinner />
              </Box>
            ) : (
              <TableContainer sx={{ width: "100%", mt: 2 }}>
                <Table
                  size="small"
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    // "& .tableCellClasses.root": {
                    //   borderBottom: "none",
                    // },
                  }}
                >
                  <TableHead
                    sx={{
                      height: 50,
                      borderBottom: "1px solid #ccc",
                      overflow: "hidden",
                    }}
                  >
                    <TableRow sx={{ "& td": { border: 0 } }}>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        AÇÃO
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        DT. VENCIMENTO
                      </TableCell>
                      {/* <TableCell align="center" sx={{ fontWeight: 700 }}>
                        PARCELA
                      </TableCell> */}
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        DT. PAGAMENTO
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        TIPO PAGAMENTO
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log(emprestimoItem)}
                    {emprestimoItem?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {item.dt_pagamento ? (
                            <IconButton disabled onClick={() => {}}>
                              <TaskAltIcon color="success" />
                            </IconButton>
                          ) : (
                            <Tooltip
                              title="Dar baixa na parcela/juros"
                              placement="top"
                            >
                              <IconButton
                                onClick={() => {
                                  setDadosEmprestimoItem(item);
                                  handleOpenCloseDialog();
                                }}
                              >
                                <InputIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {item.dt_vencimento
                            ? formatarData(item.dt_vencimento)
                            : "---"}
                        </TableCell>
                        {/* <TableCell align="center">
                          {item.nr_parcela}/
                          {
                            emprestimoItem?.filter(
                              (item) => item.tp_pagamento != "JUROS"
                            ).length
                          }
                        </TableCell> */}
                        <TableCell align="center">
                          {item.dt_pagamento
                            ? formatarData(item.dt_pagamento)
                            : "---"}
                        </TableCell>
                        <TableCell align="center">
                          {renderTipoPagamentoEmprestimo(item.tp_pagamento)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openDialog}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <Fade in={openDialog}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "8px",
              padding: "20px 30px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column",

              maxHeight: 900,
              maxHeight: "80%",
              overflowY: "auto",
              overflowX: "hidden",
              //height: 300,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: 14, sm: 16, md: 16, lg: 18, xl: 18 },
                mb: 2,
              }}
            >
              O que deseja baixar?
            </Typography>
            <FormControl
              sx={{
                width: "100%",
                mb: 2,
              }}
              onChange={handleRadioChange}
            >
              <RadioGroup>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    cursor: "pointer",
                    padding: "10px 20px",
                    height: 50,
                    borderRadius: 28,

                    "&:hover": { backgroundColor: "#e6e6e6" },
                  }}
                  onClick={(e) => {
                    setTpBaixaParcela("JUROS");
                  }}
                >
                  <FormControlLabel
                    value="JUROS"
                    control={<Radio />}
                    checked={tpBaixaParcela == "JUROS" ? true : false}
                    onClick={(e) => {
                      setTpBaixaParcela("JUROS");
                    }}
                    sx={{ marginRight: 0 }}
                  />

                  <Typography>Juros</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    cursor: "pointer",
                    padding: "10px 20px",
                    height: 50,
                    borderRadius: 28,

                    "&:hover": { backgroundColor: "#e6e6e6" },
                  }}
                  onClick={(e) => {
                    setTpBaixaParcela("TOTAL");
                  }}
                >
                  <FormControlLabel
                    value="TOTAL"
                    control={<Radio />}
                    checked={tpBaixaParcela == "TOTAL" ? true : false}
                    onClick={(e) => {
                      setTpBaixaParcela("TOTAL");
                    }}
                    sx={{ marginRight: 0 }}
                  />

                  <Typography>Parcela</Typography>
                </Box>
              </RadioGroup>
            </FormControl>

            <Stack
              direction="row"
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="text"
                color="error"
                sx={{ mr: 1 }}
                onClick={() => {
                  handleOpenCloseDialog();
                  setDadosEmprestimoItem({});
                  setTpBaixaParcela("");
                }}
              >
                CANCELAR
              </Button>
              <Button
                variant="contained"
                disableElevation
                color="success"
                onClick={baixarParcelaJuros}
                disabled={tpBaixaParcela == "" ? true : false}
              >
                CONCLUIR
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      <Dialog
        open={openDialogExcluir}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
          Deseja deletar o empréstimo?
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
            onClick={excluirEmprestimo}
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
