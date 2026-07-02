import { Trophy, Medal, TrendingUp, Crown } from "lucide-react";
import ProBottomNav from "@/components/ProBottomNav.tsx";
import prof1 from "@/assets/professional-1.jpg";
import prof2 from "@/assets/professional-2.jpg";
import prof3 from "@/assets/professional-3.jpg";

const levels = [
  { name: "Bronze", min: 0, max: 100, color: "from-amber-700 to-amber-500" },
  { name: "Prata", min: 100, max: 300, color: "from-gray-400 to-gray-300" },
  { name: "Ouro", min: 300, max: 600, color: "from-yellow-500 to-yellow-300" },
  { name: "Elite", min: 600, max: 1000, color: "from-primary to-secondary" },
];

const currentPoints = 420;
const currentLevel = levels.find(l => currentPoints >= l.min && currentPoints < l.max) || levels[2];
const nextLevel = levels[levels.indexOf(currentLevel) + 1];

const topProfessionals = [
  { rank: 1, name: "Marina Costa", points: 890, level: "Elite", image: prof3 },
  { rank: 2, name: "Ana Paula", points: 720, level: "Elite", image: prof1 },
  { rank: 3, name: "Carlos Silva", points: 420, level: "Ouro", image: prof2, isYou: true },
];

const ProRanking = () => {
  const progress = nextLevel ? ((currentPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100 : 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Ranking</h1>

        {/* Your Position */}
        <div className="gradient-kira rounded-2xl p-6 mb-6 shadow-kira-glow text-center">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3">
            <Trophy size={28} className="text-primary-foreground" />
          </div>
          <p className="text-primary-foreground/70 text-sm font-body mb-1">Sua posição</p>
          <p className="text-5xl font-display font-bold text-primary-foreground mb-1">3º</p>
          <p className="text-primary-foreground/80 text-sm font-body">{currentPoints} pontos</p>
        </div>

        {/* Level Progress */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Medal size={18} className="text-accent" />
              <span className="font-semibold text-foreground font-body">Nível {currentLevel.name}</span>
            </div>
            {nextLevel && (
              <span className="text-xs text-muted-foreground font-body">
                {nextLevel.min - currentPoints} pts para {nextLevel.name}
              </span>
            )}
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-kira rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground font-body">{currentLevel.min}</span>
            <span className="text-xs text-muted-foreground font-body">{currentLevel.max}</span>
          </div>
        </div>

        {/* Levels */}
        <h2 className="text-base font-display font-semibold text-foreground mb-3">Níveis</h2>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {levels.map((level) => (
            <div
              key={level.name}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${
                level.name === currentLevel.name
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center`}>
                {level.name === "Elite" ? <Crown size={14} className="text-primary-foreground" /> : <TrendingUp size={14} className="text-primary-foreground" />}
              </div>
              <span className="text-[10px] font-semibold text-foreground font-body">{level.name}</span>
              <span className="text-[9px] text-muted-foreground font-body">{level.min}+ pts</span>
            </div>
          ))}
        </div>

        {/* Top Professionals */}
        <h2 className="text-base font-display font-semibold text-foreground mb-3">Top profissionais</h2>
        <div className="flex flex-col gap-3">
          {topProfessionals.map((pro) => (
            <div
              key={pro.rank}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                pro.isYou
                  ? "bg-primary/5 border-primary shadow-kira"
                  : "bg-card border-border"
              }`}
            >
              <span className={`text-lg font-bold font-display w-8 text-center ${
                pro.rank === 1 ? "text-accent" : pro.rank === 2 ? "text-muted-foreground" : "text-primary"
              }`}>
                {pro.rank}º
              </span>
              <img src={pro.image} alt={pro.name} className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground font-body text-sm">
                  {pro.name} {pro.isYou && <span className="text-primary">(você)</span>}
                </h3>
                <p className="text-xs text-muted-foreground font-body">{pro.level}</p>
              </div>
              <span className="text-sm font-bold text-foreground font-body">{pro.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      <ProBottomNav />
    </div>
  );
};

export default ProRanking;
