import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 15%, hsl(15 85% 65% / 0.9), transparent 45%), " +
            "radial-gradient(circle at 82% 10%, hsl(320 75% 75% / 0.85), transparent 50%), " +
            "radial-gradient(circle at 88% 55%, hsl(300 65% 55% / 0.8), transparent 55%), " +
            "radial-gradient(circle at 8% 68%, hsl(20 80% 60% / 0.8), transparent 50%), " +
            "radial-gradient(circle at 50% 92%, hsl(0 0% 100% / 0.55), transparent 60%), " +
            "linear-gradient(180deg, hsl(340 55% 88%), hsl(0 0% 97%))",
        }}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-10 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[12rem] leading-none font-display font-bold text-primary-foreground drop-shadow-2xl">
            K
          </h1>
          <p className="text-5xl font-display text-primary-foreground drop-shadow-xl">
            Kira
          </p>
          <p className="text-base font-body text-primary-foreground/90 tracking-[0.2em] uppercase mt-4">
            Beleza com confiança
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 rounded-full bg-card/95 backdrop-blur-sm text-foreground font-semibold text-base font-body shadow-kira transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full py-4 rounded-full bg-primary/30 backdrop-blur-sm text-primary-foreground font-semibold text-base font-body transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
