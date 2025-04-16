import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  return (
    <header className="lg:hidden bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-xl font-bold">FitEvolved</span>
        </div>
        <div>
          <button className="text-gray-500 hover:text-primary">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileNavigation() {
  const [location] = useLocation();
  
  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <NavLink href="/" current={location} icon="home">Home</NavLink>
        <NavLink href="/workout-plan" current={location} icon="dumbbell">Workouts</NavLink>
        <NavLink href="/workout-log" current={location} icon="plus" isSpecial>Log</NavLink>
        <NavLink href="/progress" current={location} icon="chart-line">Progress</NavLink>
        <NavLink href="/profile" current={location} icon="user">Profile</NavLink>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  current: string;
  icon: string;
  isSpecial?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, current, icon, isSpecial = false, children }: NavLinkProps) {
  const isActive = current === href;
  
  if (isSpecial) {
    return (
      <Link href={href}>
        <a className="flex flex-col items-center py-3 text-gray-500">
          <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white -mt-5">
            <i className={`fas fa-${icon} text-xl`}></i>
          </div>
          <span className="text-xs mt-1">{children}</span>
        </a>
      </Link>
    );
  }
  
  return (
    <Link href={href}>
      <a className={cn(
        "flex flex-col items-center py-3",
        isActive ? "text-primary" : "text-gray-500"
      )}>
        <i className={`fas fa-${icon} text-xl`}></i>
        <span className="text-xs mt-1">{children}</span>
      </a>
    </Link>
  );
}
