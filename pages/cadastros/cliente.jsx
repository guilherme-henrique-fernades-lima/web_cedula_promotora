import { useState, useEffect } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";
import { useSession } from "next-auth/react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";

//Mui components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import { ESPECIES_INSS } from "@/helpers/constants";

//Custom componentes
import DataTable from "@/components/Datatable";
import { formatarCPFSemAnonimidade, formatarData } from "@/helpers/utils";

const clienteCallCenterSchema = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  telefoneUm: yup.string().required("Informe um telefone válido"),
  nome: yup.string().required("O nome do cliente é obrigatório"),
  //dataNascimento: yup.string().required("A data de nascimento é obrigatória"),
});

export default function CadastrarCliente() {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    resetField,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(clienteCallCenterSchema),
  });

  const [clientes, setClientes] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [especieInss, setEspecieInss] = useState(null);
  const [matricula, setMatricula] = useState("");
  const [telefoneUm, setTelefoneUm] = useState("");
  const [telefoneDois, setTelefoneDois] = useState("");
  const [telefoneTres, setTelefoneTres] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    getClientes();
  }, [session?.user]);

  async function getClientes() {
    const response = await fetch("/api/cadastros/cliente", {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();
      setClientes(json);
    }

    console.log(response);
  }

  async function salvarCliente() {
    setLoadingButton(true);
    console.log(session.user);

    const payload = getPayload();
    console.log("payload: ", payload);

    const response = await fetch("/api/cadastros/cliente", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    console.log(response);

    if (response.ok) {
      toast.success("Cliente cadastrado com sucesso!");
      setLoadingButton(false);
    } else {
      toast.error("Erro ao cadastrar cliente.");
      setLoadingButton(false);
    }
  }

  function getPayload() {
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome: nome.toUpperCase(),
      dt_nascimento: dataNascimento
        ? moment(dataNascimento).format("YYYY-MM-DD")
        : null,
      especie: especieInss ? especieInss?.especie : null,
      matricula: matricula.toUpperCase(),
      telefone1: telefoneUm.replace(/\D/g, ""),
      telefone2: telefoneDois.replace(/\D/g, ""),
      telefone3: telefoneTres.replace(/\D/g, ""),
      observacoes: observacao.toUpperCase(),
    };

    return payload;
  }

  const columns = [
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
    },
    {
      field: "telefone2",
      headerName: "TELEFONE DOIS",
      renderHeader: (params) => <strong>TELEFONE DOIS</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "telefone3",
      headerName: "TELEFONE TRÊS",
      renderHeader: (params) => <strong>TELEFONE TRÊS</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
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
        dt_nascimento: row.dt_nascimento ? formatarData(row.dt_nascimento) : "",
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
    <ContentWrapper title="Cadastrar cliente">
      <Toaster position="bottom-center" reverseOrder={true} />
      <Box
        component="form"
        onSubmit={handleSubmit(() => {
          salvarCliente();
        })}
        sx={{ width: "100%" }}
      >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              {...register("cpf")}
              error={Boolean(errors.cpf)}
              mask="999.999.999-99"
              maskChar={null}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="CPF"
                  placeholder="000.000.000-000"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  // onInput={(e) =>
                  //   (e.target.value = e.target.value
                  //     .replace(/[^0-9.]/g, "")
                  //     .replace(/(\..*?)\..*/g, "$1"))
                  // }
                />
              )}
            </InputMask>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.cpf?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              {...register("nome")}
              error={Boolean(errors.nome)}
              value={nome}
              onChange={(e) => {
                setNome(e.target.value.replace(/[^A-Za-z\s]/g, ""));
              }}
              size="small"
              label="Nome"
              placeholder="Insira o nome completo"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.nome?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data de nascimento"
                onChange={(newValue) => {
                  setDataNascimento(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    {...register("dataNascimento")}
                    error={Boolean(errors.dataNascimento)}
                  />
                )}
                value={dataNascimento}
                disableFuture
                disableHighlightToday
              />
            </LocalizationProvider>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.dataNascimento?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <Autocomplete
              options={ESPECIES_INSS}
              autoHighlight
              getOptionLabel={(option) => option?.especie}
              value={especieInss}
              onChange={(event, newValue) => {
                setEspecieInss(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Espécie INSS"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              size="small"
              label="Matrícula"
              value={matricula}
              onChange={(e) => {
                setMatricula(e.target.value);
              }}
              placeholder="Insira a matrícula"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              {...register("telefoneUm")}
              error={Boolean(errors.telefoneUm)}
              mask="(99) 9 9999-9999"
              maskChar={null}
              value={telefoneUm}
              onChange={(e) => setTelefoneUm(e.target.value)}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="Telefone"
                  placeholder="00 00000-0000"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            </InputMask>
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.telefoneUm?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              mask="(99) 9 9999-9999"
              maskChar={null}
              value={telefoneDois}
              onChange={(e) => setTelefoneDois(e.target.value)}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="Telefone dois"
                  placeholder="00 00000-0000"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              mask="(99) 9 9999-9999"
              maskChar={null}
              value={telefoneTres}
              onChange={(e) => setTelefoneTres(e.target.value)}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="Telefone três"
                  placeholder="00 00000-0000"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              multiline
              rows={3}
              size="small"
              label="Observações"
              value={observacao}
              onChange={(e) => {
                setObservacao(e.target.value);
              }}
              placeholder="Insira a matrícula"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disableElevation
              loading={loadingButton}
              // fullWidth
            >
              SALVAR
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%" }}>
        <DataTable rows={rows} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
