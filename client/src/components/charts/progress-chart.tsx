import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressMetrics } from "@/lib/types";
import { getProgressChartData } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface ProgressChartProps {
  metrics: ProgressMetrics[];
  className?: string;
}

export function ProgressChart({ metrics, className }: ProgressChartProps) {
  const [activeMetric, setActiveMetric] = useState("weight");
  const chartData = getProgressChartData(metrics);
  
  const getYAxisDomain = () => {
    if (activeMetric === "weight") {
      const weights = metrics.map(m => m.weight).filter(Boolean) as number[];
      if (weights.length === 0) return [0, 0];
      const min = Math.min(...weights) - 5;
      const max = Math.max(...weights) + 5;
      return [min, max];
    }
    if (activeMetric === "bodyFat") {
      const bodyFats = metrics.map(m => m.bodyFat).filter(Boolean) as number[];
      if (bodyFats.length === 0) return [0, 0];
      const min = Math.min(...bodyFats) - 2;
      const max = Math.max(...bodyFats) + 2;
      return [min, max];
    }
    
    return ["auto", "auto"];
  };
  
  const metricOptions = [
    { value: "weight", label: "Weight", color: "#3B82F6" },
    { value: "bodyFat", label: "Body Fat %", color: "#F59E0B" },
    { value: "chest", label: "Chest", color: "#10B981" },
    { value: "waist", label: "Waist", color: "#8B5CF6" },
    { value: "arms", label: "Arms", color: "#EF4444" },
  ];
  
  const currentOption = metricOptions.find(o => o.value === activeMetric) || metricOptions[0];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
        <Tabs defaultValue="weight" onValueChange={setActiveMetric}>
          <TabsList>
            {metricOptions.map(option => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available. Add your metrics to see progress.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={getYAxisDomain()} />
              <Tooltip formatter={(value) => [`${value} ${activeMetric === 'bodyFat' ? '%' : 'lbs'}`, currentOption.label]} />
              <Legend />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={currentOption.color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
