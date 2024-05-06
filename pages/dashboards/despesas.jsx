import { useState, useEffect, useMemo } from "react";

import { useSession } from "next-auth/react";
import moment from "moment";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import GridGraph from "@/components/GridGraphWrapper";
import NoDataToShow from "@/components/NoDataForShow";

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

//Icons
import SearchIcon from "@mui/icons-material/Search";

var DATA_HOJE = new Date();

export default function DashboardDespesas() {
  const { data: session } = useSession();

  const [despesas, setDespesas] = useState([]);

  //Auxiliar para controlar o efeito do botao de pesquisar
  const [loadingButton, setLoadingButton] = useState(false);
  const [picklist, setPicklistLojas] = useState([]);

  //Filtros
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [loja, setLoja] = useState("");

  const handleChangeLoja = (event) => {
    setLoja(event.target.value);
  };

  useEffect(() => {
    if (session?.user?.token) {
      getLojas();
    }
  }, [session?.user?.token]);

  async function getDespesas() {
    try {
      setLoadingButton(true);
      const response = await fetch(
        `/api/dashboards/despesas/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}&loja=${loja}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setDespesas(json?.despesas);
      }
    } catch (error) {
      console.error("Erro ao obter despesas:", error);
    }

    setLoadingButton(false);
  }

  async function getLojas() {
    try {
      const response = await fetch("/api/configuracoes/lojas/?ativas=true", {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setPicklistLojas(json);
      }
    } catch (error) {
      console.log(error);
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

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
          <TextField
            select
            label="Lojas"
            value={loja}
            size="small"
            fullWidth
            onChange={handleChangeLoja}
          >
            {picklist?.map((loja) => (
              <MenuItem value={loja.id} key={loja.id}>
                {loja.sg_loja}
              </MenuItem>
            ))}
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
          {dataArrayDespesas?.length > 0 ? (
            <DashDespesas data={dataArrayDespesas} />
          ) : (
            <NoDataToShow />
          )}
        </GridGraph>
      </Grid>
    </ContentWrapper>
  );
}
