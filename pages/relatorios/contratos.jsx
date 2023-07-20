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
      setContratos(json);
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
      field: "promotora",
      headerName: "PROMOTORA",
      renderHeader: (params) => <strong>PROMOTORA</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_digitacao",
      headerName: "DATA DIGITAÇÃO",
      renderHeader: (params) => <strong>DATA DIGITAÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nr_contrato",
      headerName: "NR. CONTRATO",
      renderHeader: (params) => <strong>NR. CONTRATO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "no_cliente",
      headerName: "NOME CLIENTE",
      renderHeader: (params) => <strong>NOME CLIENTE</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cpf",
      headerName: "CPF CLIENTE",
      renderHeader: (params) => <strong>CPF CLIENTE</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "convenio",
      headerName: "CONVÊNIO",
      renderHeader: (params) => <strong>CONVÊNIO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "operacao",
      headerName: "OPERAÇÃO",
      renderHeader: (params) => <strong>OPERAÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "banco",
      headerName: "BANCO",
      renderHeader: (params) => <strong>BANCO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_contrato",
      headerName: "VLR. CONTRATO",
      renderHeader: (params) => <strong>VLR. CONTRATO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qt_parcelas",
      headerName: "QTD. PARCELAS",
      renderHeader: (params) => <strong>QTD. PARCELAS</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_parcela",
      headerName: "VLR. PARCELA",
      renderHeader: (params) => <strong>VLR. PARCELA</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_pag_cliente",
      headerName: "DT. PAG. CLIENTE",
      renderHeader: (params) => <strong>DT. PAG. CLIENTE</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_pag_comissao",
      headerName: "DT. PAG. COMISSÃO",
      renderHeader: (params) => <strong>DT. PAG. COMISSÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_comissao",
      headerName: "VLR. COMISSÃO",
      renderHeader: (params) => <strong>VLR. COMISSÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "porcentagem",
      headerName: "(%) PORCENTAGEM",
      renderHeader: (params) => <strong>(%) PORCENTAGEM</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "corretor",
      headerName: "CORRETOR",
      renderHeader: (params) => <strong>CORRETOR</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
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
