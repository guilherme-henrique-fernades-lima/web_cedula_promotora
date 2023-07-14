import { useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";
import DatepickerField from "../../components/DatepickerField";

//Mui components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import { ESPECIES_INSS } from "@/helpers/constants";

const clienteCallCenterSchema = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  telefoneUm: yup.string().required("Informe um telefone válido"),
  nome: yup.string().required("O nome do cliente é obrigatório"),
  dataNascimento: yup.date().required("A data de nascimento é obrigatória"),
});

export default function CadastrarCliente() {
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

  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [especieInss, setEspecieInss] = useState(null);
  const [matricula, setMatricula] = useState("");
  const [telefoneUm, setTelefoneUm] = useState("");
  const [telefoneDois, setTelefoneDois] = useState("");
  const [telefoneTres, setTelefoneUmTres] = useState("");
  const [observacao, setObservacao] = useState("");

  async function salvarCliente() {
    console.log("Entrou na função salvarCliente");

    const payload = getPayload();

    console.log("payload: ", payload);
  }

  function getPayload() {
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome: nome,
      dt_nascimento: dataNascimento
        ? moment(dataNascimento).format("YYYY-MM-DD")
        : null,
      especie: especieInss.especie,
      matricula: matricula,
      telefone1: telefoneUm.replace(/\D/g, ""),
      telefone2: telefoneDois.replace(/\D/g, ""),
      telefone3: telefoneTres.replace(/\D/g, ""),
      observacoes: observacao,
    };

    return payload;
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
        <Grid container spacing={1} sx={{ mt: 2 }}>
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
                setNome(e.target.value.replace(/[^A-Za-z]/g, ""));
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
            <DatepickerField
              value={dataNascimento}
              textLabel="Data de nascimento"
              onChange={setDataNascimento}
            />
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
            <TextField
              size="small"
              label="Telefone 2"
              placeholder="00 00000-0000"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{
                maxLength: 11,
              }}
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              size="small"
              label="Telefone 3"
              placeholder="00 00000-0000"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
              inputProps={{
                maxLength: 11,
              }}
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"))
              }
            />
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
              variant="contained"
              type="submit"
              endIcon={<SaveIcon />}
              disableElevation
              //loading
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
