import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(180deg, #1a0a2e 0%, #0f172a 50%, #0a0f1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '20%',
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.6) 0%, rgba(49, 46, 129, 0.4) 50%, rgba(15, 23, 42, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px 32px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(147, 51, 234, 0.2)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <Sparkles style={{ width: '28px', height: '28px', color: '#a855f7' }} />
            <h1
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '32px',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
              }}
            >
              Bloom & Gem
            </h1>
            <Sparkles style={{ width: '28px', height: '28px', color: '#ec4899' }} />
          </div>
          <p style={{ color: 'rgba(216, 180, 254, 0.8)', fontSize: '14px', margin: 0 }}>
            Aventura Mística de Gemas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                height: '52px',
                padding: '0 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                height: '52px',
                padding: '0 48px 0 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(216, 180, 254, 0.6)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
              }}
            >
              {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '56px',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #9333ea 100%)',
              backgroundSize: '200% 100%',
              border: 'none',
              borderRadius: '14px',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              fontFamily: "'Cinzel', serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 10px 30px -5px rgba(147, 51, 234, 0.5)',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Cargando...
              </span>
            ) : (
              isLogin ? '✨ Entrar al Reino ✨' : '🌟 Crear Cuenta 🌟'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(216, 180, 254, 0.7)', fontSize: '14px' }}>
          {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#f472b6',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px',
            }}
          >
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>

        {/* Corner decorations */}
        <span style={{ position: 'absolute', top: '-8px', left: '-8px', fontSize: '20px' }}>🌸</span>
        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '20px' }}>💎</span>
        <span style={{ position: 'absolute', bottom: '-8px', left: '-8px', fontSize: '20px' }}>🦋</span>
        <span style={{ position: 'absolute', bottom: '-8px', right: '-8px', fontSize: '20px' }}>✨</span>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(216, 180, 254, 0.5);
        }
        input:focus {
          border-color: rgba(168, 85, 247, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }
        button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          background-position: 100% 0;
        }
      `}</style>
    </div>
  );
};

export default Auth;
