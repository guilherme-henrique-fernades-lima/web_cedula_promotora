import { useState, useEffect, useMemo, useCallback } from "react";

import moment from "moment";
import { useSession } from "next-auth/react";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import GridGraph from "@/components/GridGraphWrapper";
import DataTable from "@/components/Datatable";
import NoDataToShow from "@/components/NoDataForShow";

//Icons
import SearchIcon from "@mui/icons-material/Search";
import TableRowsIcon from "@mui/icons-material/TableRows";
import LineAxisIcon from "@mui/icons-material/LineAxis";

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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//Constants
import { TP_CONVENIO, TP_OPERACAO } from "@/helpers/constants";

// Dashboards
import DashConvenios from "@/components/dashboards/contratos/DashConvenios";
import DashCorretores from "@/components/dashboards/contratos/DashCorretores";
import DashBancos from "@/components/dashboards/contratos/DashBancos";
import DashOperacoes from "@/components/dashboards/contratos/DashOperacoes";
import DashPromotoras from "@/components/dashboards/contratos/DashPromotoras";

// Utils
import {
  formatarReal,
  formatarCPFSemAnonimidade,
  formatarData,
  formatarValorBRL,
} from "@/helpers/utils";

var DATA_HOJE = new Date();

export default function DashboardContratos() {
  const { data: session } = useSession();

  const [contratos, setContratos] = useState([]);

  //Filtros
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [viewType, setViewType] = useState("qtd");
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

  const [alignment, setAlignment] = useState("dash");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    if (session?.user?.token) {
      getContratos();
      getBancos();
      getCorretores();
      getPromotoras();
    }
  }, [session?.user?.token]);

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  function handleQuery(array) {
    const arrayData = [];
    for (var i = 0; i < array.length; i++) {
      arrayData.push(array[i]["value"]);
    }
    return arrayData;
  }

  function handleQueryWithKey(array, key) {
    const arrayData = [];
    for (var i = 0; i < array.length; i++) {
      arrayData.push(array[i][key]);
    }
    return arrayData;
  }

  const getContratos = useCallback(async () => {
    try {
      setLoadingButton(true);

      const response = await fetch(
        `/api/dashboards/contratos/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format(
          "YYYY-MM-DD"
        )}&convenios=${handleQuery(
          conveniosFilter
        )}&promotoras=${handleQueryWithKey(
          promotorasFilter,
          "promotora"
        )}&corretores=${handleQueryWithKey(
          corretoresFilter,
          "corretor"
        )}&operacoes=${handleQuery(
          operacoesFilter
        )}&bancos=${handleQueryWithKey(bancosFilter, "banco")}`,
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
    } catch (error) {
      console.error("Erro ao obter contratos:", error);
    }
  }, [
    session?.user?.token,
    dataInicio,
    dataFim,
    conveniosFilter,
    bancosFilter,
    corretoresFilter,
    promotorasFilter,
    operacoesFilter,
  ]);

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
      console.error("Erro ao obter promotoras:", error);
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
      console.error("Erro ao obter corretores:", error);
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

  const dataArrayCorretores = useMemo(() => {
    return contratos?.indicadores?.corretores.map((row, index) => ({
      id: index,
      name: row.corretor,
      qtd: row.qtd,
      vlr_total: row.vlr_total,
      perc_qtd: row.perc_qtd,
    }));
  }, [contratos?.indicadores?.corretores]);

  const dataArrayBancos = useMemo(() => {
    return contratos?.indicadores?.bancos.map((row, index) => ({
      id: index,
      name: row.banco,
      qtd: row.qtd,
      vlr_total: row.vlr_total,
      perc_qtd: row.perc_qtd,
    }));
  }, [contratos?.indicadores?.bancos]);

  const dataArrayPromotoras = useMemo(() => {
    return contratos?.indicadores?.promotoras.map((row, index) => ({
      id: index,
      name: row.promotora,
      qtd: row.qtd,
      vlr_total: row.vlr_total,
      perc_qtd: row.perc_qtd,
    }));
  }, [contratos?.indicadores?.promotoras]);

  const dataArrayOperacoes = useMemo(() => {
    return contratos?.indicadores?.operacoes.map((row, index) => ({
      id: index,
      name: row.operacao,
      qtd: row.qtd,
      vlr_total: row.vlr_total,
      perc_qtd: row.perc_qtd,
    }));
  }, [contratos?.indicadores?.operacoes]);

  const columns = useMemo(
    () => [
      {
        field: "promotora",
        headerName: "PROMOTORA",
        renderHeader: (params) => <strong>PROMOTORA</strong>,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "dt_digitacao",
        headerName: "DATA DIGITAÇÃO",
        renderHeader: (params) => <strong>DATA DIGITAÇÃO</strong>,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarData(params.value);
          }
        },
      },
      {
        field: "nr_contrato",
        headerName: "NR. CONTRATO",
        renderHeader: (params) => <strong>NR. CONTRATO</strong>,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "no_cliente",
        headerName: "NOME CLIENTE",
        renderHeader: (params) => <strong>NOME CLIENTE</strong>,
        minWidth: 300,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cpf",
        headerName: "CPF CLIENTE",
        renderHeader: (params) => <strong>CPF CLIENTE</strong>,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarCPFSemAnonimidade(params.value);
          }
        },
      },
      {
        field: "convenio",
        headerName: "CONVÊNIO",
        renderHeader: (params) => <strong>CONVÊNIO</strong>,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "operacao",
        headerName: "OPERAÇÃO",
        renderHeader: (params) => <strong>OPERAÇÃO</strong>,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "banco",
        headerName: "BANCO",
        renderHeader: (params) => <strong>BANCO</strong>,
        minWidth: 220,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "vl_contrato",
        headerName: "VLR. CONTRATO",
        renderHeader: (params) => <strong>VLR. CONTRATO</strong>,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarValorBRL(parseFloat(params.value));
          }
        },
      },
      {
        field: "qt_parcelas",
        headerName: "QTD. PARCELAS",
        renderHeader: (params) => <strong>QTD. PARCELAS</strong>,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "vl_parcela",
        headerName: "VLR. PARCELA",
        renderHeader: (params) => <strong>VLR. PARCELA</strong>,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarValorBRL(parseFloat(params.value));
          }
        },
      },
      {
        field: "dt_pag_cliente",
        headerName: "DT. PAG. CLIENTE",
        renderHeader: (params) => <strong>DT. PAG. CLIENTE</strong>,
        minWidth: 230,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarData(params.value);
          }
        },
      },
      {
        field: "dt_pag_comissao",
        headerName: "DT. PAG. COMISSÃO",
        renderHeader: (params) => <strong>DT. PAG. COMISSÃO</strong>,
        minWidth: 230,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarData(params.value);
          }
        },
      },
      {
        field: "vl_comissao",
        headerName: "VLR. COMISSÃO",
        renderHeader: (params) => <strong>VLR. COMISSÃO</strong>,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            return formatarValorBRL(parseFloat(params.value));
          }
        },
      },
      {
        field: "porcentagem",
        headerName: "(%) PORCENTAGEM",
        renderHeader: (params) => <strong>(%) PORCENTAGEM</strong>,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "corretor",
        headerName: "CORRETOR",
        renderHeader: (params) => <strong>CORRETOR</strong>,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
      },
    ],
    [contratos?.data]
  );

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

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl>
            <RadioGroup
              row
              name="row-radio-buttons-group"
              value={viewType}
              onChange={handleViewTypeChange}
            >
              <FormControlLabel
                value="qtd"
                control={<Radio />}
                label="Quantidade de contratos"
              />
              <FormControlLabel
                value="money"
                control={<Radio />}
                label="Valores ($)"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

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
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        size="small"
        color="primary"
        sx={{ mt: 2 }}
      >
        <ToggleButton value="dash">
          <LineAxisIcon />
        </ToggleButton>
        <ToggleButton value="table">
          <TableRowsIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {alignment == "dash" ? (
        <Grid container sx={{ width: "100%", mt: 2 }}>
          <GridGraph
            title="Quantidade total de contratos"
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            size={100}
          >
            <Typography
              variant="span"
              sx={{
                fontWeight: "bold",
                color: "#292929",
              }}
            >
              {contratos?.indicadores?.tt_contratos
                ? contratos?.indicadores?.tt_contratos
                : 0}
            </Typography>
          </GridGraph>

          <GridGraph
            title="Valor total de contratos"
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            size={100}
          >
            <Typography
              variant="span"
              sx={{
                fontWeight: "bold",
                color: "#292929",
              }}
            >
              {contratos?.indicadores?.tt_vl_contratos
                ? formatarReal(contratos?.indicadores?.tt_vl_contratos)
                : formatarReal(0)}
            </Typography>
          </GridGraph>

          <GridGraph
            title="Valor total de comissões"
            xs={12}
            sm={12}
            md={12}
            lg={4}
            xl={4}
            size={100}
          >
            <Typography
              variant="span"
              sx={{
                fontWeight: "bold",
                color: "#292929",
              }}
            >
              {contratos?.indicadores?.tt_vl_comissoes
                ? formatarReal(contratos?.indicadores?.tt_vl_comissoes)
                : formatarReal(0)}
            </Typography>
          </GridGraph>

          <GridGraph title="Corretores" xs={12} sm={12} md={12} lg={12} xl={12}>
            {dataArrayCorretores?.length == 0 ? (
              <NoDataToShow />
            ) : (
              <DashCorretores
                data={dataArrayCorretores}
                viewType={viewType}
                label
              />
            )}
          </GridGraph>

          <GridGraph title="Bancos" xs={12} sm={12} md={12} lg={12} xl={12}>
            {dataArrayBancos?.length == 0 ? (
              <NoDataToShow />
            ) : (
              <DashBancos data={dataArrayBancos} viewType={viewType} label />
            )}
          </GridGraph>

          <GridGraph title="Convênios" xs={12} sm={12} md={12} lg={6} xl={6}>
            {dataArrayConvenios?.length == 0 ? (
              <NoDataToShow />
            ) : (
              <DashConvenios
                data={dataArrayConvenios}
                legend
                viewType={viewType}
              />
            )}
          </GridGraph>

          <GridGraph title="Promotoras" xs={12} sm={12} md={12} lg={6} xl={6}>
            {dataArrayPromotoras?.length == 0 ? (
              <NoDataToShow />
            ) : (
              <DashPromotoras
                data={dataArrayPromotoras}
                legend
                viewType={viewType}
              />
            )}
          </GridGraph>

          <GridGraph title="Operações" xs={12} sm={12} md={12} lg={12} xl={12}>
            {dataArrayOperacoes?.length == 0 ? (
              <NoDataToShow />
            ) : (
              <DashOperacoes
                data={dataArrayOperacoes}
                legend
                viewType={viewType}
                label
              />
            )}
          </GridGraph>
        </Grid>
      ) : (
        <Box sx={{ width: "100%" }}>
          {contratos?.data?.length > 0 ? (
            <DataTable rows={contratos?.data} columns={columns} />
          ) : (
            <GridGraph xs={12} sm={12} md={12} lg={12} xl={12}>
              <NoDataToShow />
            </GridGraph>
          )}
        </Box>
      )}
    </ContentWrapper>
  );
}
