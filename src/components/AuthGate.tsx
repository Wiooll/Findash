import { useState, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

const mapAuthError = (error: unknown) => {
  if (!(error instanceof Error)) return 'Não foi possível concluir a autenticação.';

  const code = error.message.toLowerCase();
  if (code.includes('auth/popup-closed-by-user')) return 'Login cancelado antes da conclusão.';
  if (code.includes('auth/popup-blocked')) return 'Seu navegador bloqueou o popup. Libere pop-ups e tente novamente.';
  if (code.includes('auth/account-exists-with-different-credential')) {
    return 'Já existe conta com este e-mail em outro provedor.';
  }
  if (code.includes('auth/operation-not-allowed')) {
    return 'Login com Google não habilitado no Firebase.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  }

  return 'Não foi possível concluir a autenticação.';
};

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, loading, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Validando sessão...</p>
      </div>
    );
  }

  if (user) return children;

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Entrar no FinDash</h1>
          <p className="text-sm text-muted-foreground">
            Use sua conta Google para acessar o dashboard com dados isolados por usuário.
          </p>
        </div>

        <div className="space-y-3">
          {error && (
            <div className="text-sm px-3 py-2 rounded-md border border-danger/40 bg-danger/10 text-danger">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => void handleGoogleSignIn()}
            disabled={submitting}
            className="w-full bg-background border border-input text-foreground hover:bg-secondary disabled:opacity-70 disabled:cursor-not-allowed px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-black text-xs font-bold">
              G
            </span>
            {submitting ? 'Conectando...' : 'Entrar com Google'}
          </button>
        </div>
      </div>
    </div>
  );
};
