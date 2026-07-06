import { useState } from 'react';
import { Link, useNavigate, Navigate } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBackend } from '@/lib/backend';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useConfig } from '@/store/configStore';
import { LogoWithText } from '@/components/Logo';
import {
  Eye, EyeOff, Mail, Lock, Sun, Moon, ArrowRight,
  Shield, CircleCheck as CheckCircle, X, TrendingUp, Users, DollarSign, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const GoogleIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const isDark = theme === 'dark';

  if (user) return <Navigate to="/dashboard" />;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: localStorage.getItem('mlm360-remembered-email') || '',
      remember: !!localStorage.getItem('mlm360-remembered-email'),
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await backend.auth.signIn(data.email, data.password);
    if (result.error) {
      const msg = result.error === 'Invalid login credentials'
        ? 'Credenciales incorrectas. Verifica tu correo y contraseña.'
        : result.error === 'Email not confirmed'
        ? 'Tu correo no ha sido confirmado. Contacta al administrador.'
        : result.error;
      toast.error(msg);
      setLoading(false);
    } else {
      if (data.remember) localStorage.setItem('mlm360-remembered-email', data.email);
      else localStorage.removeItem('mlm360-remembered-email');
      toast.success('¡Bienvenido de regreso!');
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await backend.auth.signInWithOAuth('google');
    if (result.error) toast.error('Error al conectar con Google');
    else if (result.url) window.location.href = result.url;
    setGoogleLoading(false);
  };

  const handleForgot = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true);
    const result = await backend.auth.resetPassword(forgotEmail);
    if (result.error) toast.error('Error al enviar el correo de recuperación');
    else { setForgotSent(true); toast.success('Correo de recuperación enviado'); }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Left panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden select-none" style={{ background: 'hsl(222 47% 6%)' }}>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(hsl(213 94% 55%) 1px,transparent 1px),linear-gradient(90deg,hsl(213 94% 55%) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Glow */}
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-auto">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-9 h-9" textClass="text-base font-bold text-white" />
          </Link>

          {/* Center content */}
          <div className="my-auto pt-16 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Sistema MLM #1 del Perú
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
              Gestiona tu red.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Crece sin límites.
              </span>
            </h1>
            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-md">
              La plataforma empresarial para construir negocios MLM sólidos, escalables y rentables.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { icon: Users, label: 'Afiliados', value: '12K+', color: 'text-blue-400' },
                { icon: DollarSign, label: 'Pagado', value: 'S/ 2.8M', color: 'text-green-400' },
                { icon: TrendingUp, label: 'Crecimiento', value: '+340%', color: 'text-amber-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 border border-white/8 bg-white/4">
                  <Icon className={cn('w-4 h-4 mb-2', color)} />
                  <div className="text-lg font-black text-white leading-none">{value}</div>
                  <div className="text-[11px] text-white/35 mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-2.5">
              {[
                'Árbol genealógico en tiempo real',
                'Comisiones automáticas quincenales',
                'Tienda integrada con MLM automático',
                '6 rangos con bonos exclusivos',
              ].map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-sm text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <p className="text-white/50 text-sm italic leading-relaxed mb-3">
              "En 8 meses alcancé el rango Diamante. El sistema es increíblemente intuitivo y los pagos siempre son puntuales."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-blue-600/40 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">R</div>
              <div>
                <div className="text-sm font-semibold text-white/80">Roberto Mendoza</div>
                <div className="text-[11px] text-white/35">Rango Diamante · Lima, Perú</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: Form ──────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link to="/" className="lg:hidden">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-foreground text-sm" />
          </Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              ¿Sin cuenta?{' '}
              <Link to="/registro" className="text-primary font-semibold hover:underline">Regístrate</Link>
            </span>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-[380px]">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold mb-5">
                <Shield className="w-3 h-3" /> Acceso seguro SSL
              </div>
              <h2 className="text-2xl font-black text-foreground mb-1.5 tracking-tight">Bienvenido de regreso</h2>
              <p className="text-muted-foreground text-sm">Ingresa tus credenciales para acceder a tu panel.</p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-border hover:bg-muted rounded-xl transition-colors text-sm font-medium text-foreground disabled:opacity-50 mb-5"
            >
              {googleLoading ? <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" /> : <GoogleIcon />}
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">o con correo</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="tu@correo.com"
                    className={cn(
                      'w-full pl-9 pr-4 py-2.5 bg-muted/50 border rounded-xl text-foreground text-sm placeholder:text-muted-foreground/60 outline-none transition-all',
                      errors.email ? 'border-destructive' : 'border-border focus:border-primary focus:bg-card focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]'
                    )}
                  />
                </div>
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Contraseña</label>
                  <button type="button" onClick={() => setForgotOpen(true)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className={cn(
                      'w-full pl-9 pr-10 py-2.5 bg-muted/50 border rounded-xl text-foreground text-sm placeholder:text-muted-foreground/60 outline-none transition-all',
                      errors.password ? 'border-destructive' : 'border-border focus:border-primary focus:bg-card focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]'
                    )}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center gap-2.5">
                <input type="checkbox" {...register('remember')} id="remember"
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Recordar mi sesión</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-lg shadow-primary/20 mt-2"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Ingresar al sistema</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Regístrate gratis →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground">Recuperar contraseña</h3>
              <button onClick={() => { setForgotOpen(false); setForgotSent(false); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {forgotSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Correo enviado</h4>
                <p className="text-sm text-muted-foreground mb-5">Revisa tu bandeja de entrada en <strong className="text-foreground">{forgotEmail}</strong></p>
                <button onClick={() => { setForgotOpen(false); setForgotSent(false); }}
                  className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Entendido
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleForgot()}
                  placeholder="tu@correo.com"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground mb-4"
                />
                <div className="flex gap-2.5">
                  <button onClick={() => setForgotOpen(false)}
                    className="flex-1 border border-border rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleForgot} disabled={forgotLoading || !forgotEmail}
                    className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {forgotLoading ? 'Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
