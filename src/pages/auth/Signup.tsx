import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Briefcase } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"client" | "professional" | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center p-4">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 text-foreground">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 px-6 pt-4 pb-8 overflow-y-auto">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Criar conta</h1>
        <p className="text-muted-foreground font-body mb-8">Escolha seu perfil para começar</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { type: "client" as const, icon: User, label: "Cliente", desc: "Agendar serviços" },
            { type: "professional" as const, icon: Briefcase, label: "Profissional", desc: "Oferecer serviços" },
          ].map(({ type, icon: Icon, label, desc }) => (
            <button
              key={type}
              onClick={() => {
                setAccountType(type);
                if (type === "client") navigate("/signup/client");
                if (type === "professional") navigate("/signup/professional");
              }}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 ${
                accountType === type
                  ? "border-primary bg-primary/10 shadow-kira"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                accountType === type ? "gradient-kira" : "bg-muted"
              }`}>
                <Icon size={22} className={accountType === type ? "text-primary-foreground" : "text-muted-foreground"} />
              </div>
              <span className="font-semibold text-sm text-foreground font-body">{label}</span>
              <span className="text-xs text-muted-foreground font-body">{desc}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          Já tem conta?{" "}
          <button onClick={() => navigate("/login")} className="text-primary font-semibold">
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
