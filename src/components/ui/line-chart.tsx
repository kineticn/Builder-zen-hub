import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface DataPoint {
  month: string;
  amount: number;
}

interface LineChartProps {
  data: DataPoint[];
  className?: string;
  color?: string;
  strokeWidth?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  className,
  color = "#00C2B2",
  strokeWidth = 2,
}) => {
  return (
    <div className={cn("w-full h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke="#6b7280"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            type="category"
            allowDataOverflow={false}
            allowDecimals={false}
            allowDuplicatedCategory={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke="#6b7280"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => `$${value}`}
            type="number"
            allowDataOverflow={false}
            allowDecimals={true}
            allowDuplicatedCategory={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            labelStyle={{ color: "#374151" }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={{
              fill: color,
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              stroke: color,
              strokeWidth: 2,
              fill: "white",
            }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
