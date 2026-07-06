import { useState } from 'react';
import { Link, useNavigate, Navigate } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBackend } from '@/lib/backend';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useConfig } from '@/store/configStore';
import { LogoWithText } from '@/components/Logo';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Sun, Moon, X, CircleCheck as CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Correo invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

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
  const googleOAuthEnabled = company.google_oauth_enabled === 'true';

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
        ? 'Correo o contrasena incorrectos.'
        : result.error === 'Email not confirmed'
        ? 'Correo no confirmado. Contacta al administrador.'
        : result.error;
      toast.error(msg);
      setLoading(false);
    } else {
      if (data.remember) localStorage.setItem('mlm360-remembered-email', data.email);
      else localStorage.removeItem('mlm360-remembered-email');
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await backend.auth.signInWithOAuth('google');
    if (result.error) { toast.error('Error al conectar con Google'); setGoogleLoading(false); }
    else if (result.url) window.location.href = result.url;
  };

  const handleForgot = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true);
    const result = await backend.auth.resetPassword(forgotEmail);
    if (result.error) toast.error('Error al enviar el correo');
    else setForgotSent(true);
    setForgotLoading(false);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* Left panel — logo only, links back to home */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative bg-[#05101d] flex-col items-center justify-center flex-shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 via-transparent to-cyan-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
        </div>
        <Link to="/" className="relative z-10">
          <LogoWithText value={logoValue} fallbackText={companyName} size="w-16 h-16" textClass="text-3xl font-bold text-white" />
        </Link>
      </div>

      {/* Right panel — form, scrollable */}
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
            <Link to="/registro" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Crear cuenta
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-foreground mb-1">Bienvenido</h1>
              <p className="text-muted-foreground text-sm">Accede a tu cuenta para continuar.</p>
            </div>

            {/* Google OAuth */}
            {googleOAuthEnabled && (
              <>
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full border border-border hover:bg-muted py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2.5 text-sm font-medium text-foreground disabled:opacity-50 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {googleLoading ? 'Conectando...' : 'Continuar con Google'}
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">o con correo</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Correo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" {...register('email')} placeholder="tu@correo.com"
                    className={cn('w-full pl-9 pr-3 py-2.5 bg-muted border rounded-xl text-foreground text-sm placeholder:text-muted-foreground outline-none transition-colors',
                      errors.email ? 'border-destructive' : 'border-border focus:border-primary')} />
                </div>
                <div className="h-5 flex items-center mt-0.5">
                  {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Contrasena</label>
                  <button type="button" onClick={() => setForgotOpen(true)} className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Olvidaste?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                    className={cn('w-full pl-9 pr-10 py-2.5 bg-muted border rounded-xl text-foreground text-sm placeholder:text-muted-foreground outline-none transition-colors',
                      errors.password ? 'border-destructive' : 'border-border focus:border-primary')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="h-5 flex items-center mt-0.5">
                  {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" {...register('remember')} id="remember" className="rounded border-border w-4 h-4 cursor-pointer" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Mantener sesion</label>
              </div>

              <div className="pt-3">
                <button type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Acceder'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary font-semibold hover:text-primary/80 transition-colors">Registrate gratis</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Recuperar contrasena</h3>
              <button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(''); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {forgotSent ? (
              <div className="text-center py-2 space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Revisa tu correo <strong className="text-foreground">{forgotEmail}</strong>.</p>
                <button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(''); }} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Entendido
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">Ingresa tu correo y te enviaremos el enlace.</p>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="tu@correo.com"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground mb-4" />
                <div className="flex gap-2">
                  <button onClick={() => setForgotOpen(false)} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</button>
                  <button onClick={handleForgot} disabled={forgotLoading || !forgotEmail} className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {forgotLoading ? 'Enviando...' : 'Enviar'}
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
