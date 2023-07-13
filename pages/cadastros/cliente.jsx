import { useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import { ESPECIES_INSS } from "@/helpers/constants";

const clienteCallCenterSchema = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(11, "O CPF precisa ter pelo menos 11 digitos"),
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

  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [especieInss, setEspecieInss] = useState(null);

  async function salvarCliente() {
    console.log("Entrou na função salvarCliente");
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
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <TextField
              {...register("cpf")}
              error={Boolean(errors.cpf)}
              size="small"
              label="CPF"
              placeholder="000.000.000-000"
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
            <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.cpf?.message}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <TextField
              size="small"
              label="Nome"
              placeholder="Insira o nome completo"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <DatepickerField
              value={dataNascimento}
              textLabel="Data de nascimento"
              onChange={setDataNascimento}
            />
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
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

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <TextField
              size="small"
              label="Telefone"
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

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
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
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
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
            <Button
              variant="contained"
              type="submit"
              endIcon={<SaveIcon />}
              disableElevation
            >
              SALVAR
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ContentWrapper>
  );
}
