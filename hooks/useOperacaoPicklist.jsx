import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useOperacaoPicklist() {
  const { data: session } = useSession();
  const [operacaoPicklist, setOperacaoPicklist] = useState([]);
  const [loadingOperacaoPicklist, setLoadingOperacaoPicklist] = useState(true);

  useEffect(() => {
    if (session?.user?.token) {
      getPicklistData();
    }
  }, [session?.user?.token]);

  async function getPicklistData() {
    setLoadingOperacaoPicklist(true);
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/operacoes/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setOperacaoPicklist(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingOperacaoPicklist(false);
    }
  }

  return { operacaoPicklist, loadingOperacaoPicklist };
}
