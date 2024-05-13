//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";

export default function Usuarios() {
  const { data: session } = useSession();

  return (
    <ContentWrapper title="Controle de usuários">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box sx={{ width: "100%", mt: 3 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
          <CardUser key={index} />
        ))}
      </Box>
    </ContentWrapper>
  );
}

function CardUser() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        height: 70,
        backgroundColor: "#eeeeee",
        mt: 1,
        borderRadius: 2,
      }}
    ></Box>
  );
}
