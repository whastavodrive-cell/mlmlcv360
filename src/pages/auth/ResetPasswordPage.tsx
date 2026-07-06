import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { useBackend } from '@/lib/backend';
import { useConfig } from '@/store/configStore';
import { LogoWithText } from '@/components/Logo';
import { Eye, EyeOff, Lock, ArrowRight, CircleCheck as CheckCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const session = await backend.auth.getSession();
      if (!cancelled) {
        const isRecovery = !!(session) && (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery'));
        setValid(!!(session && isRecovery));
        setChecking(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [backend.auth]);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4;
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Mínimo 8 caracteres'); return; }
    if (password !== confirm) { toast.error('No coinciden'); return; }
    setLoading(true);
    const { error } = await backend.auth.updatePassword(password);
    setLoading(false);
    if (error) { toast.error('Error al actualizar'); return; }
    setDone(true);
    toast.success('Contraseña actualizada');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-64 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-sm">
        <Link to="/" className="flex justify-center mb-8">
          <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-foreground" />
        </Link>

        {checking ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Verificando enlace...</p>
          </div>
        ) : !valid ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="font-bold text-foreground mb-2">Enlace inválido</h2>
            <p className="text-sm text-muted-foreground mb-4">Solicita uno nuevo.</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              Volver <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : done ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="font-bold text-foreground mb-1">¡Actualizada!</h2>
            <p className="text-sm text-muted-foreground">Redirigiendo...</p>
            <div className="h-1 bg-muted rounded-full overflow-hidden mt-4">
              <div className="h-full bg-primary rounded-full animate-[shrink_2s_linear_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-bold text-foreground mb-1">Nueva contraseña</h2>
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Nueva contraseña"
                  className="w-full pl-9 pr-10 py-2.5 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className={cn('h-1 flex-1 rounded-full', strength >= i ? strengthColors[strength] : 'bg-muted')} />)}</div>}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPwd ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmar"
                  className={cn('w-full pl-9 pr-3 py-2.5 bg-muted/50 rounded-lg text-sm outline-none border', confirm && confirm !== password ? 'border-destructive' : 'border-border focus:border-primary')} />
              </div>

              <button type="submit" disabled={loading || !password || password !== confirm}
                className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Actualizar</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-primary font-medium">← Volver</Link>
        </p>
      </div>
    </div>
  );
}
