/**
 * Traffic Chart Component
 *
 * Line chart component for visualizing network bandwidth (download/upload) over time.
 * Built with SVG for performance and to stay within bundle size constraints.
 *
 * Features:
 * - Responsive SVG rendering with auto-scaling Y-axis
 * - Dual-line display: cyan (download), purple (upload)
 * - Area fill gradients for visual clarity
 * - Current speed summary display
 * - Dashed grid lines
 * - "Sample data" indicator for placeholder mode
 * - Fully responsive viewport
 *
 * @module @nasnet/ui/patterns/traffic-chart
 */

import * as React from 'react';

import { Activity, ArrowDown, ArrowUp, Info, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, cn } from '@nasnet/ui/primitives';

/**
 * Single data point for traffic chart
 *
 * Represents bandwidth at a single point in time
 */
export interface TrafficDataPoint {
  /** Timestamp or time label (e.g., "-1h", "-50m", "now") */
  time: string;
  /** Download speed in Mb/s */
  download: number;
  /** Upload speed in Mb/s */
  upload: number;
}

/**
 * Props for TrafficChart component
 */
export interface TrafficChartProps {
  /** Array of traffic data points to visualize */
  data?: TrafficDataPoint[];
  /** Chart title displayed in card header */
  title?: string;
  /** Whether to display loading skeleton (reserved for future use) */
  isLoading?: boolean;
  /** Show placeholder data and "Sample data" badge when no real data is available */
  showPlaceholder?: boolean;
  /** Height of the chart SVG area in pixels */
  height?: number;
  /** Additional CSS classes for the card wrapper */
  className?: string;
}

// Default placeholder data simulating traffic over last hour
const defaultPlaceholderData: TrafficDataPoint[] = [
  { time: '-1h', download: 45, upload: 12 },
  { time: '-50m', download: 62, upload: 18 },
  { time: '-40m', download: 38, upload: 22 },
  { time: '-30m', download: 78, upload: 35 },
  { time: '-20m', download: 55, upload: 28 },
  { time: '-10m', download: 68, upload: 42 },
  { time: 'now', download: 72, upload: 38 },
];

/**
 * Format bandwidth value to human-readable string
 *
 * Values >= 1000 are displayed as Gb/s, otherwise as Mb/s
 */
const formatBandwidth = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} Gb/s`;
  }
  return `${value} Mb/s`;
};

/**
 * Generate SVG path for line chart
 *
 * Creates a polyline path from data points, scaling to fit the chart dimensions
 */
const generatePath = (
  data: TrafficDataPoint[],
  key: 'download' | 'upload',
  width: number,
  height: number,
  maxValue: number
): string => {
  if (data.length === 0) return '';

  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = height - padding - (point[key] / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
};

/**
 * Generate area fill path for line chart
 *
 * Creates a closed path that forms the area between the line and the baseline
 */
const generateAreaPath = (
  data: TrafficDataPoint[],
  key: 'download' | 'upload',
  width: number,
  height: number,
  maxValue: number
): string => {
  if (data.length === 0) return '';

  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = height - padding - (point[key] / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  const startX = padding;
  const endX = padding + chartWidth;
  const baseline = height - padding;

  return `M ${startX},${baseline} L ${points.join(' L ')} L ${endX},${baseline} Z`;
};

/**
 * TrafficChart Component
 *
 * Displays network traffic visualization with dual download/upload lines and area fills.
 * Auto-scales the Y-axis based on data range and includes current speed summary.
 *
 * @example
 * ```tsx
 * <TrafficChart
 *   data={trafficHistory}
 *   title="WAN Throughput"
 *   height={120}
 * />
 * ```
 */
const TrafficChartInner = React.forwardRef<HTMLDivElement, TrafficChartProps>(
  (
    {
      data,
      title = 'Network Traffic',
      isLoading: _isLoading = false,
      showPlaceholder = true,
      height = 120,
      className,
    },
    ref
  ) => {
    const chartData = data || (showPlaceholder ? defaultPlaceholderData : []);
    const maxValue = React.useMemo(
      () => Math.max(...chartData.flatMap((d) => [d.download, d.upload]), 0.01) * 1.2,
      [chartData]
    );

    // Get current values for display
    const currentDownload = React.useMemo(
      () => (chartData.length > 0 ? chartData[chartData.length - 1].download : 0),
      [chartData]
    );
    const currentUpload = React.useMemo(
      () => (chartData.length > 0 ? chartData[chartData.length - 1].upload : 0),
      [chartData]
    );

    // Chart dimensions
    const chartWidth = 280;
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = React.useState<{
      x: number;
      y: number;
      download: string;
      upload: string;
      time: string;
    } | null>(null);

    const handlePointHover = React.useCallback(
      (index: number, e: React.MouseEvent<SVGRectElement>) => {
        const point = chartData[index];
        if (!point || !svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
          x: rect.left + rect.width / 2 - svgRect.left,
          y: Math.min(
            height - 10 - (point.download / maxValue) * (height - 20),
            height - 10 - (point.upload / maxValue) * (height - 20)
          ) - 8,
          download: formatBandwidth(point.download),
          upload: formatBandwidth(point.upload),
          time: point.time,
        });
      },
      [chartData, maxValue, height]
    );

    return (
      <Card
        ref={ref}
        className={cn('h-full', className)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Activity className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
            {showPlaceholder && !data && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Info className="h-3 w-3" />
                <span>Sample data</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {chartData.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-2 text-muted-foreground"
              style={{ height: `${height + 80}px` }}
            >
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs">Collecting traffic data...</p>
            </div>
          ) : (<>
          {/* Current Stats */}
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="text-success h-4 w-4" />
              <div>
                <p className="text-foreground text-lg font-bold">
                  {formatBandwidth(currentDownload)}
                </p>
                <p className="text-muted-foreground text-xs">Download</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp className="text-primary h-4 w-4" />
              <div className="text-right">
                <p className="text-foreground text-lg font-bold">
                  {formatBandwidth(currentUpload)}
                </p>
                <p className="text-muted-foreground text-xs">Upload</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${chartWidth} ${height}`}
              className="w-full"
              style={{ height: `${height}px` }}
              preserveAspectRatio="none"
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Gradient definitions */}
              <defs>
                <linearGradient
                  id="downloadGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--semantic-color-success-DEFAULT)"
                    stopOpacity="0.35"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--semantic-color-success-DEFAULT)"
                    stopOpacity="0.08"
                  />
                </linearGradient>
                <linearGradient
                  id="uploadGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--semantic-color-primary-DEFAULT)"
                    stopOpacity="0.35"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--semantic-color-primary-DEFAULT)"
                    stopOpacity="0.08"
                  />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((ratio, i) => (
                <line
                  key={i}
                  x1="10"
                  y1={height - 10 - ratio * (height - 20)}
                  x2={chartWidth - 10}
                  y2={height - 10 - ratio * (height - 20)}
                  stroke="var(--semantic-color-border-DEFAULT)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Download area fill */}
              <path
                d={generateAreaPath(chartData, 'download', chartWidth, height, maxValue)}
                fill="url(#downloadGradient)"
                className="transition-all duration-500"
              />

              {/* Upload area fill */}
              <path
                d={generateAreaPath(chartData, 'upload', chartWidth, height, maxValue)}
                fill="url(#uploadGradient)"
                className="transition-all duration-500"
              />

              {/* Download line */}
              <path
                d={generatePath(chartData, 'download', chartWidth, height, maxValue)}
                fill="none"
                stroke="var(--semantic-color-success-DEFAULT)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />

              {/* Upload line */}
              <path
                d={generatePath(chartData, 'upload', chartWidth, height, maxValue)}
                fill="none"
                stroke="var(--semantic-color-primary-DEFAULT)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />

              {/* Data points - Download */}
              {chartData.map((point, index) => {
                const x = 10 + (index / (chartData.length - 1)) * (chartWidth - 20);
                const y = height - 10 - (point.download / maxValue) * (height - 20);
                return (
                  <circle
                    key={`dl-${index}`}
                    cx={x}
                    cy={y}
                    r={tooltip?.time === point.time ? 4 : 3}
                    fill="var(--semantic-color-success-DEFAULT)"
                    className="pointer-events-none transition-all duration-300"
                  />
                );
              })}

              {/* Data points - Upload */}
              {chartData.map((point, index) => {
                const x = 10 + (index / (chartData.length - 1)) * (chartWidth - 20);
                const y = height - 10 - (point.upload / maxValue) * (height - 20);
                return (
                  <circle
                    key={`ul-${index}`}
                    cx={x}
                    cy={y}
                    r={tooltip?.time === point.time ? 4 : 3}
                    fill="var(--semantic-color-primary-DEFAULT)"
                    className="pointer-events-none transition-all duration-300"
                  />
                );
              })}

              {/* Invisible hover columns per data point */}
              {chartData.length > 1 && chartData.map((_, index) => {
                const colWidth = (chartWidth - 20) / (chartData.length - 1);
                const x = 10 + index * colWidth - colWidth / 2;
                return (
                  <rect
                    key={`hover-${index}`}
                    x={Math.max(0, x)}
                    y={0}
                    width={index === 0 || index === chartData.length - 1 ? colWidth / 2 + 10 : colWidth}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={(e) => handlePointHover(index, e)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="bg-popover text-popover-foreground border-border pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border px-3 py-2 shadow-md"
                style={{
                  left: `${(tooltip.x / chartWidth) * 100}%`,
                  top: `${(tooltip.y / height) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <p className="text-muted-foreground mb-1 text-center text-[10px]">{tooltip.time}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-success inline-block h-2 w-2 rounded-full" />
                  <span className="font-medium">↓ {tooltip.download}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-primary inline-block h-2 w-2 rounded-full" />
                  <span className="font-medium">↑ {tooltip.upload}</span>
                </div>
              </div>
            )}

            {/* Time labels */}
            <div className="text-muted-foreground mt-1 flex justify-between text-xs">
              <span>{chartData.length > 0 ? chartData[0].time : ''}</span>
              <span>{chartData.length > 0 ? chartData[chartData.length - 1].time : ''}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="text-muted-foreground mt-3 flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="bg-success h-2 w-2 rounded-full" />
              <span>Download</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-primary h-2 w-2 rounded-full" />
              <span>Upload</span>
            </div>
          </div>
          </>)}
        </CardContent>
      </Card>
    );
  }
);

TrafficChartInner.displayName = 'TrafficChart';

/**
 * TrafficChart - Network traffic visualization component
 */
const TrafficChart = React.memo(TrafficChartInner);
TrafficChart.displayName = 'TrafficChart';

export { TrafficChart };
