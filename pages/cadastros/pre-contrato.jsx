import { useState } from "react";
//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//Mui components
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import LoadingButton from "@mui/lab/LoadingButton";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";

//Schema
import { preContratoSchema } from "@/schemas/preContratoSchema";

//Icons
import SaveIcon from "@mui/icons-material/Save";

export default function CadastrarPreContrato(props) {
  //const { data: session } = useSession();

  const [loadingButton, setLoadingButton] = useState(false);

  const [iletrado, setIletrado] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [documentoSalvo, setDocumentoSalvo] = useState("");
  //const [statusComissao, setStatusComissao] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(preContratoSchema),
  });

  const onSubmit = (data) => {
    const payload = {
      iletrado: iletrado,
      tipo_contrato: tipoContrato,
      documento_salvo: documentoSalvo,
    };

    console.log(payload);
  };

  return (
    <ContentWrapper title="Cadastrar pré-contrato">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Grid
        container
        spacing={2}
        sx={{ mt: 1 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl component="fieldset" error={Boolean(errors.iletrado)}>
            <FormLabel component="legend">Iletrado</FormLabel>
            <Controller
              name="iletrado"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  error={Boolean(errors.iletrado)}
                  value={iletrado}
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
                    value="Não"
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
                    label="Não"
                  />
                </RadioGroup>
              )}
            />
            {errors.iletrado && (
              <FormHelperText>{errors.iletrado.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl
            component="fieldset"
            error={Boolean(errors.tipo_contrato)}
          >
            <FormLabel component="legend">Tipo de contrato</FormLabel>
            <Controller
              name="tipo_contrato"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  error={Boolean(errors.tipo_contrato)}
                >
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
              )}
            />
            {errors.tipo_contrato && (
              <FormHelperText>{errors.tipo_contrato.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl
            component="fieldset"
            error={Boolean(errors.documentacao_salva)}
          >
            <FormLabel component="legend">Documentação foi salva?</FormLabel>
            <Controller
              name="documentacao_salva"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  error={Boolean(errors.documentacao_salva)}
                >
                  <FormControlLabel
                    value="Sim"
                    control={
                      <Radio
                      // sx={{
                      //   color: "#1a3d74",
                      //   "&.Mui-checked": {
                      //     color: "#1a3d74",
                      //   },
                      // }}
                      />
                    }
                    label="Sim"
                  />
                  <FormControlLabel
                    value="Não"
                    control={
                      <Radio
                      // sx={{
                      //   color: "#1a3d74",
                      //   "&.Mui-checked": {
                      //     color: "#1a3d74",
                      //   },
                      // }}
                      />
                    }
                    label="Não"
                  />
                </RadioGroup>
              )}
            />
            {errors.documentacao_salva && (
              <FormHelperText>
                {errors.documentacao_salva.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 2 }}>
          <FormControl
            component="fieldset"
            error={Boolean(errors.status_comissao)}
          >
            <FormLabel component="legend">Status da comissão</FormLabel>
            <Controller
              name="status_comissao"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  error={Boolean(errors.status_comissao)}
                >
                  <FormControlLabel
                    value="Paga"
                    control={
                      <Radio
                      // sx={{
                      //   color: errors.status_comissao ? "red" : "#1a3d74",
                      //   "&.Mui-checked": {
                      //     color: errors.status_comissao ? "red" : "#1a3d74",
                      //   },
                      // }}
                      />
                    }
                    label="Paga"
                  />
                  <FormControlLabel
                    value="Aguardando pagamento"
                    control={<Radio />}
                    label="Aguardando pagamento"
                  />
                  <FormControlLabel
                    value="Aguardando fisco"
                    control={<Radio />}
                    label="Aguardando fisco"
                  />
                  <FormControlLabel
                    value="Análise financeira"
                    control={<Radio />}
                    label="Análise financeira"
                  />
                </RadioGroup>
              )}
            />
            {errors.status_comissao && (
              <FormHelperText>{errors.status_comissao.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<SaveIcon />}
            disableElevation
            loading={loadingButton}
          >
            SALVAR
          </LoadingButton>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}

/**
 * /Novos campos solicitados:
 * tipo promotora, data de digitacao, numero do contrato, cpf, nome do cliente, convenio, operacao,banco,valor contrato, tabela, percentual, iletrado
 * qtd. parcelas, valor da parc. , data pag. cliente, documentacao salva (sim ou não), contrato (digital ou fisico), corretor,observacao
 *
 * Campos somente para edição do Felipe
 * Comissão (Paga, aguardando pagamento, aguardando fisco, análise financeira)
 */
