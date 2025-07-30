import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import ResumeBuilder from "@/pages/ResumeBuilder";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/builder/:id?" component={ResumeBuilder} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-deep-black text-white">
          {/* Floating Particles Background */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="particle w-2 h-2 top-10 left-10 opacity-30" style={{ animationDelay: '0s' }}></div>
            <div className="particle w-1 h-1 top-20 right-20 opacity-20" style={{ animationDelay: '1s' }}></div>
            <div className="particle w-3 h-3 bottom-20 left-1/4 opacity-25" style={{ animationDelay: '2s' }}></div>
            <div className="particle w-1 h-1 top-1/2 right-1/3 opacity-15" style={{ animationDelay: '3s' }}></div>
          </div>
          
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
