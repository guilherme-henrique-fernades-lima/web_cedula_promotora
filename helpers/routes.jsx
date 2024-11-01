//Icons
import SubjectIcon from "@mui/icons-material/Subject";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";

const ROUTES = [
  {
    id: 1,
    title: "Acessos",
    routes: [
      {
        id: 1,
        title: "Usuários",
        url: "/acessos/usuarios",
        perm: "app_usuarios",
      },
    ],
    icon: <ManageAccountsIcon />,
    perm: "menu_acessos",
  },
  {
    id: 2,
    title: "Cadastros",
    routes: [
      {
        id: 1,
        title: "Cliente",
        url: "/cadastros/cliente",
        perm: "app_cadastro_cliente",
      },
      {
        id: 2,
        title: "Contrato",
        url: "/cadastros/contrato",
        perm: "app_cadastro_contrato",
      },
      {
        id: 3,
        title: "Despesa",
        url: "/cadastros/despesa",
        perm: "app_cadastro_despesa",
      },
      {
        id: 4,
        title: "Pré-contrato",
        url: "/cadastros/pre-contrato",
        perm: "app_cadastro_pre_contrato",
      },
      {
        id: 5,
        title: "Futuros contratos",
        url: "/cadastros/futuros-contratos",
        perm: "app_cadastro_futuro_contrato",
      },
    ],
    icon: <AddCircleOutlineIcon />,
    perm: "menu_cadastros",
  },
  {
    id: 3,
    title: "Configurações",
    routes: [
      {
        id: 1,
        title: "Bancos",
        url: "/configuracoes/bancos",
        perm: "app_config_bancos",
      },
      {
        id: 2,
        title: "Convênios",
        url: "/configuracoes/convenios",
        perm: "app_config_convenios",
      },
      {
        id: 3,
        title: "Corretores",
        url: "/configuracoes/corretores",
        perm: "app_config_corretores",
      },
      {
        id: 4,
        title: "Lojas",
        url: "/configuracoes/lojas",
        perm: "app_config_lojas",
      },
      {
        id: 5,
        title: "Operações",
        url: "/configuracoes/operacoes",
        perm: "app_config_operacoes",
      },
      {
        id: 6,
        title: "Promotoras",
        url: "/configuracoes/promotoras",
        perm: "app_config_promotoras",
      },
      {
        id: 7,
        title: "Natureza das despesas",
        url: "/configuracoes/natureza-despesas",
        perm: "app_config_natureza_despesas",
      },
      {
        id: 8,
        title: "Canal de aquisição de clientes",
        url: "/configuracoes/canal-aquisicao-clientes",
        perm: "app_config_aquisicao_clientes",
      },
    ],
    icon: <SettingsIcon />,
    perm: "menu_configuracoes",
  },
  {
    id: 4,
    title: "Dashboards",
    routes: [
      {
        id: 1,
        title: "Clientes",
        url: "/dashboards/clientes",
        perm: "app_dash_clientes",
      },
      {
        id: 2,
        title: "Contratos",
        url: "/dashboards/contratos",
        perm: "app_dash_contratos",
      },
      {
        id: 3,
        title: "Despesas",
        url: "/dashboards/despesas",
        perm: "app_dash_despesas",
      },
    ],
    icon: <EqualizerIcon />,
    perm: "menu_dashboards",
  },
  {
    id: 5,
    title: "Relatórios",
    routes: [
      {
        id: 1,
        title: "Clientes master",
        url: "/relatorios/clientes",
        perm: "app_relatorio_clientes",
      },
      {
        id: 2,
        title: "Clientes operadores",
        url: "/relatorios/clientes-operadores",
        perm: "app_relatorio_clientes_dos_operadores",
      },
      {
        id: 3,
        title: "Contratos",
        url: "/relatorios/contratos",
        perm: "app_relatorio_contratos",
      },
      {
        id: 4,
        title: "Despesas",
        url: "/relatorios/despesas",
        perm: "app_relatorio_despesas",
      },
      {
        id: 5,
        title: "Pré-contratos",
        url: "/relatorios/pre-contratos",
        perm: "app_relatorio_pre_contratos",
      },
      {
        id: 6,
        title: "Futuros contratos",
        url: "/relatorios/futuros-contratos",
        perm: "app_relatorio_futuro_contrato",
      },
    ],
    icon: <SubjectIcon />,
    perm: "menu_relatorios",
  },
  // {
  //   id: 6,
  //   title: "Laboratório",
  //   routes: [
  //     {
  //       id: 1,
  //       title: "Teste",
  //       url: "/lab",
  //       perm: "app_relatorio_futuro_contrato",
  //     },
  //   ],
  //   icon: <BiotechRoundedIcon />,
  //   perm: "menu_relatorios",
  // },
];

function permsApps(array) {
  var perms = {};
  for (var i = 0; i < array.length; i = i + 1) {
    for (var j = 0; j < array[i].routes.length; j = j + 1) {
      perms[array[i].routes[j].url] = array[i].routes[j].perm;
    }
  }

  return perms;
}

const rotas = permsApps(ROUTES);

export { ROUTES, rotas };
