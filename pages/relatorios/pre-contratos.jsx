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

var DATA_HOJE = new Date();

export default function RelatorioPreContratos() {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [dataSet, setDataset] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [preContratoToSendContratos, setPreContratoToSendContratos] =
    useState("");
  const [openDialogSendPreContrato, setOpenDialogSendPreContrato] =
    useState(false);
  const [idPreContrato, setIdPreContrato] = useState("");

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  async function list() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/relatorios/pre-contratos/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}&user_id=${
          session?.user.id
        }`,
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

    setLoading(false);
  }

  function actionsAfterDelete() {
    setOpenDialogDelete(false);
    setOpenDialogSendPreContrato(false);
    list();
    setIdPreContrato("");
    setPreContratoToSendContratos("");
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
    {
      field: "user_id_created",
      headerName: "USER ID",
      renderHeader: (params) => <strong>USER ID</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
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
      field: "nome_convenio",
      headerName: "CONVÊNIO",
      renderHeader: (params) => <strong>CONVÊNIO</strong>,
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_operacao",
      headerName: "OPERAÇÃO",
      renderHeader: (params) => <strong>OPERAÇÃO</strong>,
      minWidth: 170,
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
          <Button variant="contained" disableElevation fullWidth onClick={list}>
            PESQUISAR
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet} columns={columns} />
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
      nr_contrato: data.nr_contrato,
      no_cliente: data.no_cliente,
      cpf: data.cpf,
      convenio: data.convenio,
      operacao: data.operacao,
      banco: data.banco,
      vl_contrato: data.vl_contrato,
      qt_parcelas: data.qt_parcelas,
      vl_parcela: data.vl_parcela,
      dt_pag_cliente: data.dt_pag_cliente,
      porcentagem: data.porcentagem,
      corretor: data.corretor,
      dt_digitacao: data.dt_digitacao
        ? data.dt_digitacao
        : moment().format("YYYY-MM-DD"),
      dt_pag_cliente: data.dt_pag_cliente ? data.dt_pag_cliente : null,
      tabela: data.tabela,
      tipo_contrato: data.tipo_contrato,
      status_comissao: data.status_comissao,
      iletrado: data.iletrado,
      documento_salvo: data.documento_salvo,
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
