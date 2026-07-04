import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

interface BookingState {
  professionalName?: string;
  serviceName?: string;
  servicePrice?: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { professionalName, serviceName, servicePrice } = (location.state as BookingState) ?? {};
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full gradient-kira flex items-center justify-center mb-6 shadow-kira-glow animate-scale-in">
          <Check size={36} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2 animate-fade-in">Agendado!</h1>
        <p className="text-muted-foreground font-body text-center mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Seu serviço foi agendado com sucesso.
        </p>
        <div className="w-full max-w-sm bg-card rounded-2xl border border-border p-6 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground font-body">Profissional</span>
              <span className="text-sm font-semibold text-foreground font-body">{professionalName ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground font-body">Serviço</span>
              <span className="text-sm font-semibold text-foreground font-body">{serviceName ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground font-body">Data</span>
              <span className="text-sm font-semibold text-foreground font-body">
                {selectedDate !== null ? days[selectedDate].toLocaleDateString("pt-BR") : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground font-body">Horário</span>
              <span className="text-sm font-semibold text-foreground font-body">{selectedTime}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-foreground font-body">Total</span>
              <span className="text-base font-bold text-primary font-body">{servicePrice ?? "—"}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="w-full max-w-sm py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center p-4">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2 -ml-2 text-foreground">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-display font-semibold text-foreground pr-8">
          {step === 1 ? "Escolher data" : "Escolher horário"}
        </h1>
      </header>

      <div className="flex-1 px-6">
        {step === 1 ? (
          <>
            <p className="text-muted-foreground font-body text-sm mb-6">Selecione uma data disponível</p>
            <div className="grid grid-cols-4 gap-3">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(idx)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                    selectedDate === idx
                      ? "gradient-kira text-primary-foreground shadow-kira"
                      : "bg-card border border-border text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-xs font-body">{weekDays[day.getDay()]}</span>
                  <span className="text-lg font-semibold font-body">{day.getDate()}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground font-body text-sm mb-6">Horários disponíveis</p>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-2xl text-sm font-semibold font-body transition-all ${
                    selectedTime === time
                      ? "gradient-kira text-primary-foreground shadow-kira"
                      : "bg-card border border-border text-foreground hover:border-primary/30"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        <button
          onClick={() => {
            if (step === 1 && selectedDate !== null) setStep(2);
            else if (step === 2 && selectedTime) setStep(3);
          }}
          disabled={(step === 1 && selectedDate === null) || (step === 2 && !selectedTime)}
          className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
        >
          {step === 1 ? "Continuar" : "Confirmar agendamento"}
        </button>
      </div>
    </div>
  );
};

export default Booking;
