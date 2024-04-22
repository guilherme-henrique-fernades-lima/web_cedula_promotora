import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { COLORS } from "@/helpers/utils";

//Utils
import { formatarReal } from "@/helpers/utils";

export default function DashPromotoras({ data, label, legend, viewType }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <Box
          sx={{
            backgroundColor: "#000",
            padding: "8px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              background: `${payload[0].payload.fill}`,
              borderRadius: "50%",
              mb: 1,
            }}
          />
          <Typography
            variant="span"
            sx={{
              color: "#fff",
              fontSize: 14,
            }}
          >
            Valor total de contratos:{" "}
            {formatarReal(payload[0].payload.vlr_total)}
          </Typography>
          <Typography
            variant="span"
            sx={{
              color: "#fff",
              fontSize: 14,
            }}
          >
            Quantidade de contratos: {payload[0].payload.qtd}{" "}
            <strong>
              ({payload[0].payload.perc_qtd}% do total de contratos)
            </strong>
          </Typography>
        </Box>
      );
    }
    return null;
  };

  let renderLabel = function (entry) {
    return `${entry.payload.payload.value} - (${(entry?.percent * 100).toFixed(
      2
    )})%`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={260} height={260}>
        <Pie
          outerRadius={90}
          innerRadius={55}
          startAngle={90}
          endAngle={-360}
          dataKey={viewType == "money" ? "vlr_total" : "qtd"}
          legendType="circle"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          label={label && renderLabel}
        >
          {data?.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        {legend && (
          <Legend
            iconType="square"
            iconSize="8"
            wrapperStyle={{
              fontFamily: "Lato, sans-serif",
              fontWeight: 400,
              fontSize: 16,
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
