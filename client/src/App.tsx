import { Switch, Route } from "wouter";
import { useCurrentUser } from "./hooks/use-user";
import { Sidebar } from "./components/sidebar";
import { MobileHeader, MobileNavigation } from "./components/mobile-navigation";
import Dashboard from "./pages/dashboard";
import WorkoutPlan from "./pages/workout-plan";
import Progress from "./pages/progress";
import ExerciseLibrary from "./pages/exercise-library";
import Profile from "./pages/profile";
import Onboarding from "./pages/onboarding";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import NotFound from "./pages/not-found";
import { useEffect } from "react";
import { useLocation } from "wouter";

function App() {
  const { data: user, isLoading } = useCurrentUser();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user && !location.startsWith("/auth")) {
      setLocation("/auth/login");
    }
    
    // Redirect to onboarding if user exists but is not onboarded
    if (!isLoading && user && !user.isOnboarded && location !== "/onboarding") {
      setLocation("/onboarding");
    }
  }, [user, isLoading, location, setLocation]);

  // Show loading state while determining authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Public routes
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Switch>
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
          <Route path="*" component={() => {
            setLocation("/auth/login");
            return null;
          }} />
        </Switch>
      </div>
    );
  }

  // Onboarding route
  if (!user.isOnboarded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Switch>
          <Route path="/onboarding" component={Onboarding} />
          <Route path="*" component={() => {
            setLocation("/onboarding");
            return null;
          }} />
        </Switch>
      </div>
    );
  }

  // Authenticated routes
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow bg-gray-50 overflow-auto pb-20 lg:pb-0">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/workout-plan" component={WorkoutPlan} />
            <Route path="/progress" component={Progress} />
            <Route path="/exercise-library" component={ExerciseLibrary} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}

export default App;
