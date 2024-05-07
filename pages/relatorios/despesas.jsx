import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import { NumericFormat } from "react-number-format";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import {
  formatarData,
  formatarValorBRL,
  converterDataParaJS,
  renderNaturezaDespesa,
  renderTipoDespesa,
  renderLoja,
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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  const [openDialogExcluir, setOpenDialogExcluir] = useState(false);

  //States para dados do formulário
  const [id, setId] = useState("");
  const [dataVencimentoDespesa, setDataVencimentoDespesa] = useState(null);
  const [descricaoDespesa, setDescricaoDespesa] = useState("");
  const [valorDespesa, setValorDespesa] = useState("");
  const [situacaoPagamentoDespesa, setSituacaoPagamentoDespesa] = useState("");
  const [naturezaDespesa, setNaturezaDespesa] = useState("");
  const [tipoDespesa, setTipoDespesa] = useState("");
  const [tipoLoja, setTipoLoja] = useState("");
  const [picklist, setPicklistLojas] = useState([]);

  useEffect(() => {
    if (session?.user?.token) {
      getLojas();
      getDespesas();
    }
  }, [session?.user?.token]);

  async function getLojas() {
    try {
      const response = await fetch("/api/configuracoes/lojas/?ativas=true", {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setPicklistLojas(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    resolver: yupResolver(despesaSchema),
  });

  const handleOpenDialogExcluir = () => {
    setOpenDialogExcluir(!openDialogExcluir);
  };

  async function excluirDespesa() {
    setLoadingButton(true);

    const response = await fetch(`/api/relatorios/despesas/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      toast.success("Despesa excluída com sucesso");
      getDespesas();
      setId("");
      handleOpenDialogExcluir();
    } else {
      toast.error("Erro ao excluir despesa");
    }

    setLoadingButton(false);
  }

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
      id_loja: tipoLoja,
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
    setTipoLoja("");
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
    clearErrors();

    setValue("descricaoDespesa", data.descricao);
    setValue("valorDespesa", parseFloat(data.valor));
    setValue("situacaoPagamentoDespesa", data.situacao);
    setValue("tipoDespesa", data.tp_despesa);
    setValue("naturezaDespesa", data.natureza_despesa);
    setValue("tipoLoja", data.tipo_loja);

    setId(data.id);
    setDescricaoDespesa(data.descricao);
    setDataVencimentoDespesa(converterDataParaJS(data.dt_vencimento));
    setValorDespesa(data.valor);
    setSituacaoPagamentoDespesa(data.situacao);
    setNaturezaDespesa(data.natureza_despesa);
    setTipoDespesa(data.tp_despesa);
    setTipoLoja(data.tipo_loja);
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
            <Tooltip title="Editar despesa" placement="top">
              <IconButton
                onClick={() => {
                  setShowEditForm(!showEditForm);
                  getDataForEdit(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deletar despesa" placement="top">
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
    {
      field: "nome_loja",
      headerName: "NOME DA LOJA",
      renderHeader: (params) => <strong>NOME DA LOJA</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      flex: 1,
      // renderCell: (params) => {
      //   if (params.value) {
      //     return renderLoja(params.value);
      //   }
      // },
    },
    {
      field: "tipo_loja",
      headerName: "CÓD. DA LOJA",
      renderHeader: (params) => <strong>CÓD. DA LOJA</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      flex: 1,
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
        natureza_despesa: row.natureza_despesa,
        tipo_loja: row.id_loja,
        nome_loja: row.sg_loja,
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
              <Controller
                name="valorDespesa"
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
                      setValorDespesa(values?.floatValue);
                    }}
                    error={Boolean(errors.valorDespesa)}
                    size="small"
                    label="Valor da despesa"
                    placeholder="R$ 0,00"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                    fullWidth
                    inputProps={{ maxLength: 16 }}
                  />
                )}
              />

              {/* <TextField
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
              /> */}
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

            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <TextField
                {...register("tipoLoja")}
                error={Boolean(errors.tipoLoja)}
                select
                fullWidth
                label="Loja"
                size="small"
                value={parseInt(tipoLoja)}
                onChange={(e) => {
                  setTipoLoja(e.target.value);
                }}
              >
                {picklist?.map((loja) => (
                  <MenuItem value={loja.id} key={loja.id}>
                    {loja.sg_loja}
                  </MenuItem>
                ))}
              </TextField>
              <Typography sx={{ color: "#f00", fontSize: "12px" }}>
                {errors.tipoLoja?.message}
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
                  {(despesas?.data?.length && despesas?.data?.length) ||
                    formatarValorBRL(0)}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#212121", ml: 1 }}>
                  Valor total:
                  {despesas?.indicadores?.total
                    ? formatarValorBRL(despesas?.indicadores?.total)
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
          Deseja deletar a despesa?
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
            onClick={excluirDespesa}
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
