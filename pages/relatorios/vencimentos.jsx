import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import moment from "moment";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import { formatarData, formatarCPFSemAnonimidade } from "@/helpers/utils";
import Spinner from "@/components/Spinner";

//ícones
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

var DATA_HOJE = new Date();

export default function Vencimentos() {
  const { data: session } = useSession();

  const [emprestimosVencidos, setEmprestimosVencidos] = useState([]);
  console.log(emprestimosVencidos);
  const [loadingDataFetch, setLoadingDataFetch] = useState(true);

  useEffect(() => {
    getEmprestimosVencidos();
  }, [session?.user]);

  async function getEmprestimosVencidos() {
    setLoadingDataFetch(true);
    const response = await fetch(
      `/api/relatorios/vencimentos/?date=${moment(DATA_HOJE).format(
        "YYYY-MM-DD"
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

      setEmprestimosVencidos(json);
    } else {
      setEmprestimosVencidos([]);
    }

    setLoadingDataFetch(false);
  }

  const columns = [
    {
      field: "telefone",
      headerName: "TELEFONE",
      renderHeader: (params) => <strong>TELEFONE</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return (
            <Tooltip title="Abrir whatsapp" placement="top">
              <a
                href={`https://api.whatsapp.com/send/?phone=55${params.value}&amp;text&amp;app_absent=0`}
                target="_blank"
              >
                <IconButton>
                  <WhatsAppIcon sx={{ color: "#25d366" }} />
                </IconButton>
              </a>
            </Tooltip>
          );
        }
      },
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
      field: "no_cliente",
      headerName: "NOME DO CLIENTE",
      renderHeader: (params) => <strong>NOME DO CLIENTE</strong>,
      minWidth: 300,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nr_parcela",
      headerName: "N° PARCELA",
      renderHeader: (params) => <strong>N° PARCELA</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "dt_vencimento",
      headerName: "DATA VENCIMENTO",
      renderHeader: (params) => <strong>DATA VENCIMENTO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
  ];

  try {
    var rows = emprestimosVencidos?.map((row) => {
      return {
        id: row.id,
        cpf: row.cpf,
        no_cliente: row.no_cliente,
        telefone: row.telefone,
        dt_vencimento: row.dt_vencimento,
        nr_parcela: row.nr_parcela,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de empréstimos vencidos">
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
        <Box sx={{ width: "100%" }}>
          <DataTable rows={rows} columns={columns} />
        </Box>
      )}
    </ContentWrapper>
  );
}
