import { useState, useEffect } from "react";
//Third party libraries
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerField from "@/components/DatepickerField";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";
import DatepickerFieldWithValidation from "@/components/DatepickerFieldWithValidation";

//Utils
import {
  formatarCPFSemAnonimidade,
  converterDataParaJS,
} from "@/helpers/utils";

//Schema
import { preContratoSchema } from "@/schemas/preContratoSchema";

//Icons
import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function CadastrarPreContrato() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    setValue,
    reset,
    resetField,
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(preContratoSchema),
  });

  useEffect(() => {
    if (id) {
      retrievePreContrato(id, session?.user?.id);
    } else {
      clearStatesAndErrors();
    }
  }, [id]);

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

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
  const [corretorPicklist, setCorretorPicklist] = useState([]);
  const [promotoraPicklist, setPromotoraPicklist] = useState([]);

  //State para transmissão do pre contrato
  const [preContratoToSendContratos, setPreContratoToSendContratos] =
    useState("");
  const [openDialogSendPreContrato, setOpenDialogSendPreContrato] =
    useState(false);

  useEffect(() => {
    if (session?.user?.token) {
      getConveniosPicklist();
      getOperacoesPicklist();
      getCorretoresPicklist();
      getPromotorasPicklist();
      getBancosPicklist();
    }
  }, [session?.user?.token]);

  function actionsAfterDelete() {
    setOpenDialogSendPreContrato(false);
    setPreContratoToSendContratos("");
  }

  function getPayloadCadastrar() {
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
      qt_parcelas: qt_parcelas ? qt_parcelas : null,
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

  function getPayloadUpdate(id, superuser) {
    var data = {};

    if (id && superuser) {
      data = {
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
        iletrado: iletrado,
        representante_legal: representanteLegal,
        tipo_contrato: tipoContrato,
        documento_salvo: documentoSalvo,
        dt_pag_comissao: dt_pag_comissao
          ? moment(dt_pag_comissao).format("YYYY-MM-DD")
          : null,
        vl_comissao: parseFloat(vl_comissao),
        status_comissao: statusComissao,
        id_pre_contrato: id ? parseInt(id) : null,
      };
    } else {
      data = {
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
        iletrado: iletrado,
        representante_legal: representanteLegal,
        tipo_contrato: tipoContrato,
        documento_salvo: documentoSalvo,
        dt_pag_comissao: dt_pag_comissao
          ? moment(dt_pag_comissao).format("YYYY-MM-DD")
          : null,
        vl_comissao: parseFloat(vl_comissao),
      };
    }

    return data;
  }

  async function updatePreContrato() {
    setLoadingButton(true);
    const payload = getPayloadUpdate(id, session?.user?.is_superuser);

    const response = await fetch(`/api/cadastros/pre-contrato/?id=${id}`, {
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
    const payload = getPayloadCadastrar();

    const response = await fetch("/api/cadastros/pre-contrato", {
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

  async function retrievePreContrato(id) {
    setOpenBackdrop(true);
    const response = await fetch(
      `/api/cadastros/pre-contrato/?id=${id}&user_id=${session?.user?.id}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      }
    );

    if (response.status == 200) {
      const json = await response.json();
      setDataForEdition(json);
    } else if (response.status == 401) {
      toast.error("O pré contrato não é de sua autoria para edição");
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

  async function getCorretoresPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/corretores/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setCorretorPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getPromotorasPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/promotoras/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setPromotoraPicklist(json);
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

  async function getCliente(cpfSearch) {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/cadastros/contrato/?cpf=${cpfSearch.replace(/\D/g, "")}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setNoCliente(json.nome);
        setValue("no_cliente", json.nome);
      } else {
        setNoCliente("");
        resetField("no_cliente");
        toast.error(
          "Cliente não existe na base de dados do callcenter, insira manualmente ou cadastre-o."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast.error("Erro ao buscar cliente. Tente novamente mais tarde.");
    } finally {
      setIsFetching(false);
    }
  }

  function setDataForEdition(data) {
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
    setPorcentagem(parseFloat(data.porcentagem));
    setVlComissao(parseFloat(data.vl_comissao));
    setDtPagComissao(
      data.dt_pag_comissao ? converterDataParaJS(data.dt_pag_comissao) : null
    );

    setValue("vl_contrato", parseFloat(data.vl_contrato));
    setValue("cpf", formatarCPFSemAnonimidade(data.cpf));
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
    setValue("dt_digitacao", data.dt_digitacao);
    setValue("dt_pag_cliente", data.dt_pag_cliente);

    if (session?.user?.is_superuser) {
      setStatusComissao(data.status_comissao);
    }
  }

  return (
    <ContentWrapper
      title={id ? "Editar pré contrato" : "Cadastrar pré-contrato"}
    >
      <Toaster position="bottom-center" reverseOrder={true} />
      <BackdropLoadingScreen open={openBackdrop} />

      {id && (
        <Link href="/relatorios/pre-contratos">
          <Button variant="outlined" sx={{ mt: 2 }}>
            VOLTAR
          </Button>
        </Link>
      )}

      <Grid
        container
        spacing={2}
        sx={{ mt: 1 }}
        component="form"
        // onSubmit={handleSubmit(updatePreContrato)}
        onSubmit={handleSubmit(() => {
          id ? updatePreContrato() : save();
        })}
      >
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            {...register("promotora")}
            error={Boolean(errors.promotora)}
            select
            fullWidth
            label="Promotora"
            size="small"
            value={promotora}
            helperText={errors.promotora?.message}
            onChange={(e) => {
              setPromotora(e.target.value);
            }}
          >
            {promotoraPicklist?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="dt_digitacao"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatepickerFieldWithValidation
                label="Data de digitação"
                value={dt_digitacao}
                onChange={(newDate) => {
                  field.onChange(newDate);
                  setDtDigitacao(newDate);
                }}
                error={error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={nr_contrato}
            setValue={setNrContrato}
            label="Número do contrato"
            placeholder="Insira o contrato"
            validateFieldName="nr_contrato"
            control={control}
            onlyNumbers
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            {...register("cpf")}
            error={Boolean(errors.cpf)}
            mask="999.999.999-99"
            maskChar={null}
            value={cpf}
            onChange={(e) => {
              const cpf = e.target.value;

              setCpf(cpf);

              if (cpf.length === 14) {
                getCliente(cpf);
              }
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
          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.cpf?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={no_cliente}
            setValue={setNoCliente}
            label="Nome do cliente"
            placeholder="Insira o nome completo do cliente"
            validateFieldName="no_cliente"
            control={control}
            numbersNotAllowed
            inputProps={{ maxLength: 255 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            {...register("convenio")}
            error={Boolean(errors.convenio)}
            select
            fullWidth
            label="Convênio"
            size="small"
            value={convenio}
            helperText={errors.convenio?.message}
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
            {...register("operacao")}
            error={Boolean(errors.operacao)}
            select
            fullWidth
            label="Operação"
            size="small"
            value={operacao}
            helperText={errors.operacao?.message}
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
            {...register("banco")}
            error={Boolean(errors.banco)}
            select
            fullWidth
            label="Banco"
            size="small"
            value={banco}
            helperText={errors.banco?.message}
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
            control={control}
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

          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_contrato?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={qt_parcelas}
            setValue={setQtParcelas}
            label="Quantidade de parcelas"
            placeholder="Insira a quantidade de parcelas"
            validateFieldName="qt_parcelas"
            onlyNumbers
            inputProps={{ maxLength: 5 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          {/* <Controller
            name="vl_parcela"
            control={control}
            defaultValue=""
            render={({ field }) => ( */}
          <NumericFormat
            // {...field}
            value={vl_parcela}
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="R$ "
            onValueChange={(values) => {
              setVlParcela(values?.floatValue);
            }}
            // error={Boolean(errors.vl_parcela)}
            size="small"
            label="Valor da parcela"
            placeholder="R$ 0,00"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 16 }}
          />
          {/* )}
          /> */}

          {/* <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_parcela?.message}
          </Typography> */}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="dt_pag_cliente"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatepickerFieldWithValidation
                label="Data de pagamento ao cliente"
                value={dt_pag_cliente}
                onChange={(newDate) => {
                  field.onChange(newDate);
                  setDtPagCliente(newDate);
                }}
                error={error}
                helperText={error?.message}
              />
            )}
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
          {/* <Controller
            name="porcentagem"
            control={control}
            defaultValue=""
            render={({ field }) => ( */}
          <NumericFormat
            // {...field}
            customInput={TextField}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator=","
            isNumericString
            suffix="%"
            value={porcentagem}
            allowEmptyFormatting
            onValueChange={(values) => {
              setPorcentagem(values?.floatValue);
            }}
            //Aqui pra baixo textfield
            // error={Boolean(errors.porcentagem)}
            size="small"
            label="(%) Porcentagem"
            placeholder="% de juros"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 16 }}
          />
          {/* )}
          />
          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.porcentagem?.message}
          </Typography> */}
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
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            {...register("corretor")}
            error={Boolean(errors.corretor)}
            select
            fullWidth
            label="Corretor(a)"
            size="small"
            value={corretor}
            helperText={errors.corretor?.message}
            onChange={(e) => {
              setCorretor(e.target.value);
            }}
          >
            {corretorPicklist?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={tabela}
            setValue={setTabela}
            label="Tabela"
            placeholder="Insira o nome da tabela"
            // validateFieldName="tabela"
            // control={control}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <FormControl component="fieldset" error={Boolean(errors.iletrado)}>
            <FormLabel component="legend">Iletrado</FormLabel>
            <Controller
              name="iletrado"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  value={iletrado}
                  error={Boolean(errors.iletrado)}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value == "true") {
                      setIletrado(true);
                    } else if (e.target.value == "false") {
                      setIletrado(false);
                    }
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sim"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
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

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
                  value={tipoContrato}
                  onChange={(e) => {
                    field.onChange(e);
                    setTipoContrato(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="fisico"
                    control={<Radio />}
                    label="Físico"
                  />
                  <FormControlLabel
                    value="digital"
                    control={<Radio />}
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

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
                  value={documentoSalvo}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value == "true") {
                      setDocumentoSalvo(true);
                    } else if (e.target.value == "false") {
                      setDocumentoSalvo(false);
                    }
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sim"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
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

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <FormControl
            component="fieldset"
            error={Boolean(errors.representante_legal)}
          >
            <FormLabel component="legend">Representante legal?</FormLabel>
            <Controller
              name="representante_legal"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  value={representanteLegal?.toString()}
                  error={Boolean(errors.representante_legal)}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value == "true") {
                      setRepresentanteLegal(true);
                    } else if (e.target.value == "false") {
                      setRepresentanteLegal(false);
                    }
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sim"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Não"
                  />
                </RadioGroup>
              )}
            />
            {errors.representante_legal && (
              <FormHelperText>
                {errors.representante_legal.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {id && session?.user?.is_superuser && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                    value={statusComissao}
                    onChange={(e) => {
                      field.onChange(e);
                      setStatusComissao(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="paga"
                      control={<Radio />}
                      label="Paga"
                    />
                    <FormControlLabel
                      value="aguardando_pagamento"
                      control={<Radio />}
                      label="Aguardando pagamento"
                    />
                    <FormControlLabel
                      value="aguardando_fisco"
                      control={<Radio />}
                      label="Aguardando fisco"
                    />

                    <FormControlLabel
                      value="analise_financeira"
                      control={<Radio />}
                      label="Análise financeira"
                    />
                  </RadioGroup>
                )}
              />
              {errors.status_comissao && (
                <FormHelperText>
                  {errors.status_comissao.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

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

        {id && session?.user?.is_superuser && (
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
            <LoadingButton
              variant="outlined"
              endIcon={<FileUploadIcon />}
              disableElevation
              fullWidth
              onClick={() => {
                const payload = getPayloadUpdate(
                  id,
                  session?.user?.is_superuser
                );
                setOpenDialogSendPreContrato(true);
                setPreContratoToSendContratos(payload);
              }}
            >
              TRANSMITIR
            </LoadingButton>
          </Grid>
        )}
      </Grid>

      <DialogTransmitirPreContrato
        open={openDialogSendPreContrato}
        close={setOpenDialogSendPreContrato}
        preContrato={preContratoToSendContratos}
        clearPreContrato={setPreContratoToSendContratos}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
        id={id}
      />
    </ContentWrapper>
  );
}

function DialogTransmitirPreContrato({
  open,
  close,
  preContrato,
  clearPreContrato,
  token,
  onFinishDelete,
  id,
}) {
  const [loading, setLoading] = useState(false);

  async function sendPreContrato(data) {
    const payload = {
      id: id,
      promotora: data.promotora,
      dt_digitacao: data.dt_digitacao ? data.dt_digitacao : null,
      nr_contrato: data.nr_contrato,
      no_cliente: data.no_cliente,
      cpf: data.cpf,
      convenio: data.convenio,
      operacao: data.operacao,
      banco: data.banco,
      vl_contrato: data.vl_contrato,
      qt_parcelas: data.qt_parcelas,
      vl_parcela: data.vl_parcela,
      dt_pag_cliente: data.dt_pag_cliente ? data.dt_pag_cliente : null,
      porcentagem: data.porcentagem ? data.porcentagem : null,
      corretor: data.corretor,
      tabela: data.tabela,
      tipo_contrato: data.tipo_contrato,
      status_comissao: data.status_comissao ? data.status_comissao : null,
      iletrado: data.iletrado,
      documento_salvo: data.documento_salvo,
      representante_legal: data.representante_legal,
      dt_pag_comissao: data.dt_pag_comissao,
      vl_comissao: data.vl_comissao ? data.vl_comissao : null,
      id_pre_contrato: data.id_pre_contrato,
    };

    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/pre-contratos`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        toast.error("Pré contrato já foi transmitido aos contratos");
        onFinishDelete();
      }

      if (response.ok) {
        setLoading(false);
        toast.success("Enviado com sucesso");
        onFinishDelete();
      }
    } catch (error) {
      console.log(error);
      toast.success("Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ fontWeight: 700, mb: 1, strong: { color: "red" } }}
      >
        <strong>ATENÇÃO!</strong> Verifique se salvou todos os dados antes de
        transferir o pré-contrato, deseja continuar?
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={() => {
            close(false);
            clearPreContrato("");
          }}
          color="error"
        >
          CANCELAR
        </Button>

        <LoadingButton
          onClick={() => {
            sendPreContrato(preContrato);
          }}
          color="success"
          variant="contained"
          disableElevation
          loading={loading}
        >
          ENVIAR
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
