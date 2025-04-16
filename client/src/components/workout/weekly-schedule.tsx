import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WeekSchedule } from "@/lib/types";

interface WeeklyScheduleProps {
  schedule: WeekSchedule[];
}

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  return (
    <Card className="bg-white mb-8">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg">This Week's Schedule</CardTitle>
      </CardHeader>
      
      <CardContent className="px-6 py-4 overflow-x-auto">
        <div className="flex space-x-4">
          {schedule.map((day, index) => (
            <DayCard key={index} day={day} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DayCardProps {
  day: WeekSchedule;
}

function DayCard({ day }: DayCardProps) {
  return (
    <div className="flex-shrink-0 w-20 text-center">
      <div className="text-sm text-gray-500">{day.day}</div>
      <div 
        className={cn(
          "rounded-full w-10 h-10 flex items-center justify-center mx-auto my-2",
          day.isRest 
            ? "bg-gray-200 text-gray-600" 
            : "bg-primary text-white"
        )}
      >
        <span className="font-medium">{day.date}</span>
      </div>
      <div className="text-sm font-medium">
        {day.isRest ? "Rest" : day.workout}
      </div>
    </div>
  );
}
