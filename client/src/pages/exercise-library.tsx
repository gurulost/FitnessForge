import { useExercises, useExercisesByMuscleGroup } from "@/hooks/use-workout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMuscleGroups } from "@/lib/utils";
import { Exercise } from "@/lib/types";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ExerciseLibrary() {
  const { data: allExercises = [] } = useExercises();
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Get muscle groups
  const muscleGroups = getMuscleGroups();
  
  // Filter exercises based on search query
  const filteredExercises = allExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exercise.description && exercise.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (exercise.muscleGroup && exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get exercises for the current tab
  const displayedExercises = activeTab === "all" 
    ? filteredExercises 
    : filteredExercises.filter(exercise => exercise.muscleGroup === activeTab);
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
          <p className="text-sm text-gray-600">Browse exercises to include in your workout routines</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search exercises..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Exercises</TabsTrigger>
            {muscleGroups.map(group => (
              <TabsTrigger key={group} value={group}>{group}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeTab}>
          {displayedExercises.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No exercises found matching "${searchQuery}"`
                    : `No exercises found for ${activeTab}`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedExercises.map(exercise => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  onClick={() => setSelectedExercise(exercise)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedExercise && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedExercise.muscleGroup && (
                  <Badge variant="secondary">{selectedExercise.muscleGroup}</Badge>
                )}
                {selectedExercise.equipment && (
                  <Badge variant="outline">{selectedExercise.equipment}</Badge>
                )}
                {selectedExercise.difficulty && (
                  <Badge 
                    className={
                      selectedExercise.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                      selectedExercise.difficulty === "Intermediate" ? "bg-blue-100 text-blue-800" :
                      "bg-orange-100 text-orange-800"
                    }
                  >
                    {selectedExercise.difficulty}
                  </Badge>
                )}
              </div>
              
              {selectedExercise.description && (
                <p className="text-gray-700">{selectedExercise.description}</p>
              )}
              
              {selectedExercise.instructions && (
                <div>
                  <h3 className="font-medium mb-2">Instructions</h3>
                  <p className="text-gray-700">{selectedExercise.instructions}</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setSelectedExercise(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.muscleGroup && (
            <Badge variant="secondary">{exercise.muscleGroup}</Badge>
          )}
          {exercise.difficulty && (
            <Badge 
              className={
                exercise.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                exercise.difficulty === "Intermediate" ? "bg-blue-100 text-blue-800" :
                "bg-orange-100 text-orange-800"
              }
            >
              {exercise.difficulty}
            </Badge>
          )}
        </div>
        
        {exercise.description && (
          <p className="text-gray-700 text-sm line-clamp-2">{exercise.description}</p>
        )}
        
        <div className="mt-2 text-sm text-primary">Click for details</div>
      </CardContent>
    </Card>
  );
}
