"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";
import type { ChartDatum } from "../../types/dashboard.types";

type LineSeries = {
  dataKey: string;
  name: string;
  color: string;
};

type LineChartProps<T extends ChartDatum> = {
  data: T[];
  xKey: string;
  lines: LineSeries[];
  height?: number;
  valueFormatter?: (value: number) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customTooltip?: (props: any) => ReactNode;
};

export function LineChart<T extends ChartDatum>({
  data,
  xKey,
  lines,
  height = 320,
  valueFormatter = (value) => `${value}`,
  customTooltip,
}: LineChartProps<T>) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey={xKey}
            stroke="#a1a1aa"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#a1a1aa"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 3]}
            ticks={[0, 1, 3]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 16,
            }}
            formatter={(value) => (typeof value === "number" ? valueFormatter(value) : String(value ?? ""))}
            {...(customTooltip ? { content: customTooltip } : {})}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          ))}
          <Legend />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
