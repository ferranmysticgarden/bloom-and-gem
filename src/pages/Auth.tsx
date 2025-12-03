import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate floating particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 4 + Math.random() * 4,
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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="auth-container">
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Glassmorphism Card */}
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
            className="auth-button-primary"
          >
            {loading ? '✨ Cargando...' : isLogin ? '✨ Entrar al Reino ✨' : '🌟 Crear Cuenta 🌟'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>o</span>
        </div>

        {/* Google OAuth */}
        <button onClick={handleGoogleLogin} className="auth-button-google">
          <span className="google-icon">G</span>
          Continuar con Google
        </button>

        {/* Toggle text */}
        <p className="auth-toggle-text">
          {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle-link">
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Quicksand:wght@400;600&display=swap');

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #1a3a2e 0%, #1e3a8a 50%, #4c1d95 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Quicksand', sans-serif;
        }

        .auth-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(ellipse at 20% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .particle {
          position: absolute;
          bottom: -20px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          pointer-events: none;
          animation: float-up linear infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
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

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 30px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 10;
        }

        .auth-title {
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(2rem, 8vw, 2.8rem);
          font-weight: 700;
          text-align: center;
          margin: 0 0 8px 0;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
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
          gap: 10px;
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
          font-family: 'Quicksand', sans-serif;
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

        .auth-tab:hover:not(.active) {
          color: rgba(255, 255, 255, 0.9);
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
          font-family: 'Quicksand', sans-serif;
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

        .auth-button-primary {
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

        .auth-button-primary:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
        }

        .auth-button-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          gap: 15px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .auth-divider span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }

        .auth-button-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px 30px;
          background: white;
          border: 2px solid #ddd;
          border-radius: 50px;
          color: #333;
          font-family: 'Quicksand', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-button-google:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .google-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC05 50%, #FBBC05 75%, #34A853 75%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .auth-toggle-text {
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
          font-family: 'Quicksand', sans-serif;
        }

        .auth-toggle-link:hover {
          color: #FFA500;
        }
      `}</style>
    </div>
  );
};

export default Auth;
