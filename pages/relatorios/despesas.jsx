import { useState, useEffect } from "react";

//Next.js imports
import Link from "next/link";

//Third party libraries
import { useSession } from "next-auth/react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

//Custom componentes
import DataTable from "@/components/Datatable";
import { formatarData, formatarValorBRL } from "@/helpers/utils";

//Icons
import EditIcon from "@mui/icons-material/Edit";

export default function RelatorioDespesas() {
  const { data: session } = useSession();
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    getDespesas();
  }, [session?.user]);

  async function getDespesas() {
    const response = await fetch("/api/relatorios/despesas", {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();

      setDespesas(json);
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
          <Link
            href={{
              pathname: "/cadastros/despesa",
              query: {
                id: params.row.id,
              },
            }}
          >
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
        );
      },
    },
    {
      field: "dt_vencimento",
      headerName: "DT. VENCIMENTO",
      renderHeader: (params) => <strong>DT. VENCIMENTO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "descricao",
      headerName: "DESCRIÇÃO",
      renderHeader: (params) => <strong>DESCRIÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "valor",
      headerName: "VALOR",
      renderHeader: (params) => <strong>VALOR</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "situacao",
      headerName: "SITUAÇÃO",
      renderHeader: (params) => <strong>SITUAÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tp_despesa",
      headerName: "TIPO DE DESPESA",
      renderHeader: (params) => <strong>TIPO DE DESPESA</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "natureza_despesa",
      headerName: "NATUREZA DA DESPESA",
      renderHeader: (params) => <strong>NATUREZA DA DESPESA</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
  ];

  try {
    var rows = despesas?.map((row) => {
      return {
        id: row.id,
        dt_vencimento: row.dt_vencimento
          ? formatarData(row.dt_vencimento)
          : null,
        descricao: row.descricao,
        valor: formatarValorBRL(row.valor),
        situacao: row.situacao,
        tp_despesa: row.tp_despesa,
        natureza_despesa: row.natureza_despesa,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de despesas">
      <Box sx={{ width: "100%" }}>
        <DataTable rows={rows} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
