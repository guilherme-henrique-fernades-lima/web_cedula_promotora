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

export default function RelatorioCobrancas() {
  const { data: session } = useSession();
  const [cobrancas, setCobrancas] = useState([]);

  useEffect(() => {
    getCobrancas();
  }, [session?.user]);

  async function getCobrancas() {
    const response = await fetch("/api/relatorios/cobrancas", {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();
      setCobrancas(json);
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
  ];

  try {
    var rows = cobrancas?.map((row) => {
      return {
        id: row.id,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de cobranças">
      <Box sx={{ width: "100%" }}>
        <DataTable rows={rows} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
