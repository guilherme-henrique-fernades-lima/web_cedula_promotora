import React, { useState, useEffect } from "react";
import Image from "next/image";

import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

//Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

export default function SingIn() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarEmail, setLembrarEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setLoginError(false);

      const result = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        console.log("error: ", result.error);
        setLoginError(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
      setLoginError(true);
    }
  };

  useEffect(() => {
    getEmailLocalStorage();
  }, []);

  const getEmailLocalStorage = () => {
    const email = localStorage.getItem("@app-cedulapromotora");

    if (email) {
      setLembrarEmail(true);
      setEmail(JSON.parse(email));
    }
  };

  function handleSaveEmailLocalStorage() {
    if (lembrarEmail) {
      localStorage.removeItem("@app-cedulapromotora");
      setLembrarEmail(false);
    } else {
      setLembrarEmail(true);
    }
  }

  function salvarEmailLocalStorage() {
    localStorage.setItem("@app-cedulapromotora", JSON.stringify(email));
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (status == "authenticated") {
    router.push("/");
  } else if (status == "unauthenticated") {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "green",
            width: "100%",
            height: "100vh",
            flexGrow: 1,
            background: "#1a3d74",
            background:
              "linear-gradient(95deg, #ec590e, rgba(26, 60, 116, .9)), url(/img/background_login_page.jpg) center center/cover no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "column",
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#fff",
              paddingBottom: 3,
              boxShadow: "rgba(0, 0, 0,0.5) 0px 20px 30px -10px",

              ["@media (max-width:600px)"]: {
                maxWidth: "100%",
                //height: "100%",
                width: "95%",
                borderRadius: 0,
                justifyContent: "center",
                //backgroundColor: "transparent",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 190,
                position: "relative",
                overflow: "hidden",
                mb: 2,
                background: "#ec590e",
                background: "linear-gradient(180deg, #ec590e, #ac410b)",
              }}
            >
              <Image
                src="/img/cedula_logo.png"
                height={160}
                width={160}
                alt="Logo da Cédula Promotora"
                priority
              />
            </Box>

            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "90%",
                flexDirection: "column",
              }}
            >
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                label="Insira o e-mail"
                placeholder="Insira o seu endereço de e-mail"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                sx={{ mt: 1 }}
              />

              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                //error={Boolean(error)}
                label="Senha"
                placeholder="Insira sua senha"
                sx={{
                  marginTop: "20px",
                  fontSize: 12,
                }}
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                InputLabelProps={{ shrink: true }}
                inputProps={{ maxLength: 16 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ cursor: "pointer" }}
                      onClick={handleShowPassword}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon
                          sx={{
                            color: "#B7B7B7",
                            fontSize: 18,
                            "&:hover": { color: "#7a7a7a" },
                          }}
                        />
                      ) : (
                        <VisibilityIcon
                          sx={{
                            color: "#B7B7B7",
                            fontSize: 18,
                            "&:hover": { color: "#7a7a7a" },
                          }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#1a3d74",
                          "&.Mui-checked": {
                            color: "#1a3d74",
                          },
                        }}
                        checked={lembrarEmail}
                        onChange={handleSaveEmailLocalStorage}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          color: "#1a3d74",
                        }}
                      >
                        Lembrar e-mail?
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disableElevation
                sx={{ marginTop: "10px", minHeight: 36.5 }}
                fullWidth
                disabled={loading ? true : false}
                onClick={() => {
                  if (lembrarEmail) {
                    salvarEmailLocalStorage();
                  }
                }}
                endIcon={!loading && <LoginIcon />}
              >
                {loading ? (
                  <CircularProgress sx={{ color: "#fff" }} size={22} />
                ) : (
                  "Acessar"
                )}
              </Button>

              {loginError && (
                <Stack sx={{ width: "100%", mt: 2 }}>
                  <Alert severity="error">Senha ou e-mail incorretos.</Alert>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}
