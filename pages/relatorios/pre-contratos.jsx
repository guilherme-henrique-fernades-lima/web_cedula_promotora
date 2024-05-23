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

  //   {
  //     "id": 1,
  //     "nome_banco": "TES22",
  //     "nome_promotora": "teste",
  //     "nome_convenio": "TESTE DDDDDDD",
  //     "nome_corretor": "CORRETOR 1",
  //     "nome_operacao": "SS",
  //     "promotora": "1",
  //     "dt_digitacao": "2024-05-02",
  //     "nr_contrato": "123123",
  //     "no_cliente": "ASD",
  //     "cpf": "123.123.123-12",
  //     "convenio": "3",
  //     "operacao": "1",
  //     "banco": "2",
  //     "vl_contrato": "123123.00",
  //     "qt_parcelas": 123,
  //     "vl_parcela": "123.00",
  //     "dt_pag_cliente": "2024-05-15",
  //     "porcentagem": "12.00",
  //     "corretor": "1",
  //     "tabela": null,
  //     "tipo_contrato": "fisico",
  //     "status_comissao": null,
  //     "iletrado": true,
  //     "documento_salvo": true,
  //     "user_id_created": 19,
  //     "created_at": "2024-05-21T21:56:27.517291-03:00",
  //     "updated_at": "2024-05-21T21:56:27.517291-03:00"
  // }

  function actionsAfterDelete() {
    setOpenDialogDelete(false);
    list();
    setIdPreContrato("");
  }

  async function sendPreContrato(data) {
    const payload = {
      id: data.id,
      promotora: data.promotora,
      dt_digitacao: data.promotora,
      nr_contrato: data.promotora,
      no_cliente: data.promotora,
      cpf: data.promotora,
      convenio: data.promotora,
      operacao: data.promotora,
      banco: data.promotora,
      vl_contrato: data.promotora,
      qt_parcelas: data.promotora,
      vl_parcela: data.promotora,
      dt_pag_cliente: data.promotora,
      porcentagem: data.promotora,
      corretor: data.promotora,
      contrato_criado: true,
      // tabela: data.promotora, //Verificar
      // tipo_contrato: data.promotora, //Verificar
      // status_comissao: data.promotora, //Verificar
      // iletrado: data.promotora, //Verificar
      // documento_salvo: data.promotora, //Verificar
    };

    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/pre-contratos`, {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
      }
    } catch (error) {
      console.log(error);
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
            <Tooltip title="Editar pré-contrato" placement="top">
              <IconButton
                onClick={() => {
                  router.push(`/cadastros/pre-contrato/?id=${params.value}`);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
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

            <Tooltip title="Transferir pré-contrato" placement="top">
              <IconButton
                color="success"
                sx={{ ml: 1 }}
                onClick={() => sendPreContrato(params.row)}
              >
                <FileUploadIcon />
              </IconButton>
            </Tooltip>
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
    },
    {
      field: "updated_at",
      headerName: "ATUALIZADO EM",
      renderHeader: (params) => <strong>ATUALIZADO EM</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
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
