import { useState, useEffect } from "react";

//Third party libraries
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
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
import { converterDataParaJS } from "@/helpers/utils";

//Icons
import SaveIcon from "@mui/icons-material/Save";

export default function FuturosContratos() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      retrieveData(id);
    } else {
      clearStatesAndErrors();
    }
  }, [id]);

  const [nomeCliente, setNomeCliente] = useState("");
  const [cpfCliente, setCpfCliente] = useState("");
  const [nomeRepLegal, setNomeRepLegal] = useState("");
  const [cpfRepLegal, setCpfRepLegal] = useState("");
  const [convenio, setConvenio] = useState("");
  const [operacao, setOperacao] = useState("");
  const [banco, setBanco] = useState("");
  const [vl_contrato, setVlContrato] = useState("");
  const [observacao, setObservacao] = useState("");
  const [dtConcessaoBeneficio, setDtConcessaoBeneficio] = useState(null);
  const [dtEfetivacaoBeneficio, setDtEfetivacaoBeneficio] = useState(null);
  const [representanteLegal, setRepresentanteLegal] = useState("");
  const [iletrado, setIletrado] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  // States dos dados dos picklists
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
      nome_cliente: nomeCliente ? nomeCliente : null,
      cpf_cliente: cpfCliente ? cpfCliente : null,
      nome_rep_legal: nomeRepLegal ? nomeRepLegal : null,
      cpf_rep_legal: cpfRepLegal ? cpfRepLegal : null,
      convenio: convenio ? convenio : null,
      operacao: operacao ? operacao : null,
      banco: banco ? banco : null,
      vl_contrato: vl_contrato ? parseFloat(vl_contrato) : null,
      observacoes: observacao ? observacao : null,
      dt_concessao_beneficio: dtConcessaoBeneficio
        ? moment(dtConcessaoBeneficio).format("YYYY-MM-DD")
        : null,
      dt_efetivacao_emprestimo: dtEfetivacaoBeneficio
        ? moment(dtEfetivacaoBeneficio).format("YYYY-MM-DD")
        : null,
      representante_legal: representanteLegal ? representanteLegal : null,
      iletrado: iletrado ? iletrado : null,
      tipo_contrato: tipoContrato ? tipoContrato : null,
    };

    return data;
  }

  async function update() {
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
    console.log(payload);

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
    setNomeCliente("");
    setCpfCliente("");
    setNomeRepLegal("");
    setCpfRepLegal("");
    setConvenio("");
    setOperacao("");
    setBanco("");
    setVlContrato("");
    setObservacao("");
    setDtConcessaoBeneficio(null);
    setDtEfetivacaoBeneficio(null);
    setRepresentanteLegal("");
    setIletrado("");
    setTipoContrato("");
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
    setNomeCliente(data.nome_cliente);
    setCpfCliente(data.cpf_cliente);
    setNomeRepLegal(data.nome_rep_legal);
    setCpfRepLegal(data.cpf_rep_legal);
    setConvenio(data.convenio);
    setOperacao(data.operacao);
    setBanco(data.banco);
    setVlContrato(parseFloat(data.vl_contrato));

    setObservacao(data.observacoes);
    setDtConcessaoBeneficio(
      data.dt_concessao_beneficio
        ? converterDataParaJS(data.dt_concessao_beneficio)
        : null
    );
    setDtEfetivacaoBeneficio(
      data.dt_efetivacao_emprestimo
        ? converterDataParaJS(data.dt_efetivacao_emprestimo)
        : null
    );
    setRepresentanteLegal(data.representante_legal);
    setIletrado(data.iletrado);
    setTipoContrato(data.tipo_contrato);
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

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={nomeCliente}
            setValue={setNomeCliente}
            label="Cliente"
            placeholder="Insira o nome do cliente"
            numbersNotAllowed
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            mask="999.999.999-99"
            maskChar={null}
            value={cpfCliente}
            onChange={(e) => {
              setCpfCliente(e.target.value);
            }}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                size="small"
                fullWidth
                label="CPF cliente"
                placeholder="000.000.000-000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={nomeRepLegal}
            setValue={setNomeRepLegal}
            label="Representante legal"
            placeholder="Insira o nome do representante legal"
            numbersNotAllowed
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            mask="999.999.999-99"
            maskChar={null}
            value={cpfRepLegal}
            onChange={(e) => {
              setCpfRepLegal(e.target.value);
            }}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                size="small"
                fullWidth
                label="CPF representante legal"
                placeholder="000.000.000-000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de concessão do benefício"
            value={dtConcessaoBeneficio}
            onChange={setDtConcessaoBeneficio}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de efetivação do empréstimo"
            value={dtEfetivacaoBeneficio}
            onChange={setDtEfetivacaoBeneficio}
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
          <NumericFormat
            value={vl_contrato}
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="R$ "
            onValueChange={(values) => {
              setVlContrato(parseFloat(values.value));
            }}
            size="small"
            label="Valor do contrato"
            placeholder="R$ 0,00"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 16 }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            multiline
            rows={3}
            size="small"
            label="Observações"
            value={observacao}
            onChange={(e) => {
              setObservacao(e.target.value);
            }}
            placeholder="Insira observações se necessário..."
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Iletrado</FormLabel>

            <RadioGroup
              row
              value={iletrado}
              onChange={(e) => {
                if (e.target.value == "true") {
                  setIletrado(true);
                } else if (e.target.value == "false") {
                  setIletrado(false);
                }
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Tipo de contrato</FormLabel>

            <RadioGroup
              row
              value={tipoContrato}
              onChange={(e) => {
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
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Representante legal?</FormLabel>
            <RadioGroup
              row
              value={representanteLegal?.toString()}
              onChange={(e) => {
                if (e.target.value == "true") {
                  setRepresentanteLegal(true);
                } else if (e.target.value == "false") {
                  setRepresentanteLegal(false);
                }
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LoadingButton
            variant="contained"
            endIcon={<SaveIcon />}
            disableElevation
            loading={loadingButton}
            onClick={() => {
              id ? update() : save();
            }}
          >
            {id ? "SALVAR" : "CADASTRAR"}
          </LoadingButton>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
