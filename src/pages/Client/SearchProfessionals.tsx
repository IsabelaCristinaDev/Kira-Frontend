import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Star, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav.tsx";
import prof1 from "@/assets/professional-1.jpg";
import prof2 from "@/assets/professional-2.jpg";
import prof3 from "@/assets/professional-3.jpg";

const allProfessionals = [
  { id: 1, name: "Ana Paula", specialty: "Cabeleireira", rating: 4.9, distance: "1.2 km", price: "R$ 80", image: prof1 },
  { id: 2, name: "Carlos Silva", specialty: "Barbeiro", rating: 4.8, distance: "2.0 km", price: "R$ 50", image: prof2 },
  { id: 3, name: "Marina Costa", specialty: "Massagista", rating: 5.0, distance: "0.8 km", price: "R$ 120", image: prof3 },
];

const filters = ["Todos", "Cabelo", "Barba", "Unhas", "Estética", "Massagem"];

const SearchProfessionals = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Buscar</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar profissionais..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none"
            />
          </div>
          <button className="p-3 rounded-xl bg-primary text-primary-foreground">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium font-body whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "gradient-kira text-primary-foreground shadow-kira"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-4 flex flex-col gap-4">
        {allProfessionals.map((prof) => (
          <button
            key={prof.id}
            onClick={() => navigate(`/professional/${prof.id}`)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-kira transition-transform hover:scale-[1.01] active:scale-[0.99] text-left"
          >
            <img src={prof.image} alt={prof.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground font-body">{prof.name}</h3>
              <p className="text-sm text-muted-foreground font-body">{prof.specialty}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm text-foreground font-body">
                  <Star size={14} className="text-accent fill-accent" /> {prof.rating}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground font-body">
                  <MapPin size={14} /> {prof.distance}
                </span>
              </div>
            </div>
            <span className="text-base font-bold text-primary font-body">{prof.price}</span>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchProfessionals;
