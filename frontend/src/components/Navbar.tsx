import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#030303]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/image.png" alt="ColdCraft" className="h-8 w-8 rounded-lg object-cover" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">ColdCraft</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white" onClick={handleLogout}>
                <LogOut className="mr-1 h-3 w-3" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90" asChild>
                <Link to="/auth?mode=register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
