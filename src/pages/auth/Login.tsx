import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center p-4 w-full max-w-md mx-auto">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 text-foreground">
            <ArrowLeft size={24} />
          </button>
        </header>

        <div className="flex-1 w-full max-w-md mx-auto px-6 pt-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Bem-vinda de volta</h1>
          <p className="text-muted-foreground font-body mb-10">Entre na sua conta Kira</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground font-body">E-mail</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground font-body text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground font-body">Senha</label>
              <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground font-body text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="button" className="self-end text-sm text-primary font-medium font-body">
              Esqueci minha senha
            </button>

            <button
                type="submit"
                className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-body mt-8">
            Não tem conta?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-semibold">
              Criar conta
            </button>
          </p>
        </div>
      </div>
  );
};

export default Login;