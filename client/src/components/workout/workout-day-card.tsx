import { Card } from "@/components/ui/card";

interface WorkoutDayProps {
  day: {
    day: string;
    focus: string;
    exercises: {
      name: string;
      sets: string;
      reps: string;
      notes?: string;
    }[];
  };
}

export function WorkoutDayCard({ day }: WorkoutDayProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary text-white px-4 py-3">
        <h3 className="font-medium">{day.day}</h3>
        <p className="text-sm opacity-90">{day.focus}</p>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {day.exercises.map((exercise, index) => (
            <li key={index} className="flex items-start text-sm">
              <i className="fas fa-check-circle text-secondary mt-0.5 mr-2"></i>
              <div>
                <span className="font-medium">{exercise.name}</span>
                <span className="text-gray-600"> - {exercise.sets} x {exercise.reps}</span>
                {exercise.notes && (
                  <p className="text-xs text-gray-500 mt-0.5">{exercise.notes}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
