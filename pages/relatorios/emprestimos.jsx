import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
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
import MenuItem from "@mui/material/MenuItem";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import {
  formatarData,
  formatarValorBRL,
  converterDataParaJS,
} from "@/helpers/utils";

//Constants
import {
  SITUACAO_PAGAMENTO,
  NATUREZA_DESPESA,
  TIPO_DESPESA,
} from "@/helpers/constants";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

//Schema validation
import { despesaSchema } from "@/schemas/despesaSchema";

var DATA_HOJE = new Date();

export default function RelatorioEmprestimos() {
  const { data: session } = useSession();
  const [emprestimos, setEmprestimos] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);

  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());

  const [loadingButton, setLoadingButton] = useState(false);

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
    resolver: yupResolver(despesaSchema),
  });

  useEffect(() => {
    getEmprestimos();
  }, [session?.user]);

  async function editarDadosEmprestimo() {
    setLoadingButton(true);

    const payload = getPayload();

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
      qt_parcela: qtParcela,
      observacao: observacao,
    };

    return data;
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

  function getDataForEdit(data) {
    console.log("data >>>> ", data);
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
    const response = await fetch(`/api/relatorios/emprestimos`, {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();
      setEmprestimos(json);
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
          <IconButton
            onClick={() => {
              setShowEditForm(!showEditForm);
              getDataForEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>
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
      field: "vl_juros",
      headerName: "VLR. DO JUROS",
      renderHeader: (params) => <strong>VLR. DO JUROS</strong>,
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
  ];

  try {
    var rows = emprestimos?.map((row) => {
      return {
        id: row.id,
        dt_emprestimo: row.dt_emprestimo,
        no_cliente: row.no_cliente,
        vl_emprestimo: row.vl_emprestimo,
        vl_capital: row.vl_capital,
        vl_juros: row.vl_juros,
        vl_total: row.vl_total,
        qt_parcela: row.qt_parcela,
        observacao: row.observacao,
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ backgroundColor: "red" }}
            >
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
                  disableFuture
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
                  disableFuture
                  disableHighlightToday
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                //onClick={getEmprestimos}
              >
                PESQUISAR
              </Button>
            </Grid>
          </Grid>
          <DataTable rows={rows} columns={columns} />
        </Box>
      </Fade>
    </ContentWrapper>
  );
}
