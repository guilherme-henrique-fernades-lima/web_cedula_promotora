//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";

export default function RelatorioPreContratos() {
  const { data: session } = useSession();

  return (
    <ContentWrapper title="Relação de pré contratos">
      <Toaster position="bottom-center" reverseOrder={true} />
    </ContentWrapper>
  );
}
