/**
 * Chart components with multiple implementation options
 *
 * LineChart - Uses recharts library (feature-rich but may show React warnings)
 * SimpleLineChart - Pure CSS/SVG implementation (lightweight, no external deps)
 */

export { LineChart } from "./line-chart";
export { SimpleLineChart } from "./simple-line-chart";

// Default export is the recharts version
export { LineChart as default } from "./line-chart";
