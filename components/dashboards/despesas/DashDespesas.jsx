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
              {payload[0].payload.name}
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
            {/* Valor total: {formatarReal(payload[0].payload.vlr_total)} */}
          </Typography>
          <Typography
            variant="span"
            sx={{
              color: "#242424",
              fontFamily: "Lato, sans-serif",
              fontSize: "14px",
              mt: 1,
            }}
          >
            {/* Quantidade de contratos: {payload[0].payload.qtd}{" "}
            <strong>
              ({payload[0].payload.perc_qtd}% do total de contratos)
            </strong> */}
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
          right: 40,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="0" />
        <XAxis
          dataKey="name"
          tick={{
            fontWeight: 400,
            fontSize: 14,
          }}
        />
        <YAxis
          tick={{
            fontWeight: 400,
            fontSize: 14,
          }}
        />
        <Tooltip content={CustomTooltip} cursor={{ fill: "#ececec" }} />
        <Bar
          dataKey="vlr_total"
          name="Valor total"
          //fill="#003f86"
          barSize={20}
          isAnimationActive={false}
        >
          {label && (
            <LabelList
              dataKey={"pv"}
              formatter={formatarReal}
              position="top"
              style={{
                fontWeight: 400,
                fontSize: 14,
              }}
            />
          )}
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
