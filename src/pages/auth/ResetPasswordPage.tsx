import { useState, useEffect } from 'react';
import { useBackend } from '@/lib/backend';
import { useNavigate, Link } from '@/lib/router';
import { useThemeStore } from '@/store/themeStore';
import { useConfig } from '@/store/configStore';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Sun, Moon, CircleCheck as CheckCircle, Shield, Users, DollarSign, TrendingUp, KeyRound } from 'lucide-react';
import { LogoWithText } from '@/components/Logo';
import { cn } from '@/lib/utils';

interface Stats { totalUsers: number; totalPaid: number; activeRanks: number; }

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { theme, setTheme } = useThemeStore();
  const { company, logoValue, currencySymbol } = useConfig();
  const companyName = company.company_name || 'MLM 360';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalPaid: 0, activeRanks: 0 });
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, paidRes, ranksRes] = await Promise.all([
          backend.database.select('profiles', { select: ['id'], count: 'exact' }),
          backend.database.select('commissions', { select: ['amount'], filter: { status: 'paid' } }),
          backend.database.select('ranks', { select: ['id'], filter: { is_active: true } }),
        ]);
        setStats({
          totalUsers: usersRes?.count || 0,
          totalPaid: (paidRes?.data as { amount: number }[] | null)?.reduce((s, c) => s + (c.amount || 0), 0) || 0,
          activeRanks: (ranksRes?.data as unknown[])?.length || 0,
        });
      } catch { /* defaults */ }
    };
    fetchStats();
  }, [backend.database]);

  const handleReset = async () => {
    if (!password || password.length < 8) { toast.error('La contrasena debe tener al menos 8 caracteres'); return; }
    if (password !== confirm) { toast.error('Las contrasenas no coinciden'); return; }
    setLoading(true);
    const result = await backend.auth.updatePassword(password);
    if (result.error) { toast.error('Error al actualizar. El enlace puede haber expirado.'); }
    else { setDone(true); toast.success('Contrasena actualizada!'); setTimeout(() => navigate('/dashboard'), 2000); }
    setLoading(false);
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${Math.round(n / 1000)}K+`;
    return n.toString() || '0';
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative overflow-hidden bg-[#06111f]">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="" className="w-full h-full object-cover opacity-[0.12]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#06111f] via-[#071828]/80 to-[#06111f]" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-10 h-10" textClass="text-xl font-bold text-white" />
            <div className="text-xs text-blue-300/60 ml-0.5">Sistema Empresarial Premium</div>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/20 rounded-full px-4 py-2 text-blue-300 text-xs mb-6">
              <Shield className="w-3.5 h-3.5" /> Conexion encriptada SSL
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Recupera el acceso.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Vuelve al negocio.</span>
            </h1>
            <p className="text-blue-100/50 text-base leading-relaxed mb-10">
              Tu contrasena sera actualizada de forma segura. Elige una nueva y continua.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{formatNumber(stats.totalUsers)}</div>
                <div className="text-xs text-blue-300/50">Afiliados</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <DollarSign className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{currencySymbol}{formatNumber(stats.totalPaid)}</div>
                <div className="text-xs text-blue-300/50">Pagados</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stats.activeRanks || 4}</div>
                <div className="text-xs text-blue-300/50">Rangos</div>
              </div>
            </div>

            <div className="space-y-3">
              {['Enlace temporal por seguridad', 'Datos encriptados de extremo a extremo', 'Sin compromiso de la cuenta'].map(t => (
                <div key={t} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-blue-100/60">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-white/60 text-sm italic mb-3">"Todo el proceso fue rapido y seguro."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">A</div>
              <div>
                <div className="text-sm font-medium text-white">Ana P.</div>
                <div className="text-xs text-blue-300/50">Rango Bronce, Lima</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-foreground" />
          </Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Iniciar sesion</Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            {done ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Listo!</h2>
                <p className="text-muted-foreground text-sm">Tu contrasena fue actualizada. Redirigiendo...</p>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : !hasSession ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <KeyRound className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Enlace invalido</h2>
                <p className="text-muted-foreground text-sm">Este enlace expiro o ya fue usado. Solicita uno nuevo.</p>
                <button onClick={() => navigate('/login')} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Volver al inicio
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-1.5">Nueva contrasena</h2>
                  <p className="text-muted-foreground text-sm">Elige una contrasena segura de al menos 8 caracteres.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nueva contrasena</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimo 8 caracteres" autoComplete="new-password"
                        className="w-full pl-9 pr-10 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors" />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password.length > 0 && password.length < 8 && <p className="text-destructive text-xs mt-1">Minimo 8 caracteres</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar contrasena</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite la contrasena" autoComplete="new-password"
                        className={cn('w-full pl-9 pr-4 py-2.5 bg-muted border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors',
                          confirm && confirm !== password ? 'border-destructive' : 'border-border')} />
                    </div>
                    {confirm && confirm !== password && <p className="text-destructive text-xs mt-1">No coinciden</p>}
                  </div>

                  <button onClick={handleReset} disabled={loading || password.length < 8 || password !== confirm}
                    className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Actualizando...</> : 'Actualizar contrasena'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
