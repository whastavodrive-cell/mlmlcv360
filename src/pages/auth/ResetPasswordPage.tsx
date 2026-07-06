import { useState, useEffect } from 'react';
import { useBackend } from '@/lib/backend';
import { useNavigate } from '@/lib/router';
import { useThemeStore } from '@/store/themeStore';
import { useConfig } from '@/store/configStore';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Sun, Moon, CircleCheck as CheckCircle } from 'lucide-react';
import { LogoWithText } from '@/components/Logo';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { theme, setTheme } = useThemeStore();
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const checkSession = async () => {
      const session = await backend.auth.getSession();
      if (session) setHasSession(true);
      setChecking(false);
    };
    checkSession();

    const unsubscribe = backend.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasSession(true);
        setChecking(false);
      }
    });

    return unsubscribe;
  }, [backend.auth]);

  const handleReset = async () => {
    if (!password || password.length < 8) {
      toast.error('La contrasena debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirm) {
      toast.error('Las contrasenas no coinciden');
      return;
    }
    setLoading(true);
    const result = await backend.auth.updatePassword(password);
    if (result.error) {
      toast.error('Error al actualizar la contrasena. El enlace puede haber expirado.');
    } else {
      setDone(true);
      toast.success('Contrasena actualizada correctamente!');
      setTimeout(() => navigate('/dashboard'), 2500);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-10 h-10" textClass="text-xl font-bold text-foreground" />
          </div>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          {done ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Listo!</h2>
              <p className="text-sm text-muted-foreground">
                Tu contrasena fue actualizada. Seras redirigido al panel...
              </p>
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : !hasSession ? (
            <div className="text-center py-4 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Enlace invalido o expirado</h2>
              <p className="text-sm text-muted-foreground">
                Este enlace de recuperacion no es valido o ya fue utilizado. Solicita uno nuevo.
              </p>
              <button onClick={() => navigate('/login')}
                className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                Volver al inicio de sesion
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-1">Nueva contrasena</h2>
                <p className="text-sm text-muted-foreground">Elige una contrasena segura para tu cuenta.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nueva contrasena</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimo 8 caracteres"
                      autoComplete="new-password"
                      className="w-full pl-9 pr-10 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && password.length < 8 && (
                    <p className="text-destructive text-xs mt-1">Minimo 8 caracteres</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar contrasena</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repite la contrasena"
                      autoComplete="new-password"
                      className={cn(
                        'w-full pl-9 pr-4 py-2.5 bg-muted border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors',
                        confirm && confirm !== password ? 'border-destructive' : 'border-border'
                      )}
                    />
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-destructive text-xs mt-1">Las contrasenas no coinciden</p>
                  )}
                </div>

                <button onClick={handleReset} disabled={loading || password.length < 8 || password !== confirm}
                  className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Actualizando...</>
                    : 'Actualizar contrasena'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
