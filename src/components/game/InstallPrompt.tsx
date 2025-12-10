import { memo, useState } from 'react';
import { X, Download, Smartphone, Share, Plus } from 'lucide-react';

interface InstallPromptProps {
  isIOS: boolean;
  isAndroid: boolean;
  onInstall: () => Promise<boolean>;
  onClose: () => void;
}

export const InstallPrompt = memo(({
  isIOS,
  isAndroid,
  onInstall,
  onClose,
}: InstallPromptProps) => {
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    if (isIOS) return; // iOS no puede instalar programáticamente
    
    setInstalling(true);
    const success = await onInstall();
    setInstalling(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        .install-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .install-modal {
          background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%);
          border-radius: 24px;
          padding: 32px 24px;
          max-width: 380px;
          width: 100%;
          border: 2px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 0 60px rgba(255, 215, 0, 0.2);
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .install-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s;
        }
        
        .install-close:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .install-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(255, 215, 0, 0.3);
        }
        
        .install-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .install-subtitle {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          font-size: 0.95rem;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        
        .install-steps {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .install-step {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .install-step:last-child {
          border-bottom: none;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #1a0a2e;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .step-text {
          color: white;
          font-size: 0.9rem;
          flex: 1;
        }
        
        .install-button {
          width: 100%;
          padding: 16px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #1a0a2e;
          font-family: 'Fredoka', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .install-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 215, 0, 0.5);
        }
        
        .install-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .install-note {
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          font-size: 0.8rem;
          margin-top: 16px;
        }
      `}</style>
      
      <div className="install-overlay" onClick={onClose}>
        <div className="install-modal" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
          <button className="install-close" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className="install-icon">
            <Smartphone size={40} color="#1a0a2e" />
          </div>
          
          <h2 className="install-title">Instalar Mystic Garden</h2>
          
          {isIOS ? (
            <>
              <p className="install-subtitle">
                Instala la app en tu iPhone o iPad para jugar sin conexión
              </p>
              
              <div className="install-steps">
                <div className="install-step">
                  <span className="step-number">1</span>
                  <div className="step-icon">
                    <Share size={20} color="#FFD700" />
                  </div>
                  <span className="step-text">Pulsa el botón <strong>Compartir</strong> en Safari</span>
                </div>
                
                <div className="install-step">
                  <span className="step-number">2</span>
                  <div className="step-icon">
                    <Plus size={20} color="#FFD700" />
                  </div>
                  <span className="step-text">Selecciona <strong>"Añadir a pantalla de inicio"</strong></span>
                </div>
                
                <div className="install-step">
                  <span className="step-number">3</span>
                  <div className="step-icon">
                    <Download size={20} color="#FFD700" />
                  </div>
                  <span className="step-text">Pulsa <strong>"Añadir"</strong> para confirmar</span>
                </div>
              </div>
              
              <button className="install-button" onClick={onClose}>
                ¡Entendido!
              </button>
              
              <p className="install-note">
                * Debe usarse Safari para instalar en iOS
              </p>
            </>
          ) : (
            <>
              <p className="install-subtitle">
                Instala la app en tu dispositivo para acceso rápido y jugar sin conexión
              </p>
              
              <button 
                className="install-button" 
                onClick={handleInstall}
                disabled={installing}
              >
                {installing ? (
                  'Instalando...'
                ) : (
                  <>
                    <Download size={24} />
                    Instalar Ahora
                  </>
                )}
              </button>
              
              <p className="install-note">
                Se añadirá un icono a tu pantalla de inicio
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
});

InstallPrompt.displayName = 'InstallPrompt';
