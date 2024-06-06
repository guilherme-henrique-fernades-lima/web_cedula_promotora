import { useState, useEffect } from "react";
//Third party libraries
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import moment from "moment";
import { useRouter } from "next/router";

//Mui components
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerField from "@/components/DatepickerField";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";

//Utils
import {
  formatarCPFSemAnonimidade,
  converterDataParaJS,
} from "@/helpers/utils";

//Icons
import SaveIcon from "@mui/icons-material/Save";

export default function FuturosContratos() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      retrieveData(id, session?.user?.id);
    }
  }, [id]);

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [iletrado, setIletrado] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [documentoSalvo, setDocumentoSalvo] = useState("");
  const [convenio, setConvenio] = useState("");
  const [operacao, setOperacao] = useState("");
  const [banco, setBanco] = useState("");
  const [corretor, setCorretor] = useState("");
  const [promotora, setPromotora] = useState("");
  const [dt_digitacao, setDtDigitacao] = useState(null);
  const [dt_pag_cliente, setDtPagCliente] = useState(null);
  const [nr_contrato, setNrContrato] = useState("");
  const [no_cliente, setNoCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [vl_contrato, setVlContrato] = useState("");
  const [qt_parcelas, setQtParcelas] = useState("");
  const [vl_parcela, setVlParcela] = useState("");
  const [tabela, setTabela] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [statusComissao, setStatusComissao] = useState("");
  const [dt_pag_comissao, setDtPagComissao] = useState(null);
  const [vl_comissao, setVlComissao] = useState("");
  const [representanteLegal, setRepresentanteLegal] = useState("");

  //States dos dados dos picklists
  const [convenioPicklist, setConvenioPicklist] = useState([]);
  const [operacaoPicklist, setOperacaoPicklist] = useState([]);
  const [bancoPicklist, setBancoPicklist] = useState([]);

  useEffect(() => {
    if (session?.user?.token) {
      getConveniosPicklist();
      getOperacoesPicklist();
      getBancosPicklist();
    }
  }, [session?.user?.token]);

  function getPayload() {
    const data = {
      promotora: promotora,
      dt_digitacao: dt_digitacao
        ? moment(dt_digitacao).format("YYYY-MM-DD")
        : null,
      nr_contrato: nr_contrato,
      no_cliente: no_cliente.toUpperCase(),
      cpf: cpf,
      convenio: convenio,
      tabela: tabela,
      operacao: operacao,
      banco: banco,
      vl_contrato: parseFloat(vl_contrato),
      qt_parcelas: qt_parcelas,
      vl_parcela: parseFloat(vl_parcela),
      dt_pag_cliente: dt_pag_cliente
        ? moment(dt_pag_cliente).format("YYYY-MM-DD")
        : null,
      porcentagem: parseFloat(porcentagem),
      corretor: corretor,
      user_id_created: session?.user?.id,
      representante_legal: representanteLegal,
      tipo_contrato: tipoContrato,
      iletrado: iletrado,
      documento_salvo: documentoSalvo,
      dt_pag_comissao: dt_pag_comissao
        ? moment(dt_pag_comissao).format("YYYY-MM-DD")
        : null,
      vl_comissao: parseFloat(vl_comissao),
    };

    return data;
  }

  async function updatePreContrato() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch(`/api/cadastros/futuros-contratos/?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  async function save() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch("/api/cadastros/futuros-contratos", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
      clearStatesAndErrors();
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  async function retrieveData(id) {
    setOpenBackdrop(true);
    const response = await fetch(`/api/cadastros/futuros-contratos/?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.status == 200) {
      const json = await response.json();
      setDataForEdition(json);
    } else {
      toast.error("Aconteceu algum erro");
    }

    setOpenBackdrop(false);
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setPromotora("");
    setDtDigitacao(null);
    setNrContrato("");
    setNoCliente("");
    setCpf("");
    setConvenio("");
    setOperacao("");
    setBanco("");
    setVlContrato("");
    setQtParcelas("");
    setVlParcela("");
    setDtPagCliente(null);
    setDtPagComissao(null);
    setVlComissao("");
    setPorcentagem("");
    setCorretor("");
    setIletrado("");
    setRepresentanteLegal("");
    setDocumentoSalvo("");
    setTipoContrato("");
    setTabela("");
    setStatusComissao("");
  }

  async function getConveniosPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/convenios/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setConvenioPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getOperacoesPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/operacoes/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setOperacaoPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getBancosPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/bancos/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setBancoPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function setDataForEdition(data) {
    console.log(data);

    setIletrado(data.iletrado);
    setRepresentanteLegal(data.representante_legal);
    setTipoContrato(data.tipo_contrato);
    setDocumentoSalvo(data.documento_salvo);
    setConvenio(data.convenio);
    setOperacao(data.operacao);
    setBanco(data.banco);
    setCorretor(data.corretor);
    setPromotora(data.promotora);
    setDtDigitacao(
      data.dt_digitacao ? converterDataParaJS(data.dt_digitacao) : null
    );
    setDtPagCliente(
      data.dt_pag_cliente ? converterDataParaJS(data.dt_pag_cliente) : null
    );
    setNrContrato(data.nr_contrato);
    setNoCliente(data.no_cliente);
    setCpf(data.cpf);
    setVlContrato(parseFloat(data.vl_contrato));
    setQtParcelas(data.qt_parcelas);
    setVlParcela(parseFloat(data.vl_parcela));
    setTabela(data.tabela);
    setPorcentagem(data.porcentagem);
    setVlComissao(parseFloat(data.vl_comissao));
    setDtPagComissao(
      data.dt_pag_comissao ? converterDataParaJS(data.dt_pag_comissao) : null
    );
    setValue("vl_contrato", parseFloat(data.vl_contrato));
    setValue("vl_parcela", parseFloat(data.vl_parcela));
    setValue("porcentagem", parseFloat(data.porcentagem));
    setValue("cpf", formatarCPFSemAnonimidade(data.cpf));
    setValue("tabela", data.tabela);
    setValue("nr_contrato", data.nr_contrato);
    setValue("no_cliente", data.no_cliente);
    setValue("promotora", data.promotora);
    setValue("corretor", data.corretor);
    setValue("banco", data.banco);
    setValue("operacao", data.operacao);
    setValue("convenio", data.convenio);
    setValue("iletrado", data.iletrado);
    setValue("tipo_contrato", data.tipo_contrato);
    setValue("documentacao_salva", data.documento_salvo);
    setValue("representante_legal", data.representante_legal);

    if (session?.user?.is_superuser) {
      setStatusComissao(data.status_comissao);
    }
  }

  return (
    <ContentWrapper
      title={id ? "Editar futuro contrato" : "Cadastrar futuro contrato"}
    >
      <Toaster position="bottom-center" reverseOrder={true} />
      <BackdropLoadingScreen open={openBackdrop} />

      {id && (
        <Link href="/relatorios/futuros-contratos">
          <Button variant="outlined" sx={{ mt: 2 }}>
            VOLTAR
          </Button>
        </Link>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }} component="form">
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de concessão do benefício"
            value={dt_digitacao}
            onChange={setDtDigitacao}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de efetivação do empréstimo"
            value={dt_digitacao}
            onChange={setDtDigitacao}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={nr_contrato}
            setValue={setNrContrato}
            label="Número do contrato"
            placeholder="Insira o contrato"
            validateFieldName="nr_contrato"
            //control={control}
            onlyNumbers
          />
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            mask="999.999.999-99"
            maskChar={null}
            value={cpf}
            onChange={(e) => {
              setCpf(e.target.value);
            }}
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
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={no_cliente}
            setValue={setNoCliente}
            label="Nome do cliente"
            placeholder="Insira o nome completo do cliente"
            validateFieldName="no_cliente"
            numbersNotAllowed
            inputProps={{ maxLength: 255 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            select
            fullWidth
            label="Convênio"
            size="small"
            value={convenio}
            onChange={(e) => {
              setConvenio(e.target.value);
            }}
          >
            {convenioPicklist?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            select
            fullWidth
            label="Operação"
            size="small"
            value={operacao}
            onChange={(e) => {
              setOperacao(e.target.value);
            }}
          >
            {operacaoPicklist?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            select
            fullWidth
            label="Banco"
            size="small"
            value={banco}
            onChange={(e) => {
              setBanco(e.target.value);
            }}
          >
            {bancoPicklist?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_contrato"
            // control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="R$ "
                onValueChange={(values) => {
                  // setVlContrato(values?.floatValue);

                  setVlContrato(values.value); // Update the state with the formatted value
                  field.onChange(values.floatValue);
                }}
                error={Boolean(errors.vl_contrato)}
                size="small"
                label="Valor do contrato"
                placeholder="R$ 0,00"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />
        </Grid>


        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_parcela"
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="R$ "
                onValueChange={(values) => {
                  setVlParcela(values?.floatValue);
                }}
                error={Boolean(errors.vl_parcela)}
                size="small"
                label="Valor da parcela"
                placeholder="R$ 0,00"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de pagamento ao cliente"
            value={dt_pag_cliente}
            onChange={setDtPagCliente}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de pagamento da comissão"
            value={dt_pag_comissao}
            onChange={setDtPagComissao}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="porcentagem"
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                decimalSeparator=","
                isNumericString
                suffix="%"
                allowEmptyFormatting
                onValueChange={(values) => {
                  setPorcentagem(values?.floatValue);
                }}
                //Aqui pra baixo textfield
                error={Boolean(errors.porcentagem)}
                size="small"
                label="(%) Porcentagem"
                placeholder="% de juros"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <NumericFormat
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="R$ "
            value={vl_comissao}
            onValueChange={(values) => {
              setVlComissao(values?.floatValue);
            }}
            size="small"
            label="Valor da comissão"
            placeholder="R$ 0,00"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 16 }}
          />
        </Grid> */}

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

        <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<SaveIcon />}
            disableElevation
            loading={loadingButton}
            fullWidth
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