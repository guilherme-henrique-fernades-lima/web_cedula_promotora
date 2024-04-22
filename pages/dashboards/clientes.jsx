import { useState, useEffect, useMemo, useCallback } from "react";

import { useSession } from "next-auth/react";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import GridGraph from "@/components/GridGraphWrapper";

//Mui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

//Dashboards
import DashClientesEspecie from "@/components/dashboards/clientes/DashClientesEspecie";

export default function DashboardClientesEspecie() {
  const { data: session } = useSession();

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (session?.user?.token) {
      getClientes();
    }
  }, [session?.user?.token]);

  const getClientes = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboards/clientes/`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      const json = await response.json();
      setClientes(json);
    } catch (error) {
      console.error("Erro ao obter contratos:", error);
    }
  }, [session?.user?.token]);

  const dataArrayClientesEspecies = useMemo(() => {
    return clientes?.indicadores?.especies?.map((row, index) => ({
      id: index,
      name: row.especie,
      qtd: row.qtd,
      perc_qtd: row.perc_qtd,
    }));
  }, [clientes?.indicadores?.especies]);

  return (
    <ContentWrapper title="Dashboard de clientes">
      <Grid container sx={{ width: "100%", mt: 2 }}>
        {dataArrayClientesEspecies?.length > 0 ? (
          <>
            <GridGraph
              title="Total de clientes"
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              size={100}
            >
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  color: "#292929",
                }}
              >
                {clientes?.indicadores?.especies?.length > 0
                  ? clientes?.indicadores?.tt_especies?.total
                  : 0}
              </Typography>
            </GridGraph>

            <GridGraph
              title="Clientes sem tipo de espécie"
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              size={100}
            >
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  color: "#292929",
                }}
              >
                {clientes?.indicadores?.especies?.length > 0
                  ? clientes?.indicadores?.tt_especies?.sem_especie
                  : 0}
              </Typography>
            </GridGraph>

            <GridGraph
              title="Clientes"
              helperText="Quantidade total de clientes classificados por espécie"
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              size={2200}
            >
              <DashClientesEspecie data={dataArrayClientesEspecies} label />
            </GridGraph>
          </>
        ) : (
          <GridGraph xs={12} sm={12} md={12} lg={12} xl={12} size={360}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          </GridGraph>
        )}
      </Grid>
    </ContentWrapper>
  );
}
