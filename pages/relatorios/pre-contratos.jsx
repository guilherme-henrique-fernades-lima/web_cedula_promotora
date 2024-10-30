import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
import { useRouter } from "next/router";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import DatepickerField from "@/components/DatepickerField";

//Mui components
import Box from "@mui/material/Box";

//Mui components
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";

//Utils
import {
  formatarData,
  formatarCPFSemAnonimidade,
  formatarValorBRL,
  formatarDataComHora,
} from "@/helpers/utils";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

//Hooks
import useBancoPicklist from "@/hooks/useBancoPicklist";
import usePromotoraPicklist from "@/hooks/usePromotoraPicklist";
import useOperacaoPicklist from "@/hooks/useOperacaoPicklist";
import useCorretorPicklist from "@/hooks/useCorretorPicklist";
import useConvenioPicklist from "@/hooks/useConvenioPicklist";

var DATA_HOJE = new Date();

export default function RelatorioPreContratos() {
  const { data: session } = useSession();
  const router = useRouter();

  const { bancoPicklist, loadingBancoPicklist } = useBancoPicklist();
  const { promotoraPicklist, loadingPromotoraPicklist } =
    usePromotoraPicklist();
  const { operacaoPicklist, loadingOperacaoPicklist } = useOperacaoPicklist();
  const { corretorPicklist, loadingCorretorPicklist } = useCorretorPicklist();
  const { convenioPicklist, loadingConvenioPicklist } = useConvenioPicklist();

  const [loadingDataset, setLoadingDataset] = useState(false);

  const [dataSet, setDataset] = useState({});

  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [preContratoToSendContratos, setPreContratoToSendContratos] =
    useState("");
  const [openDialogSendPreContrato, setOpenDialogSendPreContrato] =
    useState(false);
  const [idPreContrato, setIdPreContrato] = useState("");
  const [hasContrato, setHasContrato] = useState("nao_transmitidos");

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open); // Inverte o estado ao clicar no botão
  };

  //States dos filtros
  const [conveniosFilter, setConveniosFilter] = useState([]);
  const [operacoesFilter, setOperacoesFilter] = useState([]);
  const [bancosFilter, setBancosFilter] = useState([]);
  const [promotorasFilter, setPromotorasFilter] = useState([]);
  const [corretoresFilter, setCorretoresFilter] = useState([]);

  //States dos dados dos picklists
  // const [convenioPicklist, setConvenioPicklist] = useState([]);
  // const [corretorPicklist, setCorretorPicklist] = useState([]);
  // const [operacaoPicklist, setOperacaoPicklist] = useState([]);
  // const [bancoPicklist, setBancoPicklist] = useState([]);
  // const [promotoraPicklist, setPromotoraPicklist] = useState([]);

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  async function list() {
    try {
      setLoadingDataset(true);
      const response = await fetch(
        `/api/relatorios/pre-contratos/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}&user_id=${
          session?.user.id
        }&has_contrato=${hasContrato}&convenios=${handleQuery(
          conveniosFilter
        )}&promotoras=${handleQuery(promotorasFilter)}&corretores=${handleQuery(
          corretoresFilter
        )}&operacoes=${handleQuery(operacoesFilter)}&bancos=${handleQuery(
          bancosFilter
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }

    setLoadingDataset(false);
  }

  function actionsAfterDelete() {
    setOpenDialogDelete(false);
    setOpenDialogSendPreContrato(false);
    list();
    setIdPreContrato("");
    setPreContratoToSendContratos("");
  }

  function handleQuery(array) {
    const arrayData = [];
    for (var i = 0; i < array?.length; i++) {
      arrayData.push(array[i]["id"]);
    }

    return arrayData;
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
            {params.row.contrato_criado ? (
              <Tooltip title="Edição não permitida" placement="top">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Editar pré-contrato" placement="top">
                <IconButton
                  onClick={() => {
                    router.push(`/cadastros/pre-contrato/?id=${params.value}`);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}

            {params.row.contrato_criado ? (
              <Tooltip title="Exclusão não permitida" placement="top">
                <IconButton sx={{ ml: 1 }}>
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Deletar pré-contrato" placement="top">
                <IconButton
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setIdPreContrato(params.value);
                    setOpenDialogDelete(true);
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            )}

            {session?.user?.is_superuser && (
              <>
                {params.row.contrato_criado ? (
                  <Tooltip title="Pré-contrato já transferido" placement="top">
                    <IconButton sx={{ ml: 1 }}>
                      <FileUploadIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Transferir pré-contrato" placement="top">
                    <IconButton
                      sx={{ ml: 1 }}
                      color="success"
                      onClick={() => {
                        setOpenDialogSendPreContrato(true);
                        setPreContratoToSendContratos(params.row);
                      }}
                    >
                      <FileUploadIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Stack>
        );
      },
    },
    // {
    //   field: "user_id_created",
    //   headerName: "USER ID",
    //   renderHeader: (params) => <strong>USER ID</strong>,
    //   minWidth: 170,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "created_at",
      headerName: "CRIADO EM",
      renderHeader: (params) => <strong>CRIADO EM</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarDataComHora(params.value);
        }
      },
    },
    {
      field: "updated_at",
      headerName: "ATUALIZADO EM",
      renderHeader: (params) => <strong>ATUALIZADO EM</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarDataComHora(params.value);
        }
      },
    },
    {
      field: "nome_promotora",
      headerName: "PROMOTORA",
      renderHeader: (params) => <strong>PROMOTORA</strong>,
      minWidth: 250,
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
      minWidth: 350,
      align: "left",
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
      field: "nome_convenio",
      headerName: "CONVÊNIO",
      renderHeader: (params) => <strong>CONVÊNIO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_operacao",
      headerName: "OPERAÇÃO",
      renderHeader: (params) => <strong>OPERAÇÃO</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_banco",
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
      field: "porcentagem",
      headerName: "(%) PORCENTAGEM",
      renderHeader: (params) => <strong>(%) PORCENTAGEM</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_corretor",
      headerName: "CORRETOR",
      renderHeader: (params) => <strong>CORRETOR</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <ContentWrapper title="Relação de pré contratos">
      <Toaster position="bottom-center" reverseOrder={true} />
      <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
          <DatepickerField
            label="Início"
            value={dataInicio}
            onChange={setDataInicio}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
          <DatepickerField label="Fim" value={dataFim} onChange={setDataFim} />
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
          <LoadingButton
            variant="contained"
            disableElevation
            fullWidth
            onClick={list}
            loading={loadingDataset}
          >
            PESQUISAR
          </LoadingButton>
        </Grid>
      </Grid>
      <FormControl component="fieldset">
        <FormLabel id="demo-radio-buttons-group-label">
          Filtrar pré-contratos por:
        </FormLabel>
        <RadioGroup
          row
          value={hasContrato}
          onChange={(e) => {
            setHasContrato(e.target.value);
          }}
        >
          <FormControlLabel
            value="nao_transmitidos"
            control={<Radio />}
            label="Não transmitidos"
          />
          <FormControlLabel
            value="transmitidos"
            control={<Radio />}
            label="Já transmitidos"
          />
          <FormControlLabel value="todos" control={<Radio />} label="Todos" />
        </RadioGroup>
      </FormControl>

      {session?.user?.is_superuser && (
        <>
          <Grid container sx={{ width: "100%", mt: 1 }} spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Autocomplete
                multiple
                size="small"
                limitTags={1}
                filterSelectedOptions
                disableCloseOnSelect
                onChange={(event, value) => {
                  setCorretoresFilter(value);
                }}
                clearOnEscape
                options={corretorPicklist}
                getOptionLabel={(option) => option.name}
                value={corretoresFilter}
                renderInput={(params) => (
                  <TextField {...params} label="Corretores" />
                )}
                clearText="Resetar opções"
                closeText="Ver opções"
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option, index) => (
                    <Chip
                      key={option.id}
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                    />
                  ));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Autocomplete
                multiple
                size="small"
                limitTags={2}
                filterSelectedOptions
                disableCloseOnSelect
                onChange={(event, value) => {
                  setBancosFilter(value);
                }}
                clearOnEscape
                options={bancoPicklist}
                getOptionLabel={(option) => option.name}
                value={bancosFilter}
                renderInput={(params) => (
                  <TextField {...params} label="Bancos" />
                )}
                clearText="Resetar opções"
                closeText="Ver opções"
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option, index) => (
                    <Chip
                      key={option.id}
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                    />
                  ));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Autocomplete
                multiple
                size="small"
                limitTags={1}
                filterSelectedOptions
                disableCloseOnSelect
                onChange={(event, value) => {
                  setOperacoesFilter(value);
                }}
                clearOnEscape
                options={operacaoPicklist}
                getOptionLabel={(option) => option.name}
                value={operacoesFilter}
                renderInput={(params) => (
                  <TextField {...params} label="Operações" />
                )}
                clearText="Resetar opções"
                closeText="Ver opções"
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option, index) => (
                    <Chip
                      key={option.id}
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                    />
                  ));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Autocomplete
                multiple
                size="small"
                limitTags={2}
                filterSelectedOptions
                disableCloseOnSelect
                onChange={(event, value) => {
                  setConveniosFilter(value);
                }}
                clearOnEscape
                options={convenioPicklist}
                getOptionLabel={(option) => option.name}
                value={conveniosFilter}
                renderInput={(params) => (
                  <TextField {...params} label="Convênios" />
                )}
                clearText="Resetar opções"
                closeText="Ver opções"
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option, index) => (
                    <Chip
                      key={option.id}
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                    />
                  ));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Autocomplete
                multiple
                size="small"
                limitTags={2}
                filterSelectedOptions
                disableCloseOnSelect
                onChange={(event, value) => {
                  setPromotorasFilter(value);
                }}
                clearOnEscape
                options={promotoraPicklist}
                getOptionLabel={(option) => option.name}
                value={promotorasFilter}
                renderInput={(params) => (
                  <TextField {...params} label="Promotoras" />
                )}
                clearText="Resetar opções"
                closeText="Ver opções"
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option, index) => (
                    <Chip
                      key={option.id}
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                    />
                  ));
                }}
              />
            </Grid>
          </Grid>
          {!(Object.keys(dataSet).length === 0 || dataSet.length === 0) && (
            <Box
              sx={{
                maxWidth: 500,
                width: "100%",
                border: "1px solid rgba(224, 224, 224, 1)",
                borderRadius: 1,
                mt: 2,
              }}
            >
              <Typography sx={{ m: 2, fontSize: 18, fontWeight: "bold" }}>
                Ranking por valor de venda
              </Typography>

              {dataSet?.indicadores?.apuracao.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: 1,
                    borderTop: `1px solid ${
                      index === 0 ? "#ebebeb" : "transparent"
                    }`,
                  }}
                >
                  <Typography>
                    <strong>{index + 1}° - </strong>
                    {item.corretor}
                  </Typography>

                  <Typography>
                    {formatarValorBRL(item.valor_total)} | Qtd: {item.qtd_total}
                  </Typography>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 1,
                  backgroundColor: "#ebebeb",
                  borderTop: "1px solid #ebebeb",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Total:</Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {formatarValorBRL(dataSet?.indicadores?.valor_total || 0)} |
                  Qtd: {dataSet?.indicadores?.qtd_total || 0}
                </Typography>
              </Box>
            </Box>
          )}

          <Button
            sx={{ mt: 3 }}
            variant="contained"
            onClick={handleToggle}
            disableElevation
            endIcon={
              open ? (
                <KeyboardArrowUpRoundedIcon />
              ) : (
                <KeyboardArrowDownRoundedIcon />
              )
            }
          >
            {open ? "Ocultar Detalhes" : "Exibir Detalhes"}
          </Button>

          <Box sx={{ width: "100%" }}>
            <Collapse in={open}>
              <ApuracaoRankingVendas data={dataSet?.indicadores?.apuracao} />
            </Collapse>
          </Box>
        </>
      )}

      <Box sx={{ width: "100%" }}>
        <DataTable
          rows={
            Object.keys(dataSet).length === 0 || dataSet.length === 0
              ? []
              : dataSet?.pre_contratos
          }
          columns={columns}
        />
      </Box>
      <DialogExcluirPreContrato
        open={openDialogDelete}
        close={setOpenDialogDelete}
        id={idPreContrato}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
      <DialogTransmitirPreContrato
        open={openDialogSendPreContrato}
        close={setOpenDialogSendPreContrato}
        preContrato={preContratoToSendContratos}
        clearPreContrato={setPreContratoToSendContratos}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
    </ContentWrapper>
  );
}

function DialogExcluirPreContrato({ open, close, id, token, onFinishDelete }) {
  const [loading, setLoading] = useState(false);

  async function deletarPreContrato() {
    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/pre-contratos/?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        toast.success("Excluído");
        onFinishDelete();
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }

    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, mb: 1 }}>
        Deseja deletar o pré-contrato?
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={() => {
            close(false);
          }}
        >
          CANCELAR
        </Button>

        <LoadingButton
          onClick={deletarPreContrato}
          color="error"
          variant="contained"
          disableElevation
          loading={loading}
        >
          EXCLUIR
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function DialogTransmitirPreContrato({
  open,
  close,
  preContrato,
  clearPreContrato,
  token,
  onFinishDelete,
}) {
  const [loading, setLoading] = useState(false);

  async function sendPreContrato(data) {
    const payload = {
      id: data.id,
      promotora: data.promotora,
      dt_digitacao: data.dt_digitacao ? data.dt_digitacao : null,
      nr_contrato: data.nr_contrato,
      no_cliente: data.no_cliente,
      cpf: data.cpf,
      convenio: data.convenio,
      operacao: data.operacao,
      banco: data.banco,
      vl_contrato: data.vl_contrato,
      qt_parcelas: data.qt_parcelas,
      vl_parcela: data.vl_parcela,
      dt_pag_cliente: data.dt_pag_cliente ? data.dt_pag_cliente : null,
      porcentagem: data.porcentagem ? data.porcentagem : null,
      corretor: data.corretor,
      tabela: data.tabela,
      tipo_contrato: data.tipo_contrato,
      status_comissao: data.status_comissao ? data.status_comissao : null,
      iletrado: data.iletrado,
      documento_salvo: data.documento_salvo,
      representante_legal: data.representante_legal,
      dt_pag_comissao: data.dt_pag_comissao,
      vl_comissao: data.vl_comissao ? data.vl_comissao : null,
    };

    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/pre-contratos`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setLoading(false);
        toast.success("Enviado com sucesso");
        onFinishDelete();
      }
    } catch (error) {
      console.log(error);
      toast.success("Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, mb: 1 }}>
        Deseja transferir o pré-contrato para os contratos?
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={() => {
            close(false);
            clearPreContrato("");
          }}
          color="error"
        >
          CANCELAR
        </Button>

        <LoadingButton
          onClick={() => {
            sendPreContrato(preContrato);
          }}
          color="success"
          variant="contained"
          disableElevation
          loading={loading}
        >
          ENVIAR
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

const styleGrid = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flexDirection: "column",
  padding: 1,
  height: "100%",
};

const styleBox = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "row",
  padding: 1,
  width: "100%",
};

function ApuracaoRankingVendas({ data }) {
  return (
    <>
      {data?.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
            flexDirection: "column",
            padding: 2,
            borderRadius: 1,
            marginTop: 3,
            // border: "1px solid rgba(224, 224, 224, 1)",
            backgroundColor: "#ebebeb",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              mb: 2,
            }}
          >
            {/* <Avatar
              alt="Foto do usuário"
              src="https://randomuser.me/api/portraits/men/67.jpg"
              sx={{ width: 66, height: 66 }}
            /> */}

            <Typography
              sx={{
                fontWeight: "bold",
                // marginLeft: 2,
                fontSize: 20,
              }}
            >
              {item.corretor}
            </Typography>
          </Box>
          <Typography
            sx={{
              marginLeft: 2,
              fontSize: 16,
            }}
          >
            <strong>Valor total:</strong> {formatarValorBRL(item.valor_total)}
          </Typography>
          <Typography
            sx={{
              marginBottom: 1,
              marginLeft: 2,
              fontSize: 16,
            }}
          >
            <strong>Qtd. de pré contratos:</strong> {item.qtd_total}
          </Typography>

          <Grid container>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={4} sx={styleGrid}>
              <Box
                sx={{
                  width: "100%",
                  // border: "1px solid rgba(224, 224, 224, 1)",
                  borderRadius: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    marginTop: 1,
                    marginBottom: 1,
                    fontWeight: "bold",
                    marginLeft: 2,
                  }}
                >
                  BANCOS
                </Typography>

                {item?.bancos.map((banco, index, array) => (
                  <Box
                    key={index}
                    sx={{
                      ...styleBox,
                      borderBottom:
                        index !== array.length - 1
                          ? "1px solid rgba(224, 224, 224, 1)"
                          : "none",
                    }}
                  >
                    <Typography>
                      <strong>{index + 1}° -</strong> {banco?.nome_banco}
                    </Typography>
                    <Typography>
                      Valor: {formatarValorBRL(parseFloat(banco?.vlr_total))} |
                      Qtd: {banco.qtd}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={4} sx={styleGrid}>
              <Box
                sx={{
                  width: "100%",
                  // border: "1px solid rgba(224, 224, 224, 1)",
                  borderRadius: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    marginTop: 1,
                    marginBottom: 1,
                    fontWeight: "bold",
                    marginLeft: 2,
                  }}
                >
                  OPERAÇÕES
                </Typography>

                {item?.operacoes.map((operacao, index, array) => (
                  <Box
                    key={index}
                    sx={{
                      ...styleBox,
                      borderBottom:
                        index !== array.length - 1
                          ? "1px solid rgba(224, 224, 224, 1)"
                          : "none",
                    }}
                  >
                    <Typography>
                      <strong>{index + 1}° -</strong> {operacao?.nome_operacao}
                    </Typography>
                    <Typography>
                      Valor: {formatarValorBRL(parseFloat(operacao?.vlr_total))}{" "}
                      | Qtd: {operacao.qtd}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={4} sx={styleGrid}>
              <Box
                sx={{
                  width: "100%",
                  // border: "1px solid rgba(224, 224, 224, 1)",
                  borderRadius: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    marginTop: 1,
                    marginBottom: 1,
                    fontWeight: "bold",
                    marginLeft: 2,
                  }}
                >
                  CONVÊNIOS
                </Typography>

                {item?.convenios.map((convenio, index, array) => (
                  <Box
                    key={index}
                    sx={{
                      ...styleBox,
                      borderBottom:
                        index !== array.length - 1
                          ? "1px solid rgba(224, 224, 224, 1)"
                          : "none",
                    }}
                  >
                    <Typography>
                      <strong>{index + 1}° -</strong> {convenio?.nome_convenio}
                    </Typography>
                    <Typography>
                      Valor: {formatarValorBRL(parseFloat(convenio?.vlr_total))}{" "}
                      | Qtd: {convenio.qtd}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={4} sx={styleGrid}>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    marginTop: 1,
                    marginBottom: 1,
                    fontWeight: "bold",
                    marginLeft: 2,
                  }}
                >
                  PROMOTORAS
                </Typography>

                {item?.promotoras.map((promotora, index, array) => (
                  <Box
                    key={index}
                    sx={{
                      ...styleBox,
                      borderBottom:
                        index !== array.length - 1
                          ? "1px solid rgba(224, 224, 224, 1)"
                          : "none",
                    }}
                  >
                    <Typography>
                      <strong>{index + 1}° -</strong>{" "}
                      {promotora?.nome_promotora}
                    </Typography>
                    <Typography>
                      Valor:{" "}
                      {formatarValorBRL(parseFloat(promotora?.vlr_total))} |
                      Qtd: {promotora.qtd}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  );
}
