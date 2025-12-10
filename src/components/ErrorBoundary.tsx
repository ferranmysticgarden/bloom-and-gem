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
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'linear-gradient(180deg, #1a0a2e 0%, #16213e 50%, #0f0c29 100%)',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '12px',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ¡Oops! Algo salió mal
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: '14px' }}>
              Ha ocurrido un error inesperado. Por favor, intenta recargar la aplicación.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                🔄 Recargar App
              </button>
              <button
                onClick={this.handleClearAndReload}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                }}
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