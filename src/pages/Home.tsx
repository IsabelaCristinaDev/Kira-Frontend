import { Search, MapPin, Star, Scissors, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import prof1 from "@/assets/professional-1.jpg";
import prof2 from "@/assets/professional-2.jpg";
import prof3 from "@/assets/professional-3.jpg";

const categories = [
  { icon: Scissors, label: "Cabelo", color: "from-primary to-secondary" },
  { icon: Sparkles, label: "Unhas", color: "from-accent to-primary" },
  { icon: Heart, label: "Estética", color: "from-secondary to-accent" },
  { icon: Sparkles, label: "Makeup", color: "from-primary to-accent" },
];

const professionals = [
  { id: 1, name: "Ana Paula", specialty: "Cabeleireira", rating: 4.9, distance: "1.2 km", price: "R$ 80", image: prof1 },
  { id: 2, name: "Carlos Silva", specialty: "Barbeiro", rating: 4.8, distance: "2.0 km", price: "R$ 50", image: prof2 },
  { id: 3, name: "Marina Costa", specialty: "Massagista", rating: 5.0, distance: "0.8 km", price: "R$ 120", image: prof3 },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-kira px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm font-body">Olá,</p>
            <h1 className="text-2xl font-display font-bold text-primary-foreground">Bem-vinda! ✨</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <MapPin size={18} className="text-primary-foreground" />
          </div>
        </div>

        <button
          onClick={() => navigate("/search")}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card/90 backdrop-blur-sm"
        >
          <Search size={18} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-body">Buscar profissionais...</span>
        </button>
      </div>

      {/* Categories */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Categorias</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map(({ icon: Icon, label, color }) => (
            <button key={label} className="flex flex-col items-center gap-2" onClick={() => navigate("/search")}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-kira`}>
                <Icon size={22} className="text-primary-foreground" />
              </div>
              <span className="text-xs text-foreground font-medium font-body">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Professionals */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Perto de você</h2>
          <button onClick={() => navigate("/search")} className="text-sm text-primary font-medium font-body">Ver todos</button>
        </div>

        <div className="flex flex-col gap-4">
          {professionals.map((prof) => (
            <button
              key={prof.id}
              onClick={() => navigate(`/professional/${prof.id}`)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-kira transition-transform hover:scale-[1.01] active:scale-[0.99] text-left"
            >
              <img src={prof.image} alt={prof.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground font-body text-sm">{prof.name}</h3>
                <p className="text-xs text-muted-foreground font-body">{prof.specialty}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-foreground font-body">
                    <Star size={12} className="text-accent fill-accent" /> {prof.rating}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">{prof.distance}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary font-body">{prof.price}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
