import { useState } from "react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";
import DatepickerField from "../../components/DatepickerField";

//Mui components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function CadastrarCliente() {
  const [dataNascimento, setDataNascimento] = useState(new Date());

  return (
    <ContentWrapper title="Cadastrar cliente">
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <TextField
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
          <TextField
            size="small"
            label="Espécie INSS"
            placeholder="Selecione"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
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
          <Button disableElevation variant="contained">
            SALVAR
          </Button>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
