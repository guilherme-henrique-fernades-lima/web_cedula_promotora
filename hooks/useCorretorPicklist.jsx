import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useCorretorPicklist() {
  const { data: session } = useSession();
  const [corretorPicklist, setCorretorPicklist] = useState([]);
  const [loadingCorretorPicklist, setLoadingCorretorPicklist] = useState(true);

  useEffect(() => {
    if (session?.user?.token) {
      getPicklistData();
    }
  }, [session?.user?.token]);

  async function getPicklistData() {
    setLoadingCorretorPicklist(true);
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/corretores/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setCorretorPicklist(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCorretorPicklist(false);
    }
  }

  return { corretorPicklist, loadingCorretorPicklist };
}
