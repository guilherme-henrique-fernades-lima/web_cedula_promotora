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

export default function RelatorioContratos() {
  const { data: session } = useSession();
  const [contratos, setContratos] = useState([]);

  useEffect(() => {
    getContratos();
  }, [session?.user]);

  async function getContratos() {
    const response = await fetch("/api/relatorios/contratos", {
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
  ];

  try {
    var rows = contratos?.map((row) => {
      return {
        id: row.id,
        promotora: row.promotora,
        dt_digitacao: row.dt_digitacao,
        nr_contrato: row.nr_contrato,
        no_cliente: row.no_cliente,
        cpf: row.cpf,
        convenio: row.convenio,
        operacao: row.operacao,
        banco: row.banco,
        vl_contrato: row.vl_contrato,
        qt_parcelas: row.qt_parcelas,
        vl_parcela: row.vl_parcela,
        dt_pag_cliente: row.dt_pag_cliente,
        dt_pag_comissao: row.dt_pag_comissao,
        vl_comissao: row.vl_comissao,
        porcentagem: row.porcentagem,
        corretor: row.corretor,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de contratos">
      <Box sx={{ width: "100%" }}>
        <DataTable rows={rows} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
