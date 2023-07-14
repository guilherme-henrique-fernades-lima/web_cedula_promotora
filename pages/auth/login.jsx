import React, { useState, useEffect } from "react";

//Third party libraries
import Lottie from "react-lottie";
import InputMask from "react-input-mask";

//Context
// import { getCookiesServerSide } from "@/helpers/handleCookies";

//Mui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

//Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//Lottie animation
import LottieAnimation from "../../public/lotties/authenticate.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: LottieAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AuthAnimation() {
  const [isStopped] = useState(false);
  const [isPaused] = useState(false);

  return (
    <Lottie
      options={defaultOptions}
      height={200}
      width={200}
      isStopped={isStopped}
      isPaused={isPaused}
      isClickToPauseDisabled={true}
    />
  );
}

export default function SingIn() {
  //const { login, error } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [lembrarCpf, setLembrarCpf] = useState(false);

  useEffect(() => {
    getCpfLocalStorage();
  }, []);

  const getCpfLocalStorage = () => {
    const cpf = localStorage.getItem("@acaihomedelivery");

    if (cpf) {
      setLembrarCpf(true);
      setCpf(JSON.parse(cpf));
    }
  };

  function handleSaveCpfLocalStorage() {
    if (lembrarCpf) {
      localStorage.removeItem("@acaihomedelivery");
      setLembrarCpf(false);
    } else {
      setLembrarCpf(true);
    }
  }

  function salvarCpfLocalStorage() {
    localStorage.setItem("@acaihomedelivery", JSON.stringify(cpf));
  }

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleCPFform = (event) => {
    setCpf(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    //login(JSON.stringify({ cpf: cpf, password: password }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "green",
          width: "100%",
          height: "100vh",
          flexGrow: 1,
          background: "#000046",
          background:
            "linear-gradient(45deg, rgba(0, 0, 70, 0.9), rgba(28, 181, 224, 0.9)), url(/img/background_login_page.jpg) center center/cover no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            maxWidth: 430,
            height: 550,
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",

            ["@media (max-width:600px)"]: {
              maxWidth: "100%",
              height: "100%",
              width: "100%",
              borderRadius: 0,
              justifyContent: "center",
              backgroundColor: "transparent",
            },
          }}
        >
          <AuthAnimation />

          <InputMask
            // {...register("cpf")}
            // error={Boolean(errors.cpf)}
            mask="999.999.999-99"
            maskChar={null}
            value={cpf}
            onChange={handleCPFform}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                label="Insira o CPF"
                placeholder="000.000.000-000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                sx={{ width: 280, mt: 1 }}
              />
            )}
          </InputMask>

          <TextField
            value={password}
            onChange={handlePassword}
            //error={Boolean(error)}
            placeholder="Senha"
            sx={{
              marginTop: "20px",
              fontSize: 12,
              width: 280,
            }}
            size="small"
            type={showPassword ? "text" : "password"}
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

          {/* {error && (
            <Typography
              sx={{
                fontSize: 10,
                color: "red",
                fontWeight: "bold",
                mt: 1,
              }}
            >
              * {error.message}
            </Typography>
          )} */}

          <Box
            sx={{
              width: 280,
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
                      color: "#fff",
                      "&.Mui-checked": {
                        color: "#fff",
                      },
                      ["@media (min-width:601px)"]: {
                        color: "#5353c9",
                        "&.Mui-checked": {
                          color: "#5353c9",
                        },
                      },
                    }}
                    checked={lembrarCpf}
                    onChange={handleSaveCpfLocalStorage}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 10,
                      color: "#fff",
                      ["@media (min-width:601px)"]: {
                        color: "#5353c9",
                      },
                    }}
                  >
                    Lembrar CPF?
                  </Typography>
                }
              />
            </FormGroup>

            {/* <Typography
              sx={{
                fontSize: 10,
                color: "#B83E94",
                fontWeight: "bold",
                width: "100%",
                textAlign: "right",
                "&:hover": { cursor: "pointer", textDecoration: "underline" },

                ["@media (max-width:600px)"]: {
                  color: "#fff",
                },
              }}
              onClick={handleDialog}
            >
              Esqueci minha senha
            </Typography> */}
          </Box>

          <Button
            variant="contained"
            disableElevation
            sx={{ width: 280, marginTop: "30px" }}
            onClick={() => {
              if (lembrarCpf) {
                salvarCpfLocalStorage();
              }
              handleLogin();
            }}
          >
            ACESSAR
          </Button>
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ margin: "10px" }}
      >
        <DialogTitle id="alert-dialog-title">
          Para alteração de senha, contate a administração.
        </DialogTitle>
      </Dialog>
    </>
  );
}

// export const getServerSideProps = ({ req, res }) => {
//   const token = getCookiesServerSide("@acai:user", { req, res });

//   if (token) {
//     return {
//       redirect: {
//         permanent: true,
//         destination: "/home",
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
