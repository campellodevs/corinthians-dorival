"use client";

import {
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart,
} from "recharts";
import type { ChartDatum } from "../../types/dashboard.types";

type BarSeries = {
  dataKey: string;
  name: string;
  color: string;
};

type BarChartProps<T extends ChartDatum> = {
  data: T[];
  xKey: string;
  bars: BarSeries[];
  layout?: "horizontal" | "vertical";
  height?: number;
  yAxisWidth?: number;
  valueFormatter?: (value: number) => string;
};

export function BarChart<T extends ChartDatum>({
  data,
  xKey,
  bars,
  layout = "horizontal",
  height = 320,
  yAxisWidth = 56,
  valueFormatter = (value) => `${value}`,
}: BarChartProps<T>) {
  const isVertical = layout === "vertical";
  const chartMargin = isVertical
    ? { top: 12, right: 10, bottom: 4, left: 6 }
    : { top: 6, right: 8, bottom: 0, left: 0 };
  const resolvedYAxisWidth = isVertical ? Math.max(120, yAxisWidth) : yAxisWidth;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} layout={layout} barGap={10} margin={chartMargin}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            type={isVertical ? "number" : "category"}
            dataKey={isVertical ? undefined : xKey}
            stroke="#a1a1aa"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type={isVertical ? "category" : "number"}
            dataKey={isVertical ? xKey : undefined}
            stroke="#a1a1aa"
            tickLine={false}
            axisLine={false}
            width={resolvedYAxisWidth}
            interval={0}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 16,
              color: "#fafafa",
            }}
            formatter={(value) => valueFormatter(Number(value ?? 0))}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              radius={[8, 8, 0, 0]}
              maxBarSize={32}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
