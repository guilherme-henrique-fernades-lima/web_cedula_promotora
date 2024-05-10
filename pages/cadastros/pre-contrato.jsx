//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";

export default function CadastrarPreContrato(props) {
  const { data: session } = useSession();

  return (
    <ContentWrapper title="Cadastrar pré-contrato">
      <Toaster position="bottom-center" reverseOrder={true} />
    </ContentWrapper>
  );
}
