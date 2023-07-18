import { useState, useEffect } from "react";

//Next.js
import { useRouter } from "next/router";

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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import { ESPECIES_INSS } from "@/helpers/constants";

//Formatters
import {
  formatarCPFSemAnonimidade,
  converterDataParaJS,
} from "@/helpers/utils";

const clienteCallCenterSchema = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  telefoneUm: yup.string().required("Informe um telefone válido"),
  nome: yup.string().required("O nome do cliente é obrigatório"),
  dataNascimento: yup.string().required("A data de nascimento é obrigatória"),
});

export default function CadastrarCliente() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(clienteCallCenterSchema),
  });

  const [loadingButton, setLoadingButton] = useState(false);
  const [id, setId] = useState("");
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
    if (router.query?.cpf) {
      getClientePorCPF(router.query?.cpf);
    }
  }, [router.query?.cpf]);

  const handleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  async function salvarCliente() {
    setLoadingButton(true);

    const payload = getPayload();

    const response = await fetch("/api/cadastros/cliente", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Cliente cadastrado com sucesso!");
      clearStatesAndErrors();
      setLoadingButton(false);
    } else {
      toast.error("Erro ao cadastrar cliente.");
      setLoadingButton(false);
    }
  }

  async function editarDadosCliente() {
    setLoadingButton(true);

    const payload = getPayload();

    const response = await fetch(
      `/api/cadastros/cliente/?cpf=${cpf.replace(/\D/g, "")}`,
      {
        method: "PUT",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      toast.success("Dados atualizados com sucesso!");
      clearStatesAndErrors();
      setLoadingButton(false);

      setTimeout(() => {
        router.push("/relatorios/clientes");
      }, 500);
    } else {
      toast.error("Erro ao atualizar dados!");
      setLoadingButton(false);
    }
  }

  async function getClientePorCPF(cpfCliente) {
    setOpenBackdrop(true);
    const response = await fetch(
      `/api/cadastros/retrieveCliente/?cpf=${cpfCliente.replace(/\D/g, "")}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      }
    );

    if (response.ok) {
      const json = await response.json();
      getDataForEdit(json);
    }
    setOpenBackdrop(false);
  }

  function getPayload() {
    const payload = {
      id: id,
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

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setId("");
    setCpf("");
    setNome("");
    setDataNascimento(null);
    setEspecieInss(null);
    setMatricula("");
    setTelefoneUm("");
    setTelefoneDois("");
    setTelefoneTres("");
    setObservacao("");
  }

  function getDataForEdit(data) {
    clearErrors();

    setValue("nome", data.nome);
    setValue("cpf", formatarCPFSemAnonimidade(data.cpf));
    setValue("telefoneUm", data.telefone1);

    setId(data.id);
    setCpf(formatarCPFSemAnonimidade(data.cpf));
    setNome(data.nome);
    setDataNascimento(converterDataParaJS(data.dt_nascimento));
    setEspecieInss(
      data.especie
        ? {
            especie: data.especie,
          }
        : null
    );
    setMatricula(data.matricula);
    setTelefoneUm(data.telefone1 ? data.telefone1 : "");
    setTelefoneDois(data.telefone2 ? data.telefone2 : "");
    setTelefoneTres(data.telefone3 ? data.telefone3 : "");
    setObservacao(data.observacoes);
  }

  return (
    <ContentWrapper title="Cadastrar cliente">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        component="form"
        onSubmit={handleSubmit(() => {
          if (router.query?.cpf) {
            editarDadosCliente();
          } else {
            salvarCliente();
          }
        })}
        sx={{ width: "100%" }}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <InputMask
              {...register("cpf")}
              error={Boolean(errors.cpf)}
              mask="999.999.999-99"
              maskChar={null}
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value);
              }}
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
                    autoComplete="off"
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
    </ContentWrapper>
  );
}
