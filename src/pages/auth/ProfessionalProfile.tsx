import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Shield, Clock, ChevronRight } from "lucide-react";
import prof1 from "@/assets/professional-1.jpg";
import prof2 from "@/assets/professional-2.jpg";
import prof3 from "@/assets/professional-3.jpg";

const profData: Record<string, { name: string; specialty: string; rating: number; reviews: number; distance: string; bio: string; image: string; services: { name: string; price: string; duration: string }[] }> = {
  "1": {
    name: "Ana Paula", specialty: "Cabeleireira", rating: 4.9, reviews: 127, distance: "1.2 km",
    bio: "Especialista em coloração e cortes modernos. 8 anos de experiência.",
    image: prof1,
    services: [
      { name: "Corte feminino", price: "R$ 80", duration: "45 min" },
      { name: "Coloração", price: "R$ 150", duration: "2h" },
      { name: "Hidratação", price: "R$ 60", duration: "40 min" },
      { name: "Escova progressiva", price: "R$ 200", duration: "3h" },
    ],
  },
  "2": {
    name: "Carlos Silva", specialty: "Barbeiro", rating: 4.8, reviews: 95, distance: "2.0 km",
    bio: "Barbeiro profissional com técnicas clássicas e modernas.",
    image: prof2,
    services: [
      { name: "Corte masculino", price: "R$ 50", duration: "30 min" },
      { name: "Barba", price: "R$ 30", duration: "20 min" },
      { name: "Corte + Barba", price: "R$ 70", duration: "50 min" },
    ],
  },
  "3": {
    name: "Marina Costa", specialty: "Massagista", rating: 5.0, reviews: 203, distance: "0.8 km",
    bio: "Terapeuta corporal certificada. Especialista em massagem relaxante.",
    image: prof3,
    services: [
      { name: "Massagem relaxante", price: "R$ 120", duration: "1h" },
      { name: "Massagem desportiva", price: "R$ 140", duration: "1h" },
      { name: "Reflexologia", price: "R$ 90", duration: "45 min" },
    ],
  },
};

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const prof = profData[id || "1"];

  if (!prof) return null;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Hero */}
      <div className="relative h-72">
        <img src={prof.image} alt={prof.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 p-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground"
        >
          <ArrowLeft size={22} />
        </button>
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          <img src={prof.image} alt={prof.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-background shadow-kira" />
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{prof.name}</h1>
            <p className="text-sm text-muted-foreground font-body">{prof.specialty}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <span className="flex items-center gap-1 text-sm font-body">
            <Star size={16} className="text-accent fill-accent" />
            <span className="font-semibold text-foreground">{prof.rating}</span>
            <span className="text-muted-foreground">({prof.reviews})</span>
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground font-body">
            <MapPin size={14} /> {prof.distance}
          </span>
          <span className="flex items-center gap-1 text-sm text-secondary font-body">
            <Shield size={14} /> Verificado
          </span>
        </div>

        <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8">{prof.bio}</p>

        {/* Services */}
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Serviços</h2>
        <div className="flex flex-col gap-3 mb-8">
          {prof.services.map((service) => (
            <button
              key={service.name}
              onClick={() => navigate("/booking")}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:shadow-kira transition-all text-left"
            >
              <div>
                <h3 className="font-semibold text-foreground font-body text-sm">{service.name}</h3>
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-body mt-1">
                  <Clock size={12} /> {service.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary font-body">{service.price}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/booking")}
          className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Agendar serviço
        </button>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
