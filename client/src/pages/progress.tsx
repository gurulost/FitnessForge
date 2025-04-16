import { useCurrentUser } from "@/hooks/use-user";
import { useProgressPhotos } from "@/hooks/use-progress";
import { useProgressMetrics } from "@/hooks/use-progress";
import { useHealthInsights } from "@/hooks/use-user";
import { ProgressChart } from "@/components/charts/progress-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressPhotoGallery } from "@/components/workout/progress-photo-gallery";
import { AddMetricsForm } from "@/components/progress/add-metrics-form";
import { AddPhotoForm } from "@/components/progress/add-photo-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

export default function Progress() {
  const { data: user } = useCurrentUser();
  const { data: photos = [] } = useProgressPhotos(user?.id);
  const { data: metrics = [] } = useProgressMetrics(user?.id);
  const getHealthInsights = useHealthInsights(user?.id);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("metrics");
  const [showAddMetricsDialog, setShowAddMetricsDialog] = useState(false);
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  
  const handleGetInsights = async () => {
    if (!user?.id || metrics.length === 0) return;
    
    try {
      const response = await getHealthInsights.mutateAsync();
      setInsights(response.insights);
    } catch (error) {
      toast({
        title: "Error getting insights",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Progress Tracker</h1>
        <div>
          <Button 
            variant="outline"
            className="mr-2"
            onClick={() => setShowAddMetricsDialog(true)}
          >
            <i className="fas fa-weight mr-2"></i> Add Metrics
          </Button>
          <Button onClick={() => setShowAddPhotoDialog(true)}>
            <i className="fas fa-camera mr-2"></i> Add Photo
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">Progress Charts</TabsTrigger>
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          {metrics.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-500 mb-4">
                  No metrics data available. Start tracking your progress to see trends over time.
                </p>
                <Button onClick={() => setShowAddMetricsDialog(true)}>
                  Record Your First Metrics
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ProgressChart metrics={metrics} className="mb-6" />
          )}
          
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">{metrics[0].weight || 'N/A'} lbs</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Body Fat</span>
                      <span className="font-medium">{metrics[0].bodyFat || 'N/A'}%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Chest</span>
                      <span className="font-medium">{metrics[0].chestMeasurement || 'N/A'} in</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Waist</span>
                      <span className="font-medium">{metrics[0].waistMeasurement || 'N/A'} in</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Arms</span>
                      <span className="font-medium">{metrics[0].armsMeasurement || 'N/A'} in</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Progress Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics.length >= 2 ? (
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">Weight Change</span>
                        <ChangeBadge 
                          current={metrics[0].weight} 
                          previous={metrics[metrics.length - 1].weight}
                          unit="lbs"
                          invertColors
                        />
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">Body Fat Change</span>
                        <ChangeBadge 
                          current={metrics[0].bodyFat} 
                          previous={metrics[metrics.length - 1].bodyFat}
                          unit="%"
                          invertColors
                        />
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">Chest Change</span>
                        <ChangeBadge 
                          current={metrics[0].chestMeasurement} 
                          previous={metrics[metrics.length - 1].chestMeasurement}
                          unit="in"
                        />
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">Waist Change</span>
                        <ChangeBadge 
                          current={metrics[0].waistMeasurement} 
                          previous={metrics[metrics.length - 1].waistMeasurement}
                          unit="in"
                          invertColors
                        />
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">Arms Change</span>
                        <ChangeBadge 
                          current={metrics[0].armsMeasurement} 
                          previous={metrics[metrics.length - 1].armsMeasurement}
                          unit="in"
                        />
                      </li>
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Add more measurements to see your progress over time.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="photos">
          <Card>
            <CardContent className="pt-6">
              <ProgressPhotoGallery 
                photos={photos} 
                onAddPhoto={() => setShowAddPhotoDialog(true)} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI Health Insights</CardTitle>
                <Button 
                  onClick={handleGetInsights} 
                  disabled={getHealthInsights.isPending || metrics.length === 0}
                >
                  {getHealthInsights.isPending ? "Analyzing..." : "Get New Insights"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {metrics.length === 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to record your metrics before we can generate insights.
                  </AlertDescription>
                </Alert>
              ) : insights ? (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full p-2 text-white mr-3 mt-1">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Analysis Based on Your Data</h3>
                      <p className="text-gray-700 mt-1">
                        {insights}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Get personalized health insights based on your progress data.
                  </p>
                  <Button 
                    onClick={handleGetInsights}
                    disabled={getHealthInsights.isPending}
                  >
                    Generate Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Metrics Dialog */}
      <Dialog open={showAddMetricsDialog} onOpenChange={setShowAddMetricsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Your Measurements</DialogTitle>
          </DialogHeader>
          <AddMetricsForm 
            userId={user?.id} 
            onSuccess={() => setShowAddMetricsDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Photo Dialog */}
      <Dialog open={showAddPhotoDialog} onOpenChange={setShowAddPhotoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
          </DialogHeader>
          <AddPhotoForm 
            userId={user?.id} 
            onSuccess={() => setShowAddPhotoDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

interface ChangeBadgeProps {
  current?: number;
  previous?: number;
  unit: string;
  invertColors?: boolean;
}

function ChangeBadge({ current, previous, unit, invertColors = false }: ChangeBadgeProps) {
  if (current === undefined || previous === undefined) {
    return <span className="text-gray-500">N/A</span>;
  }
  
  const change = current - previous;
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  // For some metrics like weight and body fat, a decrease is usually good
  const isPositiveOutcome = invertColors ? !isPositive : isPositive;
  
  if (change === 0) {
    return <span className="text-gray-500">No change</span>;
  }
  
  return (
    <span className={`font-medium ${isPositiveOutcome ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? '+' : ''}{change.toFixed(1)} {unit}
    </span>
  );
}
