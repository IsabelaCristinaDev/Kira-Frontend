import { LayoutDashboard, Calendar, DollarSign, Trophy, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/pro/dashboard" },
  { icon: Calendar, label: "Agenda", path: "/pro/agenda" },
  { icon: DollarSign, label: "Ganhos", path: "/pro/earnings" },
  { icon: Trophy, label: "Ranking", path: "/pro/ranking" },
  { icon: User, label: "Perfil", path: "/profile" },
];

const ProBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium font-body">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ProBottomNav;
