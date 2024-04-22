import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

//Mui components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { formatarEspecieInss } from "@/helpers/utils";

export default function DashClientesEspecie({ data, label, aspect }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: "10px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <Stack direction="row" spacing={1}>
            <Typography
              variant="span"
              sx={{
                color: "#242424",
                fontFamily: "Lato, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                mt: 1,
              }}
            >
              {formatarEspecieInss(payload[0]?.payload?.name)}
            </Typography>
          </Stack>

          <Typography
            variant="span"
            sx={{
              color: "#242424",
              fontFamily: "Lato, sans-serif",
              fontSize: "14px",
              mt: 1,
            }}
          >
            Quantidade de clientes: {payload[0].payload.qtd}{" "}
            <strong>
              ({payload[0].payload.perc_qtd}% do total de clientes com essa
              espécie)
            </strong>
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer height="99.8%" width="99.9%" aspect={aspect}>
      <BarChart
        // width={500}
        // height={300}
        data={data}
        barSize={20}
        barGap="10%"
        maxBarSize={20}
        barCategoryGap={20}
        layout="vertical"
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 100,
        }}
      >
        <CartesianGrid strokeDasharray="0" />

        <XAxis type="number" />

        <YAxis
          dataKey="name"
          type="category"
          tickFormatter={formatarEspecieInss}
          style={{
            fontWeight: 400,
            fontSize: 14,
          }}
        />

        <Tooltip content={CustomTooltip} cursor={{ fill: "#ececec" }} />
        <Bar
          dataKey="qtd"
          name="Quantidade"
          fill="#003f86"
          isAnimationActive={false}
        >
          {label && (
            <LabelList
              dataKey="qtd"
              position="right"
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 700,
                fontSize: 14,
              }}
            />
          )}
          {label && (
            <LabelList
              dataKey="percentage"
              position="right"
              offset={45}
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 700,
                fontSize: 14,
              }}
            />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
