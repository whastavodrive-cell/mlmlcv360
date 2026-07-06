import { useState, useEffect } from 'react';
import { useBackend } from '@/lib/backend';
import { useNavigate, Link } from '@/lib/router';
import { useThemeStore } from '@/store/themeStore';
import { useConfig } from '@/store/configStore';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Sun, Moon, CircleCheck as CheckCircle, KeyRound } from 'lucide-react';
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
    if (!password || password.length < 8) { toast.error('Minimo 8 caracteres'); return; }
    if (password !== confirm) { toast.error('Las contrasenas no coinciden'); return; }
    setLoading(true);
    const result = await backend.auth.updatePassword(password);
    if (result.error) {
      toast.error('Error al actualizar. El enlace puede haber expirado.');
    } else {
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* Left panel — logo only */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative bg-[#05101d] flex-col items-center justify-center flex-shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 via-transparent to-cyan-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
        </div>
        <Link to="/" className="relative z-10">
          <LogoWithText value={logoValue} fallbackText={companyName} size="w-16 h-16" textClass="text-3xl font-bold text-white" />
        </Link>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <Link to="/" className="lg:hidden">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-foreground" />
          </Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Iniciar sesion
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            {done ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Listo!</h1>
                <p className="text-muted-foreground text-sm">Tu contrasena fue actualizada. Redirigiendo...</p>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : !hasSession ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <KeyRound className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Enlace invalido</h1>
                <p className="text-muted-foreground text-sm">Este enlace expiro o ya fue usado. Solicita uno nuevo desde el inicio de sesion.</p>
                <button onClick={() => navigate('/login')} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Ir al inicio de sesion
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-1">Nueva contrasena</h1>
                  <p className="text-muted-foreground text-sm">Elige una contrasena de al menos 8 caracteres.</p>
                </div>

                <div className="space-y-1">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nueva contrasena</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Minimo 8 caracteres" autoComplete="new-password"
                        className={cn('w-full pl-9 pr-10 py-2.5 bg-muted border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors',
                          password.length > 0 && password.length < 8 ? 'border-destructive' : 'border-border')} />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="h-5 flex items-center mt-0.5">
                      {password.length > 0 && password.length < 8 && <p className="text-destructive text-xs">Minimo 8 caracteres</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar contrasena</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                        placeholder="Repite la contrasena" autoComplete="new-password"
                        className={cn('w-full pl-9 pr-4 py-2.5 bg-muted border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors',
                          confirm.length > 0 && confirm !== password ? 'border-destructive' : 'border-border')} />
                    </div>
                    <div className="h-5 flex items-center mt-0.5">
                      {confirm.length > 0 && confirm !== password && <p className="text-destructive text-xs">No coinciden</p>}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={handleReset} disabled={loading || password.length < 8 || password !== confirm}
                      className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                      {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Actualizar contrasena'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
