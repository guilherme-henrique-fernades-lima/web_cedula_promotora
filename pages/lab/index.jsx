//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";

import useBancoPicklist from "hooks/useBancoPicklist";

export default function Teste() {
  const { bancoPicklist, loadingBancoPicklist } = useBancoPicklist();

  return (
    <ContentWrapper>
      {loadingBancoPicklist ? (
        <span>Carregando...</span>
      ) : (
        <>
          {bancoPicklist?.map((item) => (
            <span key={item.id}>{item.name}</span>
          ))}
        </>
      )}
    </ContentWrapper>
  );
}
