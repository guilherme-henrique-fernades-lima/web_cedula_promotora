import SubjectIcon from "@mui/icons-material/Subject";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";

export const ROUTES = [
  {
    id: 1,
    title: "Cadastros",
    routes: [
      { id: 1, title: "Cliente", url: "#", perm: "" },
      { id: 2, title: "Contrato", url: "#", perm: "" },
      { id: 3, title: "Despesa", url: "#", perm: "" },
    ],
    icon: <AddCircleOutlineIcon />,
    perm: "",
  },
  {
    id: 2,
    title: "Configurações",
    routes: [
      { id: 1, title: "Cliente", url: "#", perm: "" },
      { id: 2, title: "Contrato", url: "#", perm: "" },
      { id: 3, title: "Despesa", url: "#", perm: "" },
    ],
    icon: <SettingsIcon />,
    perm: "",
  },
  {
    id: 3,
    title: "Dashboards",
    routes: [
      { id: 1, title: "Cliente", url: "#", perm: "" },
      { id: 2, title: "Contrato", url: "#", perm: "" },
      { id: 3, title: "Despesa", url: "#", perm: "" },
    ],
    icon: <EqualizerIcon />,
    perm: "",
  },
  {
    id: 4,
    title: "Relatórios",
    routes: [
      { id: 1, title: "4", url: "#", perm: "" },
      { id: 2, title: "4", url: "#", perm: "" },
      { id: 3, title: "4", url: "#", perm: "" },
    ],
    icon: <SubjectIcon color="" />,
    perm: "",
  },
];
