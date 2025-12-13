const crystalCaveImg = "/fake.jpg";
import { Star } from "lucide-react";

// ✅ SVG seguro como fallback (nunca falla)
const crystalCaveImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%231e293b'/%3E%3Ccircle cx='100' cy='80' r='20' fill='%23ffd700' opacity='0.6'/%3E%3Ccircle cx='300' cy='120' r='30' fill='%239370db' opacity='0.5'/%3E%3Ccircle cx='200' cy='150' r='15' fill='%2300ced1' opacity='0.7'/%3E%3Ctext x='200' y='110' font-family='Arial, sans-serif' font-size='18' fill='%23ffd700' text-anchor='middle' font-weight='bold'%3ECrystal Cave%3C/text%3E%3C/svg%3E";

interface LevelCompleteProps {
  level: number;
  score: number;
  targetScore: number;
  gemsEarned: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
}

// Confetti particle component - memoized
const Confetti = memo(({ count = 100 }: { count?: number }) => {
  const colors = ["#FFD700", "#FF69B4", "#00CED1", "#9370DB", "#FF6347", "#32CD32"];

  const confettiData = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        width: 4 + Math.random() * 8,
        height: 8 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        rotation: Math.random() * 360,
      })),
    [count],
  );

  return (
    <>
      {confettiData.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: `${c.left}%`,
            top: `-10px`,
            width: `${c.width}px`,
            height: `${c.height}px`,
            background: c.color,
            borderRadius: c.borderRadius,
            animation: `confetti-fall ${c.duration}s linear infinite`,
            animationDelay: `${c.delay}s`,
            transform: `rotate(${c.rotation}deg)`,
          }}
        />
      ))}
    </>
  );
});

Confetti.displayName = "Confetti";

export const LevelComplete = memo(
  ({ level, score, targetScore, gemsEarned, onNextLevel, onMainMenu }: LevelCompleteProps) => {
    const [showContent, setShowContent] = useState(false);
    const stars = score >= targetScore * 2 ? 3 : score >= targetScore * 1.5 ? 2 : 1;

    const floatingParticles = useMemo(() => {
      const particleColors = ["#FFD700", "#FF69B4", "#00CED1", "#9370DB"];
      return Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        width: 4 + Math.random() * 6,
        height: 4 + Math.random() * 6,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: particleColors[Math.floor(Math.random() * 4)],
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 4,
      }));
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        console.log("✅ LevelComplete: contenido revelado después de 500ms");
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }, []);

    console.log("🔍 LevelComplete cargado — crystalCaveImg:", crystalCaveImg);

    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
        <Confetti count={150} />

        {floatingParticles.map((p) => (
          <div
            key={`particle-${p.id}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.width,
              height: p.height,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.color,
              animation: `float-glow ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div
          className={`relative text-center transition-all duration-700 ${showContent ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <div className="relative mx-auto mb-6" style={{ width: "350px" }}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "6px solid",
                borderImage: "linear-gradient(135deg, #FFD700, #FFA500, #FF8C00) 1",
                boxShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
              }}
            >
              <img
                src={crystalCaveImg}
                alt="Crystal Cave"
                className="w-full h-auto"
                style={{
                  animation: "image-reveal 1.5s ease-out forwards",
                }}
                onError={(e) => {
                  console.error("❌ Fallo al cargar la imagen de Crystal Cave", e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className = "w-full h-48 bg-gray-800 flex items-center justify-center";
                    fallback.innerHTML = `<span class="text-yellow-400 font-bold">Cueva de Cristal <br/><small>(imagen no disponible)</small></span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />

              <div
                className="absolute top-0 right-0 w-1/3 h-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.9) 100%)",
                  animation: "panel-slide 1s ease-out forwards",
                }}
              />

              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #ec4899 0%, #d946ef 100%)",
                  color: "white",
                }}
              >
                Cueva de Cristal
              </div>
            </div>

            {["top-0 left-0", "top-0 right-0", "bottom-0 left-1/4", "top-1/4 right-0"].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} text-2xl`}
                style={{
                  animation: `sparkle-float ${1.5 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>

          <h1
            className="font-cinzel text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px rgba(255, 215, 0, 0.5))",
            }}
          >
            ¡NIVEL COMPLETADO!
          </h1>

          <div className="flex justify-center gap-2 my-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className="w-12 h-12 transition-all duration-500"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  color: i < stars ? "#FFD700" : "#4a4a4a",
                  fill: i < stars ? "#FFD700" : "transparent",
                  filter: i < stars ? "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))" : "none",
                }}
              />
            ))}
          </div>

          <p className="text-3xl mb-6">
            <span className="text-yellow-400 font-bold">{score}</span>
            <span className="text-white"> puntos</span>
          </p>

          <button
            onClick={() => {
              console.log("⏭️ onNextLevel() llamado");
              onNextLevel();
            }}
            className="px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
            }}
          >
            ✨ Continuar ✨
          </button>
        </div>

        <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float-glow {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
        @keyframes image-reveal {
          0% { transform: perspective(1000px) rotateY(-90deg); opacity: 0; }
          100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; }
        }
        @keyframes panel-slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-10px) scale(1.3); opacity: 0.7; }
        }
      `}</style>
      </div>
    );
  },
);

LevelComplete.displayName = "LevelComplete";
