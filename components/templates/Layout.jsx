import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

//Third party libraries
import { useSession, signOut } from "next-auth/react";

//Mui components
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";

//Icons
import SubjectIcon from "@mui/icons-material/Subject";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ExpandLess from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openDropdownRelatorios, setOpenDropdownRelatorios] = useState(false);
  const [openDropdownCadastros, setOpenDropdownCadastros] = useState(false);

  const [activeOption, setActiveOption] = useState("");

  // useEffect(() => {
  //   if (!session?.user) {
  //     router.push("/auth/login");
  //   }
  // }, [session?.user]);

  const handleDrawerCloseOpen = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    const data = await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <>
      <CssBaseline />

      {session?.user ? (
        <Box sx={{ display: "flex" }}>
          <AppBar position="fixed" open={open} elevation={0}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerCloseOpen}
                edge="start"
                sx={{ mr: 2 }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 14, sm: 14, md: 16, lg: 16, xl: 18 },
                }}
              >
                CÉDULA PROMOTORA
              </Typography>
            </Toolbar>
            <IconButton onClick={handleLogout} sx={{ mr: 2 }}>
              <LogoutIcon sx={{ color: "#fff" }} />
            </IconButton>
          </AppBar>
          <Drawer
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader></DrawerHeader>
            <Divider />
            <List>
              <ListItem
                disablePadding
                onClick={() => {
                  setOpenDropdownCadastros(!openDropdownCadastros);
                  setOpenDropdownRelatorios(false);
                  setActiveOption("cadastros");
                }}
                sx={{
                  transition: "all 0.3s ease",
                  backgroundColor:
                    activeOption == "cadastros" ? "#e6e6e6" : "transparent",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={<TitleTypography>Cadastros</TitleTypography>}
                  />
                  <ExpandLess
                    sx={{
                      fontSize: "20px",
                      transition: "all 0.3s ease",
                      transform: `${
                        openDropdownCadastros ? "rotate(0)" : "rotate(180deg)"
                      }`,
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <Collapse in={openDropdownCadastros} timeout="auto" unmountOnExit>
                <List component="nav" disablePadding>
                  <Link href="/cadastros/cliente">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<TitleTypography>Cliente</TitleTypography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link href="/cadastros/contrato">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<TitleTypography>Contrato</TitleTypography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link href="/cadastros/despesa">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<TitleTypography>Despesa</TitleTypography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link href="/cadastros/emprestimo">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <TitleTypography>Empréstimo</TitleTypography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </List>
              </Collapse>

              <ListItem
                disablePadding
                onClick={() => {
                  setOpenDropdownRelatorios(!openDropdownRelatorios);
                  setOpenDropdownCadastros(false);
                  setActiveOption("relatorios");
                }}
                sx={{
                  backgroundColor:
                    activeOption == "relatorios" ? "#e6e6e6" : "transparent",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <SubjectIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={<TitleTypography>Relatórios</TitleTypography>}
                  />
                  <ExpandLess
                    sx={{
                      fontSize: "20px",
                      transition: "all 0.3s ease",
                      transform: `${
                        openDropdownRelatorios ? "rotate(0)" : "rotate(180deg)"
                      }`,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <Collapse
                in={openDropdownRelatorios}
                timeout="auto"
                unmountOnExit
              >
                <List component="nav" disablePadding>
                  <Link href="/relatorios/clientes">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<TitleTypography>Clientes</TitleTypography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link href="/relatorios/contratos">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<TitleTypography>Contratos</TitleTypography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link href="/relatorios/despesas">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<TitleTypography>Despesas</TitleTypography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link href="/relatorios/emprestimos">
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ pl: 3 }}>
                          <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <TitleTypography>Empréstimos</TitleTypography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </List>
              </Collapse>
            </List>
            {/* <Divider /> */}
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            {children}
          </Main>
        </Box>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

const DRAWER_WIDTH = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    backgroundColor: "#e8e8e8",
    minHeight: "100vh",
    width: "100%",
    padding: theme.spacing(3),

    ["@media (max-width:780px)"]: {
      padding: theme.spacing(1),
    },

    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function TitleTypography({ children }) {
  return (
    <Typography
      variant="span"
      component="span"
      sx={{
        fontWeight: 700,
        fontSize: { xs: 12, sm: 14, md: 14, lg: 16, xl: 16 },
        color: "#212121",
      }}
    >
      {children}
    </Typography>
  );
}
