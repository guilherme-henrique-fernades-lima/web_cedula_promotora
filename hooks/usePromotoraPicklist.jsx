import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function usePromotoraPicklist() {
  const { data: session } = useSession();
  const [promotoraPicklist, setPromotoraPicklist] = useState([]);
  const [loadingPromotoraPicklist, setLoadingPromotoraPicklist] =
    useState(true);

  useEffect(() => {
    if (session?.user?.token) {
      getPicklistData();
    }
  }, [session?.user?.token]);

  async function getPicklistData() {
    setLoadingPromotoraPicklist(true);
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/promotoras/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setPromotoraPicklist(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPromotoraPicklist(false);
    }
  }

  return { promotoraPicklist, loadingPromotoraPicklist };
}
