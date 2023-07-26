import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import moment from "moment";
import { NumericFormat } from "react-number-format";

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
  renderNaturezaDespesa,
  renderTipoDespesa,
} from "@/helpers/utils";
import Spinner from "@/components/Spinner";

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
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

//Schema validation
import { despesaSchema } from "@/schemas/despesaSchema";

var DATA_HOJE = new Date();

export default function RelatorioDespesas() {
  const { data: session } = useSession();
  const [despesas, setDespesas] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);

  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());

  const [loadingDataFetch, setLoadingDataFetch] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [id, setId] = useState("");
  const [dataVencimentoDespesa, setDataVencimentoDespesa] = useState(null);
  const [descricaoDespesa, setDescricaoDespesa] = useState("");
  const [valorDespesa, setValorDespesa] = useState("");
  const [situacaoPagamentoDespesa, setSituacaoPagamentoDespesa] = useState("");
  const [naturezaDespesa, setNaturezaDespesa] = useState("");
  const [tipoDespesa, setTipoDespesa] = useState("");

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
    getDespesas();
  }, [session?.user]);

  async function editarDadosDespesa() {
    setLoadingButton(true);

    const payload = getPayload();

    const response = await fetch(`/api/relatorios/despesas/?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Despesa atualizada com sucesso");
      getDespesas();
    } else {
      toast.error("Erro ao atualizar despesa");
    }

    setLoadingButton(false);
  }

  function getPayload() {
    const payload = {
      id: id,
      descricao: descricaoDespesa,
      dt_vencimento: dataVencimentoDespesa
        ? moment(dataVencimentoDespesa).format("YYYY-MM-DD")
        : null,
      valor: parseFloat(valorDespesa),
      situacao: situacaoPagamentoDespesa,
      natureza_despesa: naturezaDespesa,
      tp_despesa: tipoDespesa,
    };

    return payload;
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();
    setDataVencimentoDespesa("");
    setDescricaoDespesa("");
    setValorDespesa("");
    setSituacaoPagamentoDespesa("");
    setNaturezaDespesa("");
    setTipoDespesa("");
  }

  async function getDespesas() {
    setLoadingDataFetch(true);
    const response = await fetch(
      `/api/relatorios/despesas/?dt_inicio=${moment(dataInicio).format(
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
    setDespesas(json);

    setLoadingDataFetch(false);
  }

  function getDataForEdit(data) {
    console.log(data);
    clearErrors();

    setValue("descricaoDespesa", data.descricao);
    setValue("valorDespesa", data.valor);
    setValue("situacaoPagamentoDespesa", data.situacao);
    setValue("tipoDespesa", data.tp_despesa);
    setValue("naturezaDespesa", data.natureza_despesa);

    setId(data.id);
    setDescricaoDespesa(data.descricao);
    setDataVencimentoDespesa(converterDataParaJS(data.dt_vencimento));
    setValorDespesa(data.valor);
    setSituacaoPagamentoDespesa(data.situacao);
    setNaturezaDespesa(data.natureza_despesa);
    setTipoDespesa(data.tp_despesa);
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
      field: "dt_vencimento",
      headerName: "DT. VENCIMENTO",
      renderHeader: (params) => <strong>DT. VENCIMENTO</strong>,
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
      field: "descricao",
      headerName: "DESCRIÇÃO",
      renderHeader: (params) => <strong>DESCRIÇÃO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "valor",
      headerName: "VALOR",
      renderHeader: (params) => <strong>VALOR</strong>,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "situacao",
      headerName: "SITUAÇÃO",
      renderHeader: (params) => <strong>SITUAÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "tp_despesa",
      headerName: "TIPO DE DESPESA",
      renderHeader: (params) => <strong>TIPO DE DESPESA</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return renderTipoDespesa(params.value);
        }
      },
    },
    {
      field: "natureza_despesa",
      headerName: "NATUREZA DA DESPESA",
      renderHeader: (params) => <strong>NATUREZA DA DESPESA</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return renderNaturezaDespesa(params.value);
        }
      },
    },
  ];

  try {
    var rows = despesas?.data?.map((row) => {
      return {
        id: row.id,
        dt_vencimento: row.dt_vencimento,
        descricao: row.descricao ? row.descricao.toUpperCase() : row.descricao,
        valor: row.valor,
        situacao: row.situacao,
        tp_despesa: row.tp_despesa,
        natureza_despesa: row.natureza_despesa
          ? row.natureza_despesa
          : row.natureza_despesa,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de despesas">
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
            editarDadosDespesa();
          })}
        >
          <Grid container spacing={1}>
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
                onClick={getDespesas}
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
                  Total de despesas:
                  {(despesas?.data?.length && despesas?.data?.length) || 0}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Valor total:
                  {despesas?.indicadores?.total
                    ? formatarValorBRL(despesas?.indicadores?.total)
                    : 0}
                </Typography>
              </Box>
              <DataTable rows={rows} columns={columns} />
            </>
          )}

          {/* {despesas?.length == 0 ? (
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
                  alignItems: "center",
                  justifyContent: "flex-start",
                  // width: 240,
                  height: 70,
                  borderRadius: "14px",
                  // background:
                  //   "linear-gradient(135deg, #b1ea4d 0%,#459522 100%)",
                }}
              >
                <MonetizationOnIcon sx={{ fontSize: 38, color: "#0f0f0f" }} />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#0f0f0f", ml: 1 }}>
                    Total de despesas: {despesas?.data?.length || 0}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: "#0f0f0f", ml: 1 }}>
                    Valor total:
                    {despesas?.indicadores?.total
                      ? formatarValorBRL(despesas?.indicadores?.total)
                      : 0}
                  </Typography>
                </Box>
              </Box>
              <DataTable rows={rows} columns={columns} />
            </>
          )} */}
        </Box>
      </Fade>
    </ContentWrapper>
  );
}
