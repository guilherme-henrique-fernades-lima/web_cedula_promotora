import { useState, useEffect } from "react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

//Constants
import { ACTIVE_OPTIONS } from "@/helpers/constants";

//Icons
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

import { bancoSchema } from "@/schemas/picklists/bancoSchema";

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
    resolver: yupResolver(bancoSchema),
  });

  const [id, setId] = useState("");
  const [dataset, setDataset] = useState([]);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (session?.user?.token) {
      getAllData();
    }
  }, [session?.user]);

  function getPayload() {
    const payload = {
      name: name.toUpperCase(),
      is_active: isActive,
    };

    return payload;
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();
    setId("");
    setName("");
    setIsActive("");

    setShowEditForm(false);
  }

  async function save() {
    try {
      setLoading(true);
      const payload = getPayload();

      const response = await fetch("/api/configuracoes/picklists/bancos", {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Cadastrado com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
        getAllData();
      } else {
        toast.error("Erro ao cadastrar");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function update() {
    try {
      setLoading(true);
      const payload = getPayload();

      const response = await fetch(
        `/api/configuracoes/picklists/bancos/?id=${id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: session?.user?.token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Editado com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
        getAllData();
      } else {
        toast.error("Erro ao editar dados");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllData() {
    try {
      const response = await fetch("/api/configuracoes/picklists/bancos", {
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
    setValue("name", data.name);
    setValue("isActive", data.is_active);

    setId(data.id);
    setName(data.name);
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
      field: "name",
      headerName: "NOME DO BANCO",
      renderHeader: (params) => <strong>NOME DO BANCO</strong>,
      minWidth: 150,
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
    <ContentWrapper title="Cadastro e manutenção de bancos">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box
        component="form"
        onSubmit={handleSubmit(() => {
          if (showEditForm) {
            update();
          } else {
            save();
          }
        })}
        sx={{ width: "100%" }}
      >
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              size="small"
              label="Nome"
              placeholder="Insira o nome do banco"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("is_active")}
              error={Boolean(errors.is_active)}
              helperText={errors.is_active?.message}
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

            <Tooltip title="Limpar todos os campos" placement="top">
              <IconButton
                sx={{ ml: 1 }}
                onClick={clearStatesAndErrors}
                color="error"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataset} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
