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

export default function DashConvenios({ data, label, legend }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <Box
          sx={{
            backgroundColor: "#000",
            padding: "4px 7px 4px 7px",
            borderRadius: "6px",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              background: `${payload[0].payload.fill}`,
              border: "2px solid #fff",
            }}
          />
          <Typography
            variant="span"
            sx={{
              color: "#fff",
              fontFamily: "Lato, sans-serif",
              fontSize: 16,
              marginLeft: "5px",
            }}
          >
            {payload[0].name}: {formatarReal(payload[0].value)}
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
          dataKey="vlr_total"
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
