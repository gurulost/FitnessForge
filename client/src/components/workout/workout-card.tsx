import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { LoggedWorkout } from "@/lib/types";

interface WorkoutCardProps {
  workout: LoggedWorkout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const exercises = workout.exerciseData ? 
    Array.isArray(workout.exerciseData) ? 
      workout.exerciseData : 
      [] : 
    [];
  
  return (
    <Card className="bg-white mb-8">
      <CardHeader className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{workout.name}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <i className="fas fa-calendar-alt mr-1"></i>
              <span>{formatDateTime(workout.date)}</span>
              {workout.duration && (
                <>
                  <span className="mx-2">•</span>
                  <i className="fas fa-clock mr-1"></i>
                  <span>{workout.duration} minutes</span>
                </>
              )}
            </div>
          </div>
          <Badge className="bg-green-100 text-secondary hover:bg-green-200">
            Completed
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="space-y-4">
          {exercises.map((exercise: any, index: number) => (
            <ExerciseRow 
              key={index}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              weight={exercise.weight}
              improvement={exercise.improvement}
            />
          ))}
        </div>
        
        {workout.aiFeedback && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-2">AI Feedback</h4>
            <p className="text-sm text-gray-700">{workout.aiFeedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ExerciseRowProps {
  name: string;
  sets: string | number;
  reps: string | number;
  weight?: string | number;
  improvement?: string;
}

function ExerciseRow({ name, sets, reps, weight, improvement }: ExerciseRowProps) {
  return (
    <div className="flex justify-between">
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-gray-500">{sets} sets x {reps} reps</p>
      </div>
      {weight && (
        <div className="text-right">
          <div className="text-sm font-medium">{weight}</div>
          {improvement && (
            <div className="text-xs text-secondary">{improvement}</div>
          )}
        </div>
      )}
    </div>
  );
}
