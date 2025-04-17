import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-user";

export function Sidebar() {
  const [location] = useLocation();
  const { data: user, isLoading } = useCurrentUser();
  
  if (isLoading) {
    return (
      <aside className="hidden lg:block w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-primary text-2xl font-bold">FitEvolved</h1>
          <p className="text-gray-600 text-sm mt-1">Your AI Fitness Partner</p>
        </div>
        <div className="mt-2 flex flex-col">
          {/* Loading skeleton */}
        </div>
      </aside>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <aside className="hidden lg:block w-64 bg-white shadow-md h-screen">
      <div className="p-6">
        <h1 className="text-primary text-2xl font-bold">FitEvolved</h1>
        <p className="text-gray-600 text-sm mt-1">Your AI Fitness Partner</p>
      </div>
      
      <div className="mt-2 flex flex-col">
        <NavLink href="/" current={location} icon="home">Dashboard</NavLink>
        <NavLink href="/workout-plan" current={location} icon="dumbbell">My Workout Plan</NavLink>
        <NavLink href="/progress" current={location} icon="chart-line">Progress</NavLink>
        <NavLink href="/exercise-library" current={location} icon="running">Exercise Library</NavLink>
        <NavLink href="/profile" current={location} icon="cog">Profile</NavLink>
        
        {/* Admin/Dev Tools */}
        <div className="mt-4 mb-2 px-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Developer Tools
          </div>
        </div>
        <NavLink href="/csrf-test" current={location} icon="shield">CSRF Test</NavLink>
      </div>
      
      <div className="absolute bottom-0 w-64 p-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
              alt="User profile" 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-sm">{user.firstName || user.username}</p>
              <Link href="/profile">
                <a className="text-xs text-gray-500 hover:text-primary">View Profile</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  current: string;
  icon: string;
  children: React.ReactNode;
}

function NavLink({ href, current, icon, children }: NavLinkProps) {
  const isActive = current === href;
  
  return (
    <Link href={href}>
      <a className={cn(
        "py-3 px-6 flex items-center space-x-3 transition-colors",
        isActive 
          ? "text-primary bg-blue-50 border-r-4 border-primary" 
          : "text-gray-600 hover:bg-gray-50"
      )}>
        <i className={`fas fa-${icon}`}></i>
        <span>{children}</span>
      </a>
    </Link>
  );
}
