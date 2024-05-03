import { useState, useEffect, useMemo, useCallback } from "react";

import { useSession } from "next-auth/react";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import GridGraph from "@/components/GridGraphWrapper";

//Dashboards
import DashDespesas from "@/components/dashboards/despesas/DashDespesas";

//Mui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

//Icons
import SearchIcon from "@mui/icons-material/Search";

var DATA_HOJE = new Date();

export default function DashboardDespesas() {
  const { data: session } = useSession();

  const [despesas, setDespesas] = useState([]);

  //Auxiliar para controlar o efeito do botao de pesquisar
  const [loadingButton, setLoadingButton] = useState(false);

  //Filtros
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());

  const [loja, setLoja] = useState("");

  const handleChangeLoja = (event) => {
    setLoja(event.target.value);
  };

  useEffect(() => {
    if (session?.user?.token) {
      getDespesas();
    }
  }, [session?.user?.token]);

  async function getDespesas() {
    try {
      const response = await fetch(`/api/dashboards/despesas/`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDespesas(json?.despesas);
      }
    } catch (error) {
      console.error("Erro ao obter despesas:", error);
    }
  }

  const dataArrayDespesas = useMemo(() => {
    return despesas?.map((row, index) => ({
      id: index,
      name: row.nome_mes_ano,
      vlr_total: row.vlr_total,
      fill: row.vlr_total > 0 ? "#35B117" : "#DE1414",
    }));
  }, [despesas]);

  return (
    <ContentWrapper title="Dashboard de despesas">
      <Grid container sx={{ width: "100%", mt: 1 }} spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
            <DesktopDatePicker
              leftArrowButtonText="Mês anterior"
              rightArrowButtonText="Próximo mês"
              label="Início"
              value={dataInicio}
              onChange={(newValue) => {
                setDataInicio(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  autoComplete="off"
                />
              )}
              disableHighlightToday
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} xl={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
            <DesktopDatePicker
              leftArrowButtonText="Mês anterior"
              rightArrowButtonText="Próximo mês"
              label="Fim"
              value={dataFim}
              onChange={(newValue) => {
                setDataFim(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  autoComplete="off"
                />
              )}
              disableHighlightToday
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} xl={2}>
          <LoadingButton
            variant="contained"
            size="large"
            disableElevation
            endIcon={<SearchIcon />}
            loading={loadingButton}
            onClick={getDespesas}
          >
            Pesquisar
          </LoadingButton>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* <InputLabel id="loja-label">Loja</InputLabel>
          <Select
            labelId="loja-label"
            label="Loja"
            value={loja}
            onChange={handleChangeLoja}
            size="small"
          >
            <MenuItem value="todas">Todas</MenuItem>
            <MenuItem value="filial">Filial</MenuItem>
            <MenuItem value="matriz">Matriz</MenuItem>
          </Select> */}

          <TextField
            id="outlined-select-currency"
            select
            label="Lojas"
            value={loja}
            size="small"
            fullWidth
          >
            <MenuItem value="todas">Todas</MenuItem>
            <MenuItem value="filial">Filial</MenuItem>
            <MenuItem value="matriz">Matriz</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Grid container sx={{ width: "100%" }}>
        <GridGraph
          title="Mapa de lucros e despesas"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          size={700}
        >
          <DashDespesas data={dataArrayDespesas} />
        </GridGraph>
      </Grid>
    </ContentWrapper>
  );
}
