import React, { useState, useEffect } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import LoadingButton from "@mui/lab/LoadingButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";

//Icons
import LockPersonIcon from "@mui/icons-material/LockPerson";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SaveIcon from "@mui/icons-material/Save";

//Rotas da aplicacao
import { ROUTES } from "@/helpers/routes";

export default function Usuarios() {
  const { data: session } = useSession();

  const [dataset, setDataset] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetailsUser, setOpenDetailsUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [userSelected, setUserSelected] = useState({
    user_id: "",
    is_active: "",
  });

  const [permissions, setPermissions] = useState({});
  console.log("userSelected: ", userSelected);
  console.log("permissions: ", permissions);

  const handleModal = () => setOpen((open) => !open);

  const handleModalDetailsUser = (user) => {
    setUserSelected({ user_id: user.id, is_active: user.is_active });
    if (openDetailsUser == true) {
      setPermissions({});
      setUserSelected("");
    }
    setOpenDetailsUser((openDetailsUser) => !openDetailsUser);
  };

  useEffect(() => {
    if (session?.user?.token) {
      getAllData();
    }
  }, [session?.user]);

  function getPayload() {
    const payload = {
      username: username,
      email: email,
    };

    return payload;
  }

  async function getAllData() {
    try {
      const response = await fetch("/api/acessos/usuarios", {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function save() {
    try {
      setLoading(true);
      const payload = getPayload();

      const response = await fetch("/api/acessos/usuarios", {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Cadastrado com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
        getAllData();
      } else {
        toast.error("Erro ao cadastrar");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getPayloadPermsUpdate() {
    const payload = {
      user_id: userSelected.user_id,
      is_active: userSelected.is_active,
      permissions: permissions,
    };

    return payload;
  }

  async function updatePerms() {
    try {
      setLoading(true);
      const payload = getPayloadPermsUpdate();
      console.log(payload);

      const response = await fetch("/api/acessos/permissoes/", {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Atualizado com sucesso!");
        //clearStatesAndErrors();
        setLoading(false);
        getAllData();
      } else {
        toast.error("Erro");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function clearStatesAndErrors() {
    setUsername("");
    setEmail("");
    handleModal();
  }

  const handleCheckboxChange = (perm) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [`${perm}`]: !prevPermissions[`${perm}`],
    }));
  };

  return (
    <ContentWrapper title="Controle de usuários">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Button
        variant="contained"
        disableElevation
        endIcon={<PersonAddAltIcon />}
        sx={{ mt: 2 }}
        onClick={handleModal}
      >
        Criar usuário
      </Button>

      <Box sx={{ width: "100%", mt: 2 }}>
        {dataset?.map((item, index) => (
          <CardUser
            key={index}
            user={item}
            handleOpenModalDetailsUser={() => handleModalDetailsUser(item)}
          />
        ))}
      </Box>

      <ModalCreateUser open={openDetailsUser} setOpen={handleModalDetailsUser}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Editar permissões do usuário
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Ativo/Inativo"
          />
        </FormGroup>

        {ROUTES?.map((route) => (
          <React.Fragment key={route.id}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>
              {route.title}
            </Typography>
            <Box
              sx={{ borderTop: "1px solid #ccc", width: "100%", mb: 1, mt: -1 }}
            />

            <FormGroup>
              {route?.routes?.map((url) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[`${url.perm}`] || false}
                      onChange={() => handleCheckboxChange(url.perm)}
                    />
                  }
                  label={url.title}
                  key={url.id}
                />
              ))}
            </FormGroup>
          </React.Fragment>
        ))}

        <Button
          disableElevation
          variant="contained"
          endIcon={<SaveIcon />}
          fullWidth
          sx={{ mt: 2 }}
          onClick={updatePerms}
        >
          Salvar
        </Button>
      </ModalCreateUser>

      <ModalCreateUser open={open} setOpen={setOpen}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Cadastrar novo usuário
        </Typography>
        <CustomTextField
          value={username}
          setValue={setUsername}
          label="Nome de usuário"
          // numbersNotAllowed
          //helperText="O nome de usuário é obrigatório"
          placeholder="Insira o nome"
          //validateFieldName={}
          //errorFlag={}
          //maskFieldFlag={}
        />

        <Box sx={{ mt: 2 }} />

        <CustomTextField
          value={email}
          setValue={setEmail}
          label="E-mail"
          //helperText="O nome de usuário é obrigatório"
          placeholder="Insira o e-mail do usuário"
          //validateFieldName={}
          //errorFlag={}
          //maskFieldFlag={}
        />

        <LoadingButton
          disableElevation
          variant="contained"
          endIcon={<PersonAddAltIcon />}
          fullWidth
          sx={{ mt: 2 }}
          loading={loading}
          onClick={save}
        >
          Criar usuário
        </LoadingButton>
      </ModalCreateUser>
    </ContentWrapper>
  );
}

function CardUser({ user, handleOpenModalDetailsUser }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        height: 70,
        backgroundColor: "#f6f6f6",
        mt: 1,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "column",
          ml: 2,
        }}
      >
        <Typography
          variant="span"
          sx={{
            color: "#242424",
            fontFamily: "Lato, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Email: {user?.email}
        </Typography>
        <Typography
          variant="span"
          sx={{
            color: "#242424",
            fontFamily: "Lato, sans-serif",
            fontSize: "16px",
          }}
        >
          Nome: {user?.username}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          mr: 2,
        }}
      >
        <Tooltip title="Editar permissões" placement="top">
          <IconButton onClick={handleOpenModalDetailsUser}>
            <LockPersonIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

function ModalCreateUser({ open, setOpen, children }) {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 420,
            //height: "100%",
            maxHeight: 420,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
}
