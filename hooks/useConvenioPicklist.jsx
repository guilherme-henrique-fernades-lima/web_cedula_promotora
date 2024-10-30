import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useConvenioPicklist() {
  const { data: session } = useSession();
  const [convenioPicklist, setConvenioPicklist] = useState([]);
  const [loadingConvenioPicklist, setLoadingConvenioPicklist] = useState(true);

  useEffect(() => {
    if (session?.user?.token) {
      getPicklistData();
    }
  }, [session?.user?.token]);

  async function getPicklistData() {
    setConvenioPicklist(true);
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/convenios/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setLoadingConvenioPicklist(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setConvenioPicklist(false);
    }
  }

  return { convenioPicklist, loadingConvenioPicklist };
}
