//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

//Mui components
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";

export default function CadastrarPreContrato(props) {
  //const { data: session } = useSession();

  /**
   * /Novos campos solicitados:
   * tipo promotora, data de digitacao, numero do contrato, cpf, nome do cliente, convenio, operacao,banco,valor contrato, tabela, percentual,
   * qtd. parcelas, valor da parc. , data pag. cliente, documentacao salva (sim ou não), contrato (digital ou fisico), corretor,observacao
   *
   * Campos somente para edição do Felipe
   * Comissão (Paga, aguardando pagamento, aguardando fisco, análise financeira)
   */

  return (
    <ContentWrapper title="Cadastrar pré-contrato">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Tipo de contrato
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              row
            >
              <FormControlLabel
                value="Sim"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                value="Digital"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Digital"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Documentação foi salva?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              row
            >
              <FormControlLabel
                value="Sim"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                value="Físico"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Físico"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Status da comissão
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              row
            >
              <FormControlLabel
                value="Paga"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Paga"
              />
              <FormControlLabel
                value="Aguardando pagamento"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Aguardando pagamento"
              />

              <FormControlLabel
                value="Aguardando fisco"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Aguardando fisco"
              />

              <FormControlLabel
                value="Análise financeira"
                control={
                  <Radio
                    sx={{
                      color: "#1a3d74",
                      "&.Mui-checked": {
                        color: "#1a3d74",
                      },
                    }}
                  />
                }
                label="Análise financeira"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
