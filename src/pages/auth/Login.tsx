import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, User, Briefcase, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { login } from "@/lib/auth.ts";

const loginSchema = z.object({
  email: z.string().trim().min(1, { message: "Informe seu e-mail" }).email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "Informe sua senha" }),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<"client" | "professional">("client");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Preencha e-mail e senha para continuar");
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const tipoSelecionado = accountType === "professional" ? "EMPRESA" : "CLIENTE";
    const res = await login(result.data.email, result.data.password, tipoSelecionado);
    setIsSubmitting(false);

    if (!res.ok) {
      toast.error(
        res.reason === "network_error"
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : "E-mail ou senha inválidos"
      );
      return;
    }

    navigate(res.session.tipo === "EMPRESA" ? "/pro/dashboard" : "/home");
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
            <div className="grid grid-cols-2 gap-3 mb-2">
              {[
                { type: "client" as const, icon: User, label: "Cliente" },
                { type: "professional" as const, icon: Briefcase, label: "Profissional" },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium font-body transition-all duration-200 ${
                    accountType === type
                      ? "border-primary bg-primary/10 text-foreground shadow-kira"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground font-body">E-mail</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="seu@email.com"
                  className={`w-full px-4 py-3.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground font-body text-sm border transition-all focus:outline-none focus:ring-2 ${
                    errors.email ? "border-destructive focus:ring-destructive/40" : "border-border focus:ring-primary/50"
                  }`}
              />
              {errors.email && <p className="text-xs text-destructive font-body">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground font-body">Senha</label>
              <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground font-body text-sm border transition-all focus:outline-none focus:ring-2 ${
                      errors.password ? "border-destructive focus:ring-destructive/40" : "border-border focus:ring-primary/50"
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive font-body">{errors.password}</p>}
            </div>

            <button type="button" className="self-end text-sm text-primary font-medium font-body">
              Esqueci minha senha
            </button>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
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