import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import mysticForestBg from '@/assets/mystic-forest-bg.jpg';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate floating particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 6,
    duration: 5 + Math.random() * 4,
  }));

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: '¡Bienvenido de nuevo! ✨' });
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast({ title: '¡Cuenta creada! 🎉', description: 'Ya puedes iniciar sesión' });
      }
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Decorative elements
  const decorations = [
    { emoji: '🍄', left: '5%', bottom: '10%', size: 45 },
    { emoji: '🍄', left: '15%', bottom: '5%', size: 35 },
    { emoji: '🍄', left: '85%', bottom: '8%', size: 40 },
    { emoji: '🍄', left: '92%', bottom: '15%', size: 30 },
    { emoji: '🦋', left: '10%', top: '12%', size: 28 },
    { emoji: '🦋', left: '85%', top: '18%', size: 24 },
    { emoji: '✨', left: '3%', top: '40%', size: 16 },
    { emoji: '✨', left: '95%', top: '35%', size: 14 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
        
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          background-image: url(${mysticForestBg});
          background-size: cover;
          background-position: center;
        }
        
        .auth-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .auth-decoration {
          position: absolute;
          z-index: 10;
          pointer-events: none;
          animation: float-glow 3s ease-in-out infinite;
        }
        
        .auth-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.6));
          box-shadow: 0 0 10px rgba(255,215,0,0.5);
        }
        
        .auth-card {
          position: relative;
          z-index: 20;
          width: 100%;
          max-width: 420px;
          padding: 40px 30px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .auth-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin: 0 0 8px 0;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
        }
        
        .auth-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          margin: 0 0 25px 0;
        }
        
        .auth-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 25px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 30px;
          padding: 5px;
        }
        
        .auth-tab {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 25px;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .auth-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .auth-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .auth-input:focus {
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }
        
        .auth-button {
          width: 100%;
          padding: 14px 40px;
          margin-top: 5px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-family: 'Fredoka', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .auth-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
        }
        
        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .auth-toggle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-top: 20px;
        }
        
        .auth-toggle-link {
          background: none;
          border: none;
          color: #FFD700;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.9rem;
          font-family: inherit;
        }
        
        .auth-toggle-link:hover {
          color: #FFA500;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes float-glow {
          0%, 100% {
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 0 10px rgba(255, 100, 150, 0.4));
          }
          50% {
            transform: scale(1.1) translateY(-5px);
            filter: drop-shadow(0 0 20px rgba(255, 150, 200, 0.7));
          }
        }
      `}</style>
      
      <div className="auth-page">
        {/* Overlay */}
        <div className="auth-overlay" />

        {/* Decorative elements */}
        {decorations.map((dec, i) => (
          <div
            key={i}
            className="auth-decoration"
            style={{
              left: dec.left,
              bottom: dec.bottom,
              top: dec.top,
              fontSize: `${dec.size}px`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {dec.emoji}
          </div>
        ))}

        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="auth-particle"
            style={{
              left: `${particle.left}%`,
              bottom: '-10px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float-up ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Card */}
        <div className="auth-card">
          {/* Title */}
          <h1 className="auth-title">Mystic Garden Pro</h1>
          <p className="auth-subtitle">🌿 Aventura Mágica de Gemas 🌿</p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Iniciar Sesión
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? '✨ Cargando...' : isLogin ? '✨ Entrar al Reino ✨' : '🌟 Crear Cuenta 🌟'}
            </button>
          </form>

          {/* Toggle text */}
          <p className="auth-toggle">
            {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle-link">
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
