import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, Clock } from "lucide-react";
import ProBottomNav from "@/components/ProBottomNav.tsx";

const appointments = [
  { id: 1, client: "Juliana M.", service: "Corte masculino", time: "09:00", duration: "30 min", price: "R$ 50", status: "confirmado" },
  { id: 2, client: "Ricardo P.", service: "Barba", time: "10:00", duration: "20 min", price: "R$ 30", status: "confirmado" },
  { id: 3, client: "Amanda F.", service: "Corte + Barba", time: "11:00", duration: "50 min", price: "R$ 70", status: "pendente" },
  { id: 4, client: "Pedro S.", service: "Corte masculino", time: "14:00", duration: "30 min", price: "R$ 50", status: "pendente" },
  { id: 5, client: "Fernanda L.", service: "Barba", time: "15:00", duration: "20 min", price: "R$ 30", status: "confirmado" },
  { id: 6, client: "Lucas G.", service: "Corte + Barba", time: "16:00", duration: "50 min", price: "R$ 70", status: "confirmado" },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const ProAgenda = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Agenda</h1>

        {/* Week Selector */}
        <div className="flex items-center gap-2 mb-6">
          <button className="p-1 text-muted-foreground"><ChevronLeft size={20} /></button>
          <div className="flex-1 flex gap-2">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all ${
                  selectedDay === idx
                    ? "gradient-kira text-primary-foreground shadow-kira"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <span className="text-[10px] font-body">{weekDays[day.getDay()]}</span>
                <span className="text-sm font-bold font-body">{day.getDate()}</span>
              </button>
            ))}
          </div>
          <button className="p-1 text-muted-foreground"><ChevronRight size={20} /></button>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-muted">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-foreground font-body">{appointments.length}</p>
            <p className="text-xs text-muted-foreground font-body">Atendimentos</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-primary font-body">R$ 300</p>
            <p className="text-xs text-muted-foreground font-body">Faturamento</p>
          </div>
        </div>

        {/* Appointments */}
        <h2 className="text-base font-display font-semibold text-foreground mb-3">
          {selectedDay === 0 ? "Hoje" : days[selectedDay].toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" })}
        </h2>

        <div className="flex flex-col gap-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-2xl bg-card border border-border shadow-kira"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground font-body">{apt.client}</h3>
                  <p className="text-sm text-muted-foreground font-body">{apt.service}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium font-body ${
                  apt.status === "confirmado"
                    ? "bg-accent/15 text-accent"
                    : "bg-secondary/15 text-secondary"
                }`}>
                  {apt.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-foreground font-body">
                    <Clock size={14} className="text-muted-foreground" /> {apt.time}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">{apt.duration}</span>
                </div>
                <span className="text-sm font-bold text-primary font-body">{apt.price}</span>
              </div>

              {apt.status === "pendente" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl gradient-kira text-primary-foreground text-sm font-semibold font-body">
                    <Check size={16} /> Aceitar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-semibold font-body">
                    <X size={16} /> Recusar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ProBottomNav />
    </div>
  );
};

export default ProAgenda;
