import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/lib/types";

interface MetricsCardProps {
  profile: UserProfile;
}

export function MetricsCard({ profile }: MetricsCardProps) {
  return (
    <Card className="bg-white mt-8">
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsSection
            title="Body Measurements"
            metrics={[
              { label: "Body Fat", value: profile.bodyFat ? `${profile.bodyFat}%` : "Not set" },
              { label: "BMI", value: profile.bmi || "Not set" },
              { label: "Resting Heart Rate", value: profile.restingHeartRate ? `${profile.restingHeartRate} bpm` : "Not set" },
            ]}
          />
          
          <MetricsSection
            title="Fitness Performance"
            metrics={[
              { label: "Max Bench Press", value: profile.maxBenchPress ? `${profile.maxBenchPress} lbs` : "Not set" },
              { label: "Max Squat", value: profile.maxSquat ? `${profile.maxSquat} lbs` : "Not set" },
              { label: "1 Mile Run", value: profile.mileTime ? `${formatRunTime(profile.mileTime)}` : "Not set" },
            ]}
          />
          
          <MetricsSection
            title="Nutrition"
            metrics={[
              { label: "Daily Calories", value: profile.dailyCalories ? `${profile.dailyCalories} kcal` : "Not set" },
              { label: "Protein Goal", value: profile.proteinGoal ? `${profile.proteinGoal}g` : "Not set" },
              { label: "Water Intake", value: profile.waterIntake ? `${(profile.waterIntake / 1000).toFixed(1)}L` : "Not set" },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsSectionProps {
  title: string;
  metrics: { label: string; value: string | number }[];
}

function MetricsSection({ title, metrics }: MetricsSectionProps) {
  return (
    <div>
      <h3 className="text-gray-500 font-medium mb-2">{title}</h3>
      <ul className="space-y-3">
        {metrics.map((metric, index) => (
          <li key={index} className="flex justify-between">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <span className="font-medium">{metric.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatRunTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
}
