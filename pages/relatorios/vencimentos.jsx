import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import {
  formatarData,
  formatarValorBRL,
  converterDataParaJS,
} from "@/helpers/utils";
import Spinner from "@/components/Spinner";

var DATA_HOJE = new Date();

export default function Vencimentos() {
  const { data: session } = useSession();

  const [emprestimosVencidos, setEmprestimosVencidos] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
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

    // dt_pagamento: null;
    // dt_vencimento: "2023-07-22";
    // emprestimo: 15;
    // id: 1;
    // nr_parcela: "1";

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setEmprestimosVencidos(json);
    } else {
      setEmprestimosVencidos([]);
    }

    setLoadingDataFetch(false);
  }

  const columns = [
    {
      field: "dt_emprestimo",
      headerName: "DT. EMPRÉSTIMO",
      renderHeader: (params) => <strong>DT. EMPRÉSTIMO</strong>,
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
      field: "no_cliente",
      headerName: "NOME DO CLIENTE",
      renderHeader: (params) => <strong>NOME DO CLIENTE</strong>,
      minWidth: 300,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_emprestimo",
      headerName: "VLR. DO EMPRÉSTIMO",
      renderHeader: (params) => <strong>VLR. DO EMPRÉSTIMO</strong>,
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
      field: "vl_capital",
      headerName: "VLR. DO CAPITAL",
      renderHeader: (params) => <strong>VLR. DO CAPITAL</strong>,
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
      field: "vl_juros",
      headerName: "VLR. DO JUROS",
      renderHeader: (params) => <strong>VLR. DO JUROS</strong>,
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
      field: "vl_total",
      headerName: "VLR. TOTAL",
      renderHeader: (params) => <strong>VLR. TOTAL</strong>,
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
      field: "qt_parcela",
      headerName: "QTD. PARCELAS",
      renderHeader: (params) => <strong>QTD. PARCELAS</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "observacao",
      headerName: "OBSERVAÇÃO",
      renderHeader: (params) => <strong>OBSERVAÇÃO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  try {
    var rows = emprestimosVencidos?.map((row) => {
      return {
        id: row.id,
        dt_emprestimo: row.dt_emprestimo,
        no_cliente: row.no_cliente,
        vl_emprestimo: row.vl_emprestimo,
        vl_capital: row.vl_capital,
        vl_juros: row.vl_juros,
        vl_total: row.vl_total,
        qt_parcela: row.qt_parcela,
        observacao: row.observacao,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de empréstimos vencidos">
      <Toaster position="bottom-center" reverseOrder={true} />

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
