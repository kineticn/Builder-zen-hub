import React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  month: string;
  amount: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  className?: string;
  color?: string;
  height?: number;
}

/**
 * Simple line chart component using pure CSS and SVG
 * Fallback option that doesn't rely on external charting libraries
 * No defaultProps warnings and lightweight implementation
 */
export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  className,
  color = "#00C2B2",
  height = 256,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center bg-gray-50 rounded-lg",
          className,
        )}
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((d) => d.amount));
  const minAmount = Math.min(...data.map((d) => d.amount));
  const range = maxAmount - minAmount || 1;

  const chartWidth = 400;
  const chartHeight = height - 80; // Leave space for labels
  const padding = 40;

  // Calculate points for the line
  const points = data.map((point, index) => {
    const x =
      padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y =
      padding +
      ((maxAmount - point.amount) / range) * (chartHeight - 2 * padding);
    return { x, y, ...point };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn("w-full", className)} style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 20"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          x={padding}
          y={padding}
          width={chartWidth - 2 * padding}
          height={chartHeight - 2 * padding}
          fill="url(#grid)"
        />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const amount = minAmount + ratio * range;
          const y = padding + (1 - ratio) * (chartHeight - 2 * padding);

          return (
            <g key={index}>
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {formatCurrency(amount)}
              </text>
            </g>
          );
        })}

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
            />

            {/* Tooltip on hover */}
            <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
              <rect
                x={point.x - 30}
                y={point.y - 35}
                width="60"
                height="20"
                rx="4"
                fill="rgba(0, 0, 0, 0.8)"
              />
              <text
                x={point.x}
                y={point.y - 22}
                textAnchor="middle"
                fontSize="10"
                fill="white"
              >
                {formatCurrency(point.amount)}
              </text>
            </g>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={chartHeight + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            {point.month}
          </text>
        ))}
      </svg>
    </div>
  );
};
