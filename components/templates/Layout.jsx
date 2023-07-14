import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

//Third party libraries
import { useSession, signIn, signOut } from "next-auth/react";

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

//Icons
import SubjectIcon from "@mui/icons-material/Subject";
import GroupsIcon from "@mui/icons-material/Groups";
import GavelIcon from "@mui/icons-material/Gavel";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SavingsIcon from "@mui/icons-material/Savings";
import LogoutIcon from "@mui/icons-material/Logout";

const USER_LOGGED = false;

export default function Layout({ children }) {
  // const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // if (!USER_LOGGED) {
    //   router.push("/auth/login");
    // }
  }, []);

  const [open, setOpen] = useState(false);

  const handleDrawerCloseOpen = () => {
    setOpen(!open);
  };

  // if (session?.user) {
  //   console.log("USUÁRIO LOGADO");
  // } else {
  //   console.log("USUÁRIO NÃO ESTÁ LOGADO");
  // }

  return (
    <>
      <CssBaseline />

      {USER_LOGGED ? (
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
              {/* <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 14, sm: 14, md: 16, lg: 16, xl: 18 },
          }}
        >
          Cédula Promotora
        </Typography> */}
            </Toolbar>
            <IconButton onClick={() => {}} sx={{ mr: 2 }}>
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
              <Link href="/cadastros/cliente">
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <GroupsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={<TitleTypography>Clientes</TitleTypography>}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/relatorios/cobrancas">
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <GavelIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={<TitleTypography>Cobranças</TitleTypography>}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/cadastros/custo-mensal">
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SavingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={<TitleTypography>Custo mensal</TitleTypography>}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link href="/cadastros/emprestimo">
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={<TitleTypography>Empréstimos</TitleTypography>}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
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
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    flexGrow: 1,
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
