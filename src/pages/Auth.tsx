import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkSession();
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
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: '¡Cuenta creada! 🎉' });
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
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, hsl(270 50% 8%) 0%, hsl(250 50% 5%) 100%)'
      }}
    >
      {/* Background glow effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at top, hsl(280 60% 15%) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, hsl(200 60% 10%) 0%, transparent 50%)
          `
        }}
      />

      {/* Animated background particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${280 + Math.random() * 60} 70% 60% / 0.3)`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Main card */}
      <div 
        className="w-full max-w-md relative z-10 p-8 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(270 40% 12%) 0%, hsl(270 40% 15%) 50%, hsl(270 40% 12%) 100%)',
          boxShadow: '0 0 20px hsl(280 70% 60% / 0.2), 0 0 60px hsl(280 70% 60% / 0.1), inset 0 1px 0 hsl(60 30% 96% / 0.1)',
          border: '1px solid hsl(280 70% 60% / 0.3)',
        }}
      >
        {/* Card glow overlay */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 20%, hsl(280 100% 70% / 0.3), transparent 40%)'
          }}
        />

        {/* Logo */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8" style={{ color: 'hsl(280 70% 60%)' }} />
            <h1 
              className="font-cinzel text-4xl font-bold"
              style={{
                background: 'linear-gradient(to right, #f472b6, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Bloom & Gem
            </h1>
            <Sparkles className="w-8 h-8" style={{ color: 'hsl(320 70% 55%)' }} />
          </div>
          <p style={{ color: 'hsl(60 20% 70%)' }}>Aventura Mística de Gemas</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
            />
          </div>
          
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-lg py-4 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              fontFamily: "'Cinzel', serif",
              background: 'linear-gradient(135deg, hsl(280 70% 60%) 0%, hsl(320 70% 55%) 100%)',
              boxShadow: '0 4px 20px hsl(280 70% 60% / 0.4), 0 0 40px hsl(280 70% 60% / 0.2), inset 0 1px 0 hsl(60 30% 96% / 0.2)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cargando...
              </span>
            ) : (
              isLogin ? '✨ Entrar al Reino ✨' : '🌟 Crear Cuenta 🌟'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-6 text-center relative z-10" style={{ color: 'hsl(60 20% 70%)' }}>
          {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold transition-colors"
            style={{ color: 'hsl(280 70% 60%)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(320 70% 55%)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(280 70% 60%)'}
          >
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>

        {/* Decorative elements */}
        <div className="absolute -top-3 -left-3 text-2xl">🌸</div>
        <div className="absolute -top-3 -right-3 text-2xl">💎</div>
        <div className="absolute -bottom-3 -left-3 text-2xl">🦋</div>
        <div className="absolute -bottom-3 -right-3 text-2xl">✨</div>
      </div>
    </div>
  );
};

export default Auth;
