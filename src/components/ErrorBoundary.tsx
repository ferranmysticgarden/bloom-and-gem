import React, { Component, ErrorInfo, ReactNode } from 'react';
import mysticForestBg from '@/assets/mystic-forest-bg.jpg';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearAndReload = () => {
    // Clear localStorage and reload
    localStorage.clear();
    window.location.href = '/auth';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{
            backgroundImage: `url(${mysticForestBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 text-center p-8 rounded-2xl max-w-md w-full"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <div className="text-6xl mb-4">🌿</div>
            <h1
              className="text-2xl font-bold mb-3"
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ¡Oops! Algo salió mal
            </h1>
            <p className="text-white/80 mb-6 text-sm">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la aplicación.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-6 rounded-full font-semibold transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                🔄 Recargar App
              </button>
              <button
                onClick={this.handleClearAndReload}
                className="w-full py-3 px-6 rounded-full font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                🔐 Volver a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;