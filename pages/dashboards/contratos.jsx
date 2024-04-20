import { useState, useEffect, useMemo, useCallback } from "react";

//Third party libraries
// import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { useSession } from "next-auth/react";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import GridGraph from "@/components/GridGraphWrapper";

//Icons
import SearchIcon from "@mui/icons-material/Search";

//Mui components
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

//Constants
import { TP_CONVENIO, TP_OPERACAO } from "@/helpers/constants";

// Dashboards
import DashConvenios from "@/components/dashboards/contratos/DashConvenios";

var DATA_HOJE = new Date();

export default function DashboardContratos() {
  const { data: session } = useSession();

  const [contratos, setContratos] = useState([]);

  //Filtros
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [conveniosFilter, setConveniosFilter] = useState([]);
  const [operacoesFilter, setOperacoesFilter] = useState([]);
  const [bancosFilter, setBancosFilter] = useState([]);
  const [promotorasFilter, setPromotorasFilter] = useState([]);
  const [corretoresFilter, setCorretoresFilter] = useState([]);

  //Auxiliar para controlar o efeito do botao de pesquisar
  const [loadingButton, setLoadingButton] = useState(false);

  //Dados para selects
  const [bancos, setBancos] = useState([]);
  const [promotoras, setPromotoras] = useState([]);
  const [corretores, setCorretores] = useState([]);

  useEffect(() => {
    if (session?.user?.token) {
      getContratos();
      getBancos();
      getCorretores();
      getPromotoras();
    }
  }, [session?.user?.token]);

  async function getContratos() {
    setLoadingButton(true);

    const response = await fetch(
      `/api/dashboards/contratos/?dt_inicio=${moment(dataInicio).format(
        "YYYY-MM-DD"
      )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      }
    );

    const json = await response.json();
    setContratos(json);

    setLoadingButton(false);
  }

  const getBancos = useCallback(async () => {
    try {
      const response = await fetch(`/api/filtros/bancos/`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      const json = await response.json();
      setBancos(json);
    } catch (error) {
      console.error("Erro ao obter bancos:", error);
    }
  }, [session?.user?.token]);

  const getPromotoras = useCallback(async () => {
    try {
      const response = await fetch(`/api/filtros/promotoras/`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      const json = await response.json();
      setPromotoras(json);
    } catch (error) {
      console.error("Erro ao obter bancos:", error);
    }
  }, [session?.user?.token]);

  const getCorretores = useCallback(async () => {
    try {
      const response = await fetch(`/api/filtros/corretores/`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      const json = await response.json();
      setCorretores(json);
    } catch (error) {
      console.error("Erro ao obter bancos:", error);
    }
  }, [session?.user?.token]);

  const dataArrayConvenios = useMemo(() => {
    return contratos?.indicadores?.convenios.map((row, index) => ({
      id: index,
      name: row.convenio,
      qtd: row.qtd,
      vlr_total: row.vlr_total,
      perc_qtd: row.perc_qtd,
    }));
  }, [contratos?.indicadores?.convenios]);

  return (
    <ContentWrapper title="Dashboard de contratos">
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
            onClick={getContratos}
          >
            Pesquisar
          </LoadingButton>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Autocomplete
            multiple
            size="small"
            limitTags={2}
            filterSelectedOptions
            disableCloseOnSelect
            onChange={(event, value) => {
              setConveniosFilter(value);
            }}
            clearOnEscape
            options={TP_CONVENIO}
            getOptionLabel={(option) => option.label}
            value={conveniosFilter}
            renderInput={(params) => (
              <TextField {...params} label="Convênios" />
            )}
            clearText="Resetar opções"
            closeText="Ver opções"
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip
                  key={index}
                  {...getTagProps({ index })}
                  label={option.label}
                  size="small"
                />
              ));
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Autocomplete
            multiple
            size="small"
            limitTags={1}
            filterSelectedOptions
            disableCloseOnSelect
            onChange={(event, value) => {
              setOperacoesFilter(value);
            }}
            clearOnEscape
            options={TP_OPERACAO}
            getOptionLabel={(option) => option.label}
            value={operacoesFilter}
            renderInput={(params) => (
              <TextField {...params} label="Operações" />
            )}
            clearText="Resetar opções"
            closeText="Ver opções"
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip
                  key={index}
                  {...getTagProps({ index })}
                  label={option.label}
                  size="small"
                />
              ));
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Autocomplete
            multiple
            size="small"
            limitTags={2}
            filterSelectedOptions
            disableCloseOnSelect
            onChange={(event, value) => {
              setBancosFilter(value);
            }}
            clearOnEscape
            options={bancos}
            getOptionLabel={(option) => option.banco}
            value={bancosFilter}
            renderInput={(params) => <TextField {...params} label="Bancos" />}
            clearText="Resetar opções"
            closeText="Ver opções"
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip
                  key={index}
                  {...getTagProps({ index })}
                  label={option.banco}
                  size="small"
                />
              ));
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Autocomplete
            multiple
            size="small"
            limitTags={2}
            filterSelectedOptions
            disableCloseOnSelect
            onChange={(event, value) => {
              setPromotorasFilter(value);
            }}
            clearOnEscape
            options={promotoras}
            getOptionLabel={(option) => option.promotora}
            value={promotorasFilter}
            renderInput={(params) => (
              <TextField {...params} label="Promotoras" />
            )}
            clearText="Resetar opções"
            closeText="Ver opções"
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip
                  key={index}
                  {...getTagProps({ index })}
                  label={option.promotora}
                  size="small"
                />
              ));
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Autocomplete
            multiple
            size="small"
            limitTags={2}
            filterSelectedOptions
            disableCloseOnSelect
            onChange={(event, value) => {
              setCorretoresFilter(value);
            }}
            clearOnEscape
            options={corretores}
            getOptionLabel={(option) => option.corretor}
            value={corretoresFilter}
            renderInput={(params) => (
              <TextField {...params} label="Corretores" />
            )}
            clearText="Resetar opções"
            closeText="Ver opções"
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip
                  key={index}
                  {...getTagProps({ index })}
                  label={option.corretor}
                  size="small"
                />
              ));
            }}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ width: "100%", mt: 2 }}>
        <GridGraph title="Convênios" xs={12} sm={12} md={12} lg={6} xl={6}>
          <DashConvenios data={dataArrayConvenios} />
        </GridGraph>
      </Grid>
    </ContentWrapper>
  );
}

function ShowAlertNoDataForGraph() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <EqualizerIcon sx={{ color: "#c7c7c7", fontSize: 160 }} />
      <Typography
        variant="span"
        sx={{
          fontFamily: "Lato, sans-serif",
          fontWeight: 300,
          color: "#696969",
        }}
      >
        Sem dados para exibir
      </Typography>
    </Box>
  );
}
