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
  ReferenceLine,
} from "recharts";

//Utils
import { formatarReal } from "@/helpers/utils";

//Mui components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function DashDespesas({ label, data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload[0] !== undefined) {
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
            {payload[0].payload.name}
          </Typography>

          <Typography
            variant="span"
            sx={{
              color: "#242424",
              fontFamily: "Lato, sans-serif",
              fontSize: "16px",
              fontSize: "14px",
            }}
          >
            Despesa
          </Typography>

          <Typography
            variant="span"
            sx={{
              color: "#242424",
              fontFamily: "Lato, sans-serif",
              fontSize: "14px",
            }}
          >
            Comissão
          </Typography>

          <Box sx={{ width: "100%", borderTop: "1px solid #ccc" }} />

          <Typography
            variant="span"
            sx={{
              color:
                payload[0]?.payload?.vlr_total >= 0 ? "#35B117" : "#DE1414",
              fontFamily: "Lato, sans-serif",
              fontSize: "14px",
            }}
          >
            Lucro: {formatarReal(payload[0]?.payload?.vlr_total)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer height="100%" width="100%">
      <BarChart
        data={data}
        margin={{
          top: 40,
          right: 10,
          // bottom: 10,
        }}
        stackOffset="wiggle"
      >
        <CartesianGrid strokeDasharray="0" />
        <XAxis
          dataKey="name"
          tick={{
            fontWeight: 400,
            fontSize: 12,
          }}
        />
        <YAxis
          tick={{
            fontWeight: 400,
            fontSize: 12,
          }}
          includeHidden
          padding={{ bottom: 20 }}
        />
        <Tooltip content={CustomTooltip} cursor={{ fill: "#ececec" }} />
        <Bar
          dataKey="vlr_total"
          name="Valor total"
          barSize={20}
          isAnimationActive={false}
        >
          <LabelList
            dataKey={"vlr_total"}
            formatter={formatarReal}
            position="top"
            style={{
              fontWeight: 400,
              fontSize: 10,
            }}
          />
        </Bar>
        <Legend
          iconType="square"
          iconSize="8"
          wrapperStyle={{
            fontFamily: "Lato, sans-serif",
            fontWeight: 400,
            fontSize: 14,
          }}
        />
        <ReferenceLine y={0} stroke="#000" />
      </BarChart>
    </ResponsiveContainer>
  );
}
