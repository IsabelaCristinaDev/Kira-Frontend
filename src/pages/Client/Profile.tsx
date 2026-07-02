import { useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  Shield,
  ShieldCheck,
  Star,
} from "lucide-react";
import BottomNav from "@/components/BottomNav.tsx";

const stats = [
  { icon: Calendar, label: "Agendamentos", value: "12" },
  { icon: Heart, label: "Favoritos", value: "8" },
  { icon: Star, label: "Avaliações", value: "10" },
];

const menuGroups = [
  {
    title: "Minha conta",
    items: [
      { icon: Pencil, label: "Editar perfil", path: "/profile" },
      { icon: MapPin, label: "Meus endereços", path: "/profile" },
      { icon: CreditCard, label: "Formas de pagamento", path: "/profile" },
      { icon: Heart, label: "Profissionais favoritos", path: "/profile" },
    ],
  },
  {
    title: "Atividade",
    items: [
      { icon: Calendar, label: "Meus agendamentos", path: "/booking" },
      { icon: Star, label: "Minhas avaliações", path: "/profile" },
    ],
  },
  {
    title: "Preferências",
    items: [
      { icon: Bell, label: "Notificações", path: "/profile" },
      { icon: Shield, label: "Privacidade e segurança", path: "/profile" },
      { icon: Settings, label: "Configurações", path: "/profile" },
      { icon: HelpCircle, label: "Ajuda e suporte", path: "/profile" },
    ],
  },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-kira px-6 pt-12 pb-20 rounded-b-3xl relative">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-primary-foreground">
            Meu Perfil
          </h1>
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            aria-label="Sair"
          >
            <LogOut size={18} className="text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Avatar card */}
      <div className="px-6 -mt-14">
        <div className="bg-card rounded-3xl shadow-kira p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-display font-bold shadow-kira">
                MA
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
                aria-label="Editar foto"
              >
                <Pencil size={12} className="text-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-display font-semibold text-foreground truncate">
                Maria Almeida
              </h2>
              <p className="text-sm text-muted-foreground font-body truncate">
                maria.almeida@email.com
              </p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10">
                <ShieldCheck size={12} className="text-primary" />
                <span className="text-[11px] text-primary font-medium font-body">
                  Identidade verificada
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-border">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={18} className="text-primary" />
                <span className="text-base font-display font-semibold text-foreground">
                  {value}
                </span>
                <span className="text-[11px] text-muted-foreground font-body text-center">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-6 mt-6 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-body font-semibold mb-2 px-1">
              {group.title}
            </h3>
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
              {group.items.map(({ icon: Icon, label, path }, i) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors ${
                    i !== group.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="flex-1 text-left text-sm text-foreground font-body">
                    {label}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-destructive/30 text-destructive font-body font-medium hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>

        <p className="text-center text-[11px] text-muted-foreground font-body">
          Kira • versão 1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;