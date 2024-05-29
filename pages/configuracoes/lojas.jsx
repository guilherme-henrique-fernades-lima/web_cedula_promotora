import { useState, useEffect } from "react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

//Constants
import { ACTIVE_OPTIONS } from "@/helpers/constants";

//Icons
import SaveIcon from "@mui/icons-material/Save";

import { despesaSchema } from "@/schemas/lojaSchema";

export default function ConfiguracoesLojas() {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(despesaSchema),
  });

  const [id, setId] = useState("");
  const [dataset, setDataset] = useState([]);
  const [sgLoja, setSgLoja] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    getLojas();
  }, [session?.user]);

  function getPayload() {
    const payload = {
      sg_loja: sgLoja.toUpperCase(),
      is_active: isActive,
    };

    return payload;
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();
    setId("");
    setSgLoja("");
    setIsActive("");

    setShowEditForm(false);
  }

  async function salvarLoja() {
    try {
      setLoading(true);
      const payload = getPayload();

      const response = await fetch("/api/configuracoes/lojas", {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Loja cadastrado com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
        getLojas();
      } else {
        toast.error("Erro ao cadastrar Loja.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function editarLoja() {
    try {
      setLoading(true);
      const payload = getPayload();

      const response = await fetch(`/api/configuracoes/lojas/?id=${id}/`, {
        method: "PUT",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Loja editada com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
        getLojas();
      } else {
        toast.error("Erro ao editar dados da Loja.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getLojas() {
    try {
      const response = await fetch("/api/configuracoes/lojas", {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getDataForEdit(data) {
    clearErrors();
    setValue("sgLoja", data.sg_loja);
    setValue("isActive", data.is_active);

    setId(data.id);
    setSgLoja(data.sg_loja);
    setIsActive(data.is_active);
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
            <Tooltip title="Editar" placement="top">
              <IconButton
                onClick={() => {
                  setShowEditForm(true);
                  getDataForEdit(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "sg_loja",
      headerName: "NOME DA LOJA",
      renderHeader: (params) => <strong>NOME DA LOJA</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "is_active",
      headerName: "CPF",
      renderHeader: (params) => <strong>STATUS</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value === false) {
          return "DESATIVADA";
        } else {
          return "ATIVA";
        }
      },
    },
  ];

  return (
    <ContentWrapper title="Cadastro e manutenção de lojas">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box
        component="form"
        onSubmit={handleSubmit(() => {
          if (showEditForm) {
            editarLoja();
          } else {
            salvarLoja();
          }
        })}
        sx={{ width: "100%" }}
      >
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("sgLoja")}
              error={Boolean(errors.sgLoja)}
              helperText={errors.sgLoja?.message}
              value={sgLoja}
              onChange={(e) => {
                setSgLoja(e.target.value);
              }}
              size="small"
              label="Nome"
              placeholder="Insira o nome da loja"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("isActive")}
              error={Boolean(errors.isActive)}
              helperText={errors.isActive?.message}
              select
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value);
              }}
              size="small"
              label="Status"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            >
              {ACTIVE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LoadingButton
              type="submit"
              variant="contained"
              disableElevation
              endIcon={<SaveIcon />}
              loading={loading}
            >
              {showEditForm ? "Atualizar" : "Cadastrar"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataset} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
