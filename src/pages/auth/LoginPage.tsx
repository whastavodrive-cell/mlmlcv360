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
import { Eye, EyeOff, Mail, Lock, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const isDark = theme === 'dark';

  if (user) return <Navigate to="/dashboard" />;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await backend.auth.signIn(data.email, data.password);
    if (result.error) {
      toast.error(result.error === 'Invalid login credentials' ? 'Credenciales incorrectas' : result.error);
      setLoading(false);
    } else {
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    const result = await backend.auth.signInWithOAuth('google');
    if (result.url) window.location.href = result.url;
    else if (result.error) toast.error('Error al conectar con Google');
  };

  const handleForgot = async () => {
    if (!forgotEmail) return;
    const result = await backend.auth.resetPassword(forgotEmail);
    if (result.error) toast.error('Error al enviar correo');
    else { setForgotSent(true); toast.success('Correo enviado'); }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative" style={{ background: 'hsl(222 47% 6%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(hsl(213 94% 55%) 1px,transparent 1px),linear-gradient(90deg,hsl(213 94% 55%) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="text-white font-bold" />
          </Link>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Gestiona tu red.<br />
            <span className="text-primary">Crece sin límites.</span>
          </h1>

          <p className="text-white/50 text-sm mb-8">La plataforma MLM para negocios escalables.</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[{ v: '12K+', l: 'Afiliados' }, { v: 'S/ 2.8M', l: 'Comisiones' }, { v: '+340%', l: 'Crecimiento' }].map(s => (
              <div key={s.l} className="border border-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-white">{s.v}</div>
                <div className="text-xs text-white/40">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border">
          <Link to="/" className="lg:hidden">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-foreground" />
          </Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              ¿Sin cuenta? <Link to="/registro" className="text-primary font-medium">Regístrate</Link>
            </span>
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground">
              {isDark ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-1">Iniciar sesión</h2>
              <p className="text-sm text-muted-foreground">Accede a tu panel.</p>
            </div>

            <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 py-2.5 border border-border hover:bg-muted rounded-xl text-sm font-medium mb-5">
              <GoogleIcon /> Continuar con Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">o con correo</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Correo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" {...register('email')} placeholder="tu@correo.com"
                    className={cn('w-full pl-9 pr-3 py-2.5 bg-muted/50 border rounded-lg text-sm outline-none transition-all',
                      errors.email ? 'border-destructive' : 'border-border focus:border-primary')} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
                  <button type="button" onClick={() => setForgotOpen(true)} className="text-xs text-primary">¿Olvidaste?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                    className={cn('w-full pl-9 pr-10 py-2.5 bg-muted/50 border rounded-lg text-sm outline-none transition-all',
                      errors.password ? 'border-destructive' : 'border-border focus:border-primary')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Ingresar</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recuperar contraseña</h3>
              <button onClick={() => { setForgotOpen(false); setForgotSent(false); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            {forgotSent ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">Revisa <strong className="text-foreground">{forgotEmail}</strong></p>
                <button onClick={() => { setForgotOpen(false); setForgotSent(false); }} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium">Cerrar</button>
              </div>
            ) : (
              <>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="tu@correo.com"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm mb-3 outline-none focus:border-primary" />
                <div className="flex gap-2">
                  <button onClick={() => setForgotOpen(false)} className="flex-1 border border-border rounded-lg py-2 text-sm">Cancelar</button>
                  <button onClick={handleForgot} disabled={!forgotEmail} className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">Enviar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
