import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserStats } from "@/lib/types";

interface StatsOverviewProps {
  stats: UserStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Workouts This Week"
        value={stats.workoutsThisWeek}
        change={stats.workoutChange > 0 ? `+${stats.workoutChange} from last week` : null}
        isPositive={stats.workoutChange > 0}
      />
      
      <StatCard
        title="Current Streak"
        value={stats.streak}
        suffix="days"
      />
      
      <StatCard
        title="Calories Burned"
        value={stats.caloriesBurned.toLocaleString()}
        suffix="this week"
      />
      
      <GoalProgressCard 
        progress={stats.goalProgress} 
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  change?: string | null;
  suffix?: string;
  isPositive?: boolean;
}

function StatCard({ title, value, change, suffix, isPositive = true }: StatCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <span className="text-gray-500 text-sm">{title}</span>
        <div className="flex items-end mt-1">
          <span className="text-2xl font-bold">{value}</span>
          {suffix && <span className="text-xs ml-2">{suffix}</span>}
        </div>
        {change && (
          <span className={`text-xs ${isPositive ? 'text-secondary' : 'text-red-500'} ml-2`}>
            {change}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

interface GoalProgressCardProps {
  progress: number;
}

function GoalProgressCard({ progress }: GoalProgressCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <span className="text-gray-500 text-sm">Goal Progress</span>
        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className="bg-[#8B5CF6] h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
