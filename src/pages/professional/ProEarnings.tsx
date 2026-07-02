import { ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import ProBottomNav from "@/components/ProBottomNav.tsx";

const monthlyData = [
  { month: "Jan", value: 3200 },
  { month: "Fev", value: 2800 },
  { month: "Mar", value: 4100 },
  { month: "Abr", value: 3600 },
  { month: "Mai", value: 4280 },
  { month: "Jun", value: 3900 },
];

const recentPayments = [
  { client: "Juliana M.", service: "Corte masculino", value: "R$ 50", date: "Hoje", type: "in" },
  { client: "Ricardo P.", service: "Barba", value: "R$ 30", date: "Hoje", type: "in" },
  { client: "Comissão Kira", service: "Taxa mensal", value: "-R$ 428", date: "01/03", type: "out" },
  { client: "Amanda F.", service: "Corte + Barba", value: "R$ 70", date: "Ontem", type: "in" },
];

const ProEarnings = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Ganhos</h1>

        {/* Transparency Panel */}
        <div className="gradient-kira rounded-2xl p-6 mb-6 shadow-kira-glow">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-primary-foreground/70" />
            <span className="text-xs text-primary-foreground/70 font-body uppercase tracking-wider">Transparência</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-foreground/80 font-body">Valor total dos serviços</span>
              <span className="text-lg font-bold text-primary-foreground font-body">R$ 4.280</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-foreground/80 font-body">Taxa da plataforma (10%)</span>
              <span className="text-base font-semibold text-primary-foreground/70 font-body">- R$ 428</span>
            </div>
            <hr className="border-primary-foreground/20" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-foreground font-body">Seu lucro líquido</span>
              <span className="text-xl font-bold text-primary-foreground font-body">R$ 3.852</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h2 className="text-base font-display font-semibold text-foreground mb-4">Ganhos mensais</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(280 10% 45%)" }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "hsl(340 20% 96%)" }}
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(340 20% 90%)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`R$ ${value}`, "Ganhos"]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#kiraGradient)" />
                <defs>
                  <linearGradient id="kiraGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(340, 70%, 55%)" />
                    <stop offset="100%" stopColor="hsl(270, 60%, 55%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Payments */}
        <h2 className="text-base font-display font-semibold text-foreground mb-3">Histórico</h2>
        <div className="flex flex-col gap-3">
          {recentPayments.map((payment, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                payment.type === "in" ? "bg-accent/15" : "bg-destructive/15"
              }`}>
                {payment.type === "in"
                  ? <ArrowUpRight size={18} className="text-accent" />
                  : <ArrowDownRight size={18} className="text-destructive" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground font-body text-sm">{payment.client}</h3>
                <p className="text-xs text-muted-foreground font-body">{payment.service}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold font-body ${payment.type === "in" ? "text-accent" : "text-destructive"}`}>
                  {payment.value}
                </p>
                <p className="text-xs text-muted-foreground font-body">{payment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProBottomNav />
    </div>
  );
};

export default ProEarnings;
