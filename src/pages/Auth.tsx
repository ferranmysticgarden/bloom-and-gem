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
        navigate('/');
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
        setIsLogin(true);
        setPassword('');
        setLoading(false);
        return;
      }
      }
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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
        boxSizing: 'border-box',
        backgroundImage: `url(${mysticForestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
      />

      {/* Decorative elements */}
      {decorations.map((dec, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: dec.left,
            bottom: dec.bottom,
            top: dec.top,
            fontSize: `${dec.size}px`,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {dec.emoji}
        </div>
      ))}

      {/* Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '380px',
          padding: '28px 24px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '2.2rem',
            fontWeight: 700,
            textAlign: 'center',
            margin: '0 0 8px 0',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Mystic Garden Pro
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.95rem',
            margin: '0 0 20px 0',
          }}
        >
          🌿 Aventura Mágica de Gemas 🌿
        </p>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '30px',
            padding: '5px',
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '25px',
              background: isLogin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: isLogin ? 'white' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isLogin ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '25px',
              background: !isLogin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: !isLogin ? 'white' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: !isLogin ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 40px',
              marginTop: '5px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            }}
          >
            {loading ? '✨ Cargando...' : isLogin ? '✨ Entrar al Reino ✨' : '🌟 Crear Cuenta 🌟'}
          </button>
        </form>


        {/* Toggle text */}
        <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '16px' }}>
          {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFD700',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem',
            }}
          >
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>
      </div>

      {/* Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');`}</style>
    </div>
  );
};

export default Auth;