import { TrendingUp, DollarSign, Percent, Wallet, Calendar, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProBottomNav from "@/components/ProBottomNav.tsx";
import prof2 from "@/assets/professional-2.jpg";

const stats = [
  { icon: DollarSign, label: "Faturamento", value: "R$ 4.280", change: "+12%", color: "from-primary to-secondary" },
  { icon: Percent, label: "Comissão", value: "R$ 428", change: "10%", color: "from-secondary to-primary" },
  { icon: Wallet, label: "Lucro líquido", value: "R$ 3.852", change: "+15%", color: "from-accent to-primary" },
  { icon: TrendingUp, label: "Serviços", value: "47", change: "+8%", color: "from-primary to-accent" },
];

const nextAppointments = [
  { client: "Juliana M.", service: "Corte masculino", time: "14:00", status: "confirmado" },
  { client: "Pedro S.", service: "Barba", time: "15:00", status: "pendente" },
  { client: "Fernanda L.", service: "Corte + Barba", time: "16:00", status: "confirmado" },
];

const ProDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-kira px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <img src={prof2} alt="Perfil" className="w-12 h-12 rounded-full object-cover border-2 border-primary-foreground/30" />
          <div>
            <p className="text-primary-foreground/70 text-sm font-body">Olá,</p>
            <h1 className="text-xl font-display font-bold text-primary-foreground">Carlos Silva</h1>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
            <Star size={14} className="text-primary-foreground fill-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground font-body">4.8</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value, change, color }) => (
            <div
              key={label}
              className="bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-kira"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-primary-foreground" />
              </div>
              <p className="text-xs text-muted-foreground font-body">{label}</p>
              <p className="text-lg font-bold text-foreground font-body mt-0.5">{value}</p>
              <span className="text-xs text-accent font-semibold font-body">{change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Appointments */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Próximos atendimentos</h2>
          <button onClick={() => navigate("/pro/agenda")} className="text-sm text-primary font-medium font-body">
            Ver agenda
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {nextAppointments.map((apt, idx) => (
            <button
              key={idx}
              onClick={() => navigate("/pro/agenda")}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-kira transition-transform hover:scale-[1.01] active:scale-[0.99] text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Calendar size={20} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground font-body text-sm">{apt.client}</h3>
                <p className="text-xs text-muted-foreground font-body">{apt.service}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold text-foreground font-body">{apt.time}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium font-body ${
                  apt.status === "confirmado"
                    ? "bg-accent/15 text-accent"
                    : "bg-secondary/15 text-secondary"
                }`}>
                  {apt.status}
                </span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Ver ganhos", path: "/pro/earnings", icon: DollarSign },
            { label: "Meu ranking", path: "/pro/ranking", icon: Star },
          ].map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:shadow-kira transition-all"
            >
              <div className="w-10 h-10 rounded-xl gradient-kira flex items-center justify-center">
                <Icon size={18} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground font-body">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <ProBottomNav />
    </div>
  );
};

export default ProDashboard;
