import SubjectIcon from "@mui/icons-material/Subject";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const ROUTES = [
  {
    id: 1,
    title: "Acessos",
    routes: [{ id: 1, title: "Usuários", url: "/acessos/usuarios", perm: "" }],
    icon: <ManageAccountsIcon />,
    perm: "",
  },
  {
    id: 2,
    title: "Cadastros",
    routes: [
      { id: 1, title: "Cliente", url: "/cadastros/cliente", perm: "" },
      { id: 2, title: "Contrato", url: "/cadastros/contrato", perm: "" },
      { id: 3, title: "Despesa", url: "/cadastros/despesa", perm: "" },
      {
        id: 4,
        title: "Pré-contrato",
        url: "/cadastros/pre-contrato",
        perm: "",
      },
    ],
    icon: <AddCircleOutlineIcon />,
    perm: "",
  },
  {
    id: 3,
    title: "Configurações",
    routes: [
      { id: 1, title: "Bancos", url: "/configuracoes/bancos", perm: "" },
      { id: 2, title: "Convênios", url: "/configuracoes/convenios", perm: "" },
      {
        id: 3,
        title: "Corretores",
        url: "/configuracoes/corretores",
        perm: "",
      },
      { id: 4, title: "Lojas", url: "/configuracoes/lojas", perm: "" },
      { id: 5, title: "Operações", url: "/configuracoes/operacoes", perm: "" },
      {
        id: 6,
        title: "Promotoras",
        url: "/configuracoes/promotoras",
        perm: "",
      },
    ],
    icon: <SettingsIcon />,
    perm: "",
  },
  {
    id: 4,
    title: "Dashboards",
    routes: [
      { id: 1, title: "Clientes", url: "/dashboards/clientes", perm: "" },
      { id: 2, title: "Contratos", url: "/dashboards/contratos", perm: "" },
      { id: 3, title: "Despesas", url: "/dashboards/despesas", perm: "" },
    ],
    icon: <EqualizerIcon />,
    perm: "",
  },
  {
    id: 5,
    title: "Relatórios",
    routes: [
      { id: 1, title: "Clientes", url: "/relatorios/clientes", perm: "" },
      { id: 2, title: "Contratos", url: "/relatorios/contratos", perm: "" },
      { id: 3, title: "Despesas", url: "/relatorios/despesas", perm: "" },
      {
        id: 4,
        title: "Pré-contratos",
        url: "/relatorios/pre-contratos",
        perm: "",
      },
    ],
    icon: <SubjectIcon />,
    perm: "",
  },
];
