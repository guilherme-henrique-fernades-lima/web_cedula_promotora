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
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Constants
import {
  SITUACAO_PAGAMENTO,
  NATUREZA_DESPESA,
  TIPO_DESPESA,
} from "@/helpers/constants";

//Formatters
import {
  formatarCPFSemAnonimidade,
  converterDataParaJS,
} from "@/helpers/utils";

function getPayload() {
  const data = {
    id: "",
    dt_vencimento: "",
    descricao: "",
    valor: "",
    situacao: "",
    tp_despesa: "",
    natureza_despesa: "",
  };

  return data;
}

export default function CadastrarDespesa() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [dataVencimento, setDataVencimento] = useState(null);

  const handleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  return (
    <ContentWrapper title="Cadastrar despesa">
      <Toaster position="bottom-center" reverseOrder={true} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box component="form" sx={{ width: "100%" }}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DesktopDatePicker
                leftArrowButtonText="Mês anterior"
                rightArrowButtonText="Próximo mês"
                label="Data de vencimento"
                value={dataVencimento}
                onChange={(newValue) => {
                  setDataVencimento(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    autoComplete="off"
                  />
                )}
                disableFuture
                disableHighlightToday
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("nome")}
              // error={Boolean(errors.nome)}
              // value={nome}
              // onChange={(e) => {
              //   setNome(e.target.value.replace(/[^A-Za-z\s]/g, ""));
              // }}
              size="small"
              label="Descrição da despesa"
              placeholder="Descreva a despesa"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              // {...register("nome")}
              // error={Boolean(errors.nome)}
              // value={nome}
              // onChange={(e) => {
              //   setNome(e.target.value.replace(/[^A-Za-z\s]/g, ""));
              // }}
              size="small"
              label="Valor da despesa"
              placeholder="R$ 0,00"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              select
              required
              fullWidth
              label="Situação"
              size="small"
              // value={siglaLoja || ""}
              // onChange={(e) => {
              // 	setSiglaLoja(e.target.value);
              // }}
            >
              {SITUACAO_PAGAMENTO.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              select
              required
              fullWidth
              label="Natureza da despesa"
              size="small"
              // value={siglaLoja || ""}
              // onChange={(e) => {
              // 	setSiglaLoja(e.target.value);
              // }}
            >
              {NATUREZA_DESPESA.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              select
              required
              fullWidth
              label="Tipo de despesa"
              size="small"
              // value={siglaLoja || ""}
              // onChange={(e) => {
              // 	setSiglaLoja(e.target.value);
              // }}
            >
              {TIPO_DESPESA.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disableElevation
              loading={false}
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
