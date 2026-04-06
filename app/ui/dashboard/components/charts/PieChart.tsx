"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieSegmentDatum } from "../../types/dashboard.types";

type PieChartProps = {
  data: PieSegmentDatum[];
  height?: number;
};

export function PieChart({ data, height = 260 }: PieChartProps) {
  const outerRadius = Math.max(40, Math.min(78, Math.floor(height * 0.3)));
  const innerRadius = Math.max(24, outerRadius - 18);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsPieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 16,
              color: "#fafafa",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} iconSize={10} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
