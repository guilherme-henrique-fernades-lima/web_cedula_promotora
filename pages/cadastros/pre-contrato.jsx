import { useState, useEffect } from "react";
//Third party libraries
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

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerField from "@/components/DatepickerField";

//Utils
import { formatarCPFSemAnonimidade } from "@/helpers/utils";

//Schema
import {
  preContratoSchema,
  updatePreContratoSchemaSuperUser,
} from "@/schemas/preContratoSchema";

//Icons
import SaveIcon from "@mui/icons-material/Save";

export default function CadastrarPreContrato() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    setValue,
    resetField,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      id && session?.user?.is_superuser
        ? updatePreContratoSchemaSuperUser
        : preContratoSchema
    ),
  });

  useEffect(() => {
    if (id) {
      retrievePreContrato(id);
    }
  }, [id]);

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

  //States dos dados dos picklists
  const [convenioPicklist, setConvenioPicklist] = useState([]);
  const [operacaoPicklist, setOperacaoPicklist] = useState([]);
  const [bancoPicklist, setBancoPicklist] = useState([]);
  const [corretorPicklist, setCorretorPicklist] = useState([]);
  const [promotoraPicklist, setPromotoraPicklist] = useState([]);

  useEffect(() => {
    if (session?.user?.token) {
      getConveniosPicklist();
      getOperacoesPicklist();
      getCorretoresPicklist();
      getPromotorasPicklist();
      getBancosPicklist();
    }
  }, [session?.user?.token]);

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
      qt_parcelas: qt_parcelas,
      vl_parcela: parseFloat(vl_parcela),
      dt_pag_cliente: dt_pag_cliente
        ? moment(dt_pag_cliente).format("YYYY-MM-DD")
        : null,
      porcentagem: parseFloat(porcentagem),
      corretor: corretor,
      user_id_created: session?.user?.id,
      iletrado: Boolean(iletrado),
      tipo_contrato: tipoContrato,
      documento_salvo: Boolean(documentoSalvo),
    };

    return data;
  }

  function getPayloadUpdate(id, superuser) {
    if (id && superuser) {
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
        iletrado: Boolean(iletrado),
        tipo_contrato: tipoContrato,
        documento_salvo: Boolean(documentoSalvo),
        status_comissao: statusComissao,
      };
    } else {
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
        iletrado: Boolean(iletrado),
        tipo_contrato: tipoContrato,
        documento_salvo: Boolean(documentoSalvo),
      };
    }

    return data;
  }

  async function updatePreContrato() {
    console.log("Entrou no update");
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
    console.log("Entrou no save");
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
      //clearStatesAndErrors();
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  async function retrievePreContrato(id) {
    const response = await fetch(`/api/cadastros/pre-contrato/?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();
      setDataForEdition(json);
    } else {
      // toast.error("Erro na operação");
    }
  }

  function clearStatesAndErrors() {}

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
  }

  function setDataForEdition(data) {
    setIletrado(data.iletrado);
    setTipoContrato(data.tipo_contrato);
    setDocumentoSalvo(data.documento_salvo);
    setConvenio(data.convenio);
    setOperacao(data.operacao);
    setBanco(data.banco);
    setCorretor(data.corretor);
    setPromotora(data.promotora);
    setDtDigitacao(data.dt_digitacao);
    setDtPagCliente(data.dt_pag_cliente);
    setNrContrato(data.nr_contrato);
    setNoCliente(data.no_cliente);
    setCpf(data.cpf);
    setVlContrato(parseFloat(data.vl_contrato));
    setQtParcelas(data.qt_parcelas);
    setVlParcela(parseFloat(data.vl_parcela));
    setTabela(data.tabela);
    setPorcentagem(data.porcentagem);

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

    if (session?.user?.is_superuser) {
      setStatusComissao(data.status_comissao);
      setValue("status_comissao", data.status_comissao);
    }

    // setStatusComissao(data.statusComissao);
  }

  return (
    <ContentWrapper title="Cadastrar pré-contrato">
      <Toaster position="bottom-center" reverseOrder={true} />

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
          <DatepickerField
            label="Data de digitação"
            value={dt_digitacao}
            onChange={setDtDigitacao}
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
          <CustomTextField
            value={tabela}
            setValue={setTabela}
            label="Tabela"
            placeholder="Insira o nome da tabela"
            validateFieldName="tabela"
            control={control}
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
              setCpf(e.target.value);

              if (e.target.value?.length === 14) {
                getCliente(e.target.value);
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
          <Controller
            name="vl_parcela"
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

          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_parcela?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="porcentagem"
            control={control}
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
          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.porcentagem?.message}
          </Typography>
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

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
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
                    setIletrado(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value={true}
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
                    value={false}
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
            {errors.iletrado && (
              <FormHelperText>{errors.iletrado.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
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
                    label="Físico"
                  />
                  <FormControlLabel
                    value="digital"
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

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
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
                    setDocumentoSalvo(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value={true}
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
                    value={false}
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
