import { memo, useMemo, useState } from 'react';
import { Play, Grid3X3, ShoppingBag, LogOut, Power, Download } from 'lucide-react';
import mysticForestBg from '@/assets/mystic-forest-bg.jpg';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { InstallPrompt } from './InstallPrompt';

interface MainMenuProps {
  lives: number;
  gems: number;
  unlockedLevels: number;
  totalScore: number;
  userEmail?: string;
  onPlay: () => void;
  onLevelSelect: () => void;
  onShop: () => void;
  onLogout: () => void;
  onExit: () => void;
}

export const MainMenu = memo(({
  lives,
  gems,
  unlockedLevels,
  totalScore,
  userEmail,
  onPlay,
  onLevelSelect,
  onShop,
  onLogout,
  onExit,
}: MainMenuProps) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isInstallable, isInstalled, isIOS, isAndroid, install, isStandalone } = usePWAInstall();

  // Pre-generate particle positions to avoid re-renders
  const particles = useMemo(() => 
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      width: 3 + Math.random() * 5,
      height: 3 + Math.random() * 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
    }))
  , []);
  
  // Mostrar botón de instalar si no está instalado y es instalable (o es iOS)
  const showInstallButton = !isInstalled && !isStandalone && (isInstallable || isIOS);
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
        
        .main-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          overflow-x: hidden;
          overflow-y: auto;
          background-image: url(${mysticForestBg});
          background-size: cover;
          background-position: center;
          box-sizing: border-box;
        }
        
        .menu-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .menu-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.6));
          box-shadow: 0 0 10px rgba(255,215,0,0.5);
          opacity: 0.5;
        }
        
        /* Stats Bar */
        .stats-bar {
          position: relative;
          z-index: 50;
          display: flex;
          gap: 12px;
          margin-top: 24px;
          margin-bottom: 24px;
        }
        
        .stat-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .stat-lives {
          background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%);
          border: 2px solid #ef4444;
        }
        
        .stat-gems {
          background: linear-gradient(135deg, #581c87 0%, #7c3aed 100%);
          border: 2px solid #a855f7;
        }
        
        .stat-score {
          background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%);
          border: 2px solid #3b82f6;
        }
        
        /* Title Section - FUERA del card */
        .title-section {
          position: relative;
          z-index: 10;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .game-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          margin: 0;
        }
        
        .title-emojis {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 8px;
          font-size: 2.5rem;
        }
        
        .title-emojis span {
          display: inline-block;
        }
        
        .title-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          margin-top: 8px;
          letter-spacing: 2px;
        }
        
        .title-email {
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          margin-top: 4px;
        }
        
        /* Main Card */
        .main-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 24px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(30, 20, 50, 0.95) 100%);
          border: 2px solid rgba(255, 215, 0, 0.4);
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(0,0,0,0.3);
        }
        
        .level-badge {
          display: inline-block;
          padding: 8px 24px;
          border-radius: 50px;
          background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
          color: #1a1a2e;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .level-target {
          color: rgba(255,255,255,0.7);
          margin-top: 12px;
          font-size: 0.95rem;
        }
        
        .play-button {
          width: 100%;
          padding: 16px;
          margin-top: 20px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #1a1a2e;
          font-family: 'Fredoka', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .play-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 25px rgba(255, 215, 0, 0.5);
        }
        
        .secondary-buttons {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        
        .secondary-btn {
          flex: 1;
          padding: 14px;
          border-radius: 50px;
          border: 2px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: white;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        
        .secondary-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        
        .bottom-buttons {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        
        .bottom-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-family: inherit;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: color 0.2s;
        }
        
        .bottom-btn:hover {
          color: rgba(255,255,255,0.9);
        }
        
        .install-btn {
          width: 100%;
          padding: 14px;
          margin-top: 16px;
          border-radius: 50px;
          border: 2px solid #4ade80;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.3) 100%);
          color: #4ade80;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }
        
        .install-btn:hover {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.4) 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(74, 222, 128, 0.3);
        }
        
        /* Levels Preview Card */
        .levels-preview {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin-top: 20px;
          padding: 16px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(20, 20, 40, 0.9) 0%, rgba(30, 20, 50, 0.9) 100%);
          border: 2px solid rgba(255, 215, 0, 0.2);
        }
        
        .levels-title {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }
        
        .levels-grid {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        
        .level-item {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .level-unlocked {
          background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
          color: white;
        }
        
        .level-locked {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
        }
      `}</style>
      
      <div className="main-menu">
        {/* Overlay */}
        <div className="menu-overlay" />
        
        {/* Static particles - no animation to prevent trembling */}
        {particles.slice(0, 10).map((p) => (
          <div
            key={p.id}
            className="menu-particle"
            style={{
              width: p.width,
              height: p.height,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
          />
        ))}
        
        {/* Stats Bar - ARRIBA DE TODO */}
        <div className="stats-bar">
          <div className="stat-badge stat-lives">
            <span>❤️</span>
            <span>{lives}</span>
          </div>
          <div className="stat-badge stat-gems">
            <span>💎</span>
            <span>{gems}</span>
          </div>
          <div className="stat-badge stat-score">
            <span>🔗</span>
            <span>{totalScore}</span>
          </div>
        </div>
        
        {/* Title Section - FUERA DEL CARD */}
        <div className="title-section">
          <h1 className="game-title">Mystic Garden Pro</h1>
          <div className="title-emojis">
            <span>🍄</span>
            <span>💎</span>
            <span>🧚</span>
          </div>
          <p className="title-subtitle">Match • Collect • Win</p>
          {userEmail && <p className="title-email">{userEmail}</p>}
        </div>
        
        {/* Main Card - SOLO CONTROLES */}
        <div className="main-card">
          <div style={{ textAlign: 'center' }}>
            <span className="level-badge">Nivel {unlockedLevels}</span>
            <p className="level-target">Recolectar 1000 puntos</p>
          </div>
          
          <button onClick={onPlay} className="play-button">
            <Play size={24} fill="#1a1a2e" />
            Jugar
          </button>
          
          <div className="secondary-buttons">
            <button onClick={onLevelSelect} className="secondary-btn">
              <Grid3X3 size={20} />
              Niveles
            </button>
            <button onClick={onShop} className="secondary-btn">
              <ShoppingBag size={20} />
              Tienda
            </button>
          </div>
          
          {/* Botón Instalar - solo si no está instalado */}
          {showInstallButton && (
            <button 
              onClick={() => setShowInstallPrompt(true)} 
              className="install-btn"
            >
              <Download size={20} />
              Instalar App
            </button>
          )}
          
          <div className="bottom-buttons">
            <button onClick={onLogout} className="bottom-btn">
              <LogOut size={16} />
              Cerrar Sesión
            </button>
            <button onClick={onExit} className="bottom-btn">
              <Power size={16} />
              Salir
            </button>
          </div>
        </div>
        
        {/* Levels Preview */}
        <div className="levels-preview">
          <p className="levels-title">Niveles Objetivo</p>
          <div className="levels-grid">
            <div className="level-item level-unlocked">{unlockedLevels}</div>
            <div className="level-item level-locked">🔒</div>
          </div>
        </div>
      </div>
      
      {/* Install Prompt Modal */}
      {showInstallPrompt && (
        <InstallPrompt
          isIOS={isIOS}
          isAndroid={isAndroid}
          onInstall={install}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </>
  );
});

MainMenu.displayName = 'MainMenu';