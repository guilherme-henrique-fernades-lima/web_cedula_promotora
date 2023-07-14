import React, { useState, useEffect } from "react";

//Third party libraries
import Lottie from "react-lottie";
import { signIn } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

//Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

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
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarEmail, setLembrarEmail] = useState(false);

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: email,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });
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
            "linear-gradient(45deg, rgba(0, 0, 70, 0.9), rgba(28, 181, 224, 0.8)), url(/img/background_login_page.jpg) center center/cover no-repeat",
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
            borderRadius: "4px",
            padding: "20px",
            boxShadow: "rgb(0, 0, 0) 0px 20px 30px -10px",

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
          <AuthAnimation />

          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            label="Insira o e-mail"
            placeholder="seu-email@email.com"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            sx={{ width: 280, mt: 1 }}
          />

          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                      color: "#5353c9",
                      "&.Mui-checked": {
                        color: "#5353c9",
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
                      color: "#5353c9",
                    }}
                  >
                    Lembrar e-mail?
                  </Typography>
                }
              />
            </FormGroup>
          </Box>

          <Button
            variant="contained"
            disableElevation
            sx={{ width: 280, marginTop: "30px" }}
            onClick={() => {
              if (lembrarEmail) {
                salvarEmailLocalStorage();
              }
              onSubmit();
            }}
            endIcon={<LoginIcon />}
          >
            LOGIN
          </Button>
        </Box>
      </Box>
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
