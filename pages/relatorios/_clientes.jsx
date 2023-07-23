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
import {
  formatarCPFSemAnonimidade,
  formatarData,
  formatarTelefone,
} from "@/helpers/utils";

//Icons
import EditIcon from "@mui/icons-material/Edit";

export default function CadastrarCliente() {
  const { data: session } = useSession();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getClientes();
  }, [session?.user]);

  async function getClientes() {
    const response = await fetch("/api/relatorios/clientes", {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();
      setClientes(json);
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
              pathname: "/cadastros/cliente",
              query: {
                cpf: params.row.cpf,
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
      field: "cpf",
      headerName: "CPF",
      renderHeader: (params) => <strong>CPF</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome",
      headerName: "NOME",
      renderHeader: (params) => <strong>NOME</strong>,
      flex: 1,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_nascimento",
      headerName: "DATA NASCIMENTO",
      renderHeader: (params) => <strong>DATA NASCIMENTO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "especie",
      headerName: "ESPÉCIE",
      renderHeader: (params) => <strong>ESPÉCIE</strong>,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "matricula",
      headerName: "MATRÍCULA",
      renderHeader: (params) => <strong>MATRÍCULA</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "telefone1",
      headerName: "TELEFONE UM",
      renderHeader: (params) => <strong>TELEFONE UM</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "telefone2",
      headerName: "TELEFONE DOIS",
      renderHeader: (params) => <strong>TELEFONE DOIS</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "telefone3",
      headerName: "TELEFONE TRÊS",
      renderHeader: (params) => <strong>TELEFONE TRÊS</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "observacoes",
      headerName: "OBSERVAÇÃO",
      renderHeader: (params) => <strong>OBSERVAÇÃO</strong>,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
    },
  ];

  try {
    var rows = clientes?.map((row) => {
      return {
        id: row.id,
        cpf: formatarCPFSemAnonimidade(row.cpf),
        nome: row.nome,
        dt_nascimento: row.dt_nascimento,
        especie: row.especie,
        matricula: row.matricula,
        telefone1: row.telefone1,
        telefone2: row.telefone2,
        telefone3: row.telefone3,
        observacoes: row.observacoes,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de clientes">
      <Box sx={{ width: "100%" }}>
        <DataTable rows={rows} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
