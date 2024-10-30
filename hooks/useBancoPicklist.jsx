import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useBancoPicklist() {
  const { data: session } = useSession();
  const [bancoPicklist, setBancoPicklist] = useState([]);
  const [loadingBancoPicklist, setLoadingBancoPicklist] = useState(true);

  useEffect(() => {
    if (session?.user?.token) {
      getPicklistData();
    }
  }, [session?.user?.token]);

  async function getPicklistData() {
    setLoadingBancoPicklist(true);
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/bancos/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setBancoPicklist(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBancoPicklist(false);
    }
  }

  return { bancoPicklist, loadingBancoPicklist };
}
