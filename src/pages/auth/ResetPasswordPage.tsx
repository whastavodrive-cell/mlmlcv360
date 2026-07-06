import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { useBackend } from '@/lib/backend';
import { useConfig } from '@/store/configStore';
import { LogoWithText } from '@/components/Logo';
import { Eye, EyeOff, Lock, ArrowRight, CircleCheck as CheckCircle, ShieldAlert, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const session = await backend.auth.getSession();
      if (!cancelled) {
        const isRecovery = !!(session) &&
          (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery'));
        setSessionValid(!!(session && isRecovery));
        setChecking(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [backend.auth]);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4;
  const strengthLabels = ['', 'Muy corta', 'Corta', 'Aceptable', 'Segura'];
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; }
    if (password !== confirm) { toast.error('Las contraseñas no coinciden'); return; }
    setLoading(true);
    const { error } = await backend.auth.updatePassword(password);
    setLoading(false);
    if (error) { toast.error('Error al actualizar contraseña'); return; }
    setDone(true);
    toast.success('Contraseña actualizada correctamente');
    setTimeout(() => navigate('/dashboard'), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Link to="/" className="mb-10">
        <LogoWithText value={logoValue} fallbackText={companyName} size="w-9 h-9" textClass="font-bold text-foreground" />
      </Link>

      <div className="w-full max-w-[380px]">
        {checking ? (
          <div className="text-center py-16">
            <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Verificando enlace de recuperación...</p>
          </div>
        ) : !sessionValid ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl">
            <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
              <ShieldAlert className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2">Enlace inválido</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              El enlace de recuperación ha expirado o no es válido. Solicita uno nuevo desde la pantalla de inicio de sesión.
            </p>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
              Volver al inicio de sesión <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : done ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2">¡Contraseña actualizada!</h2>
            <p className="text-sm text-muted-foreground">Redirigiendo a tu panel en unos segundos...</p>
            <div className="mt-5 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-[shrink_2.5s_linear_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-black text-foreground mb-1.5">Nueva contraseña</h2>
              <p className="text-sm text-muted-foreground">Elige una contraseña segura de al menos 8 caracteres.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Nueva contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-9 pr-10 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary focus:bg-card transition-all placeholder:text-muted-foreground/60"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', strength >= i ? strengthColors[strength] : 'bg-muted')} />
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{strengthLabels[strength]}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={cn(
                      'w-full pl-9 pr-4 py-2.5 bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60',
                      confirm && confirm !== password ? 'border-destructive' : 'border-border focus:border-primary focus:bg-card'
                    )}
                  />
                </div>
                {confirm && confirm !== password && (
                  <p className="text-destructive text-xs mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirm || password !== confirm}
                className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-lg shadow-primary/20 mt-2"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Actualizar contraseña</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-primary font-medium hover:underline">← Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}
