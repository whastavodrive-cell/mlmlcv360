import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate, useSearchParams } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBackend, useDatabase, useStorage } from '@/lib/backend';
import { useAuthStore } from '@/store/authStore';
import { useConfig, formatPrice } from '@/store/configStore';
import { toast } from 'sonner';
import {
  Eye, EyeOff, CircleCheck as CheckCircle,
  ArrowRight, User, Mail, Lock,
  Loader as Loader2, CircleAlert as AlertCircle,
  Camera, CreditCard, TrendingUp, Globe, Shield, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoWithText } from '@/components/Logo';

const step1Schema = z.object({
  full_name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password: z.string(),
  referral_code: z.string().optional(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
});

type Step1Data = z.infer<typeof step1Schema>;

function translateAuthError(msg: string): string {
  const m = (msg || '').toLowerCase();
  if (m.includes('already registered') || m.includes('user already exists') || m.includes('email already'))
    return 'Este correo ya está registrado. Intenta iniciar sesión.';
  if (m.includes('invalid email') || m.includes('email address') || m.includes('is invalid'))
    return 'El correo electrónico no es válido. Usa un correo real como nombre@gmail.com.';
  if (m.includes('rate limit') || m.includes('too many') || m.includes('exceeded'))
    return 'Demasiados intentos. Espera unos minutos antes de intentarlo de nuevo.';
  if (m.includes('password') && (m.includes('weak') || m.includes('short')))
    return 'La contraseña es muy débil. Usa al menos 8 caracteres combinando letras y números.';
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to'))
    return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
  if (m.includes('signup') && m.includes('disabled'))
    return 'El registro está temporalmente deshabilitado. Intenta más tarde.';
  return 'Ocurrió un error al crear la cuenta. Por favor intenta de nuevo.';
}

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

const leftStats = [
  { value: '12K+', label: 'Afiliados activos', icon: TrendingUp },
  { value: 'S/ 2.8M', label: 'En comisiones pagadas', icon: CreditCard },
  { value: '+340%', label: 'Crecimiento anual', icon: Zap },
];

export default function RegisterPage() {
  const { user } = useAuthStore();
  const backend = useBackend();
  const database = useDatabase();
  const storage = useStorage();
  const { plans, currency, currencySymbol, exchangeRate, company, logoValue, loading: configLoading } = useConfig();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [formData, setFormData] = useState<Step1Data | null>(null);
  const [dupError, setDupError] = useState<{ email?: string }>({});
  const [selectedPlanSlug, setSelectedPlanSlug] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const showPlans = configLoading ? false : company.register_show_plans !== 'false';
  const requirePlan = company.register_require_plan === 'true';
  const defaultPlanSlug = company.register_default_plan || '';
  const companyName = company.company_name || 'MLM 360';

  const activePlans = plans
    .filter(p => p.is_active)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const steps = showPlans
    ? [{ n: 1, label: 'Datos' }, { n: 2, label: 'Plan' }, { n: 3, label: 'Confirmar' }]
    : [{ n: 1, label: 'Datos' }, { n: 2, label: 'Confirmar' }];

  const confirmStepN = showPlans ? 3 : 2;

  useEffect(() => {
    const planSlug = searchParams.get('plan') || '';
    if (planSlug) {
      setSelectedPlanSlug(planSlug);
      return;
    }
    if (!showPlans) {
      const auto =
        (defaultPlanSlug && activePlans.find(p => p.slug === defaultPlanSlug)) ? defaultPlanSlug
        : activePlans.find(p => p.is_free || Number(p.price) === 0)?.slug
        ?? activePlans[0]?.slug
        ?? '';
      setSelectedPlanSlug(auto);
    }
  }, [searchParams, activePlans.length, showPlans, defaultPlanSlug]);

  if (user) return <Navigate to="/dashboard" />;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { referral_code: searchParams.get('ref') || '' },
  });

  const emailVal = watch('email');

  useEffect(() => {
    if (!emailVal || !emailVal.includes('@')) {
      setDupError(p => ({ ...p, email: undefined }));
      return;
    }
    const t = setTimeout(async () => {
      const result = await database.rpc<{ email_exists: boolean }>('check_user_exists', { p_username: '', p_email: emailVal });
      const data = result.data && !Array.isArray(result.data) ? result.data : null;
      if (data?.email_exists) setDupError(p => ({ ...p, email: 'Este correo ya está registrado' }));
      else setDupError(p => ({ ...p, email: undefined }));
    }, 600);
    return () => clearTimeout(t);
  }, [emailVal, database]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('La imagen no debe superar 3 MB'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleStep1 = async (data: Step1Data) => {
    if (dupError.email) { toast.error('El correo ya está registrado'); return; }
    setValidating(true);
    const result = await database.rpc<{ email_exists: boolean }>('check_user_exists', { p_username: '', p_email: data.email });
    setValidating(false);
    const check = result.data && !Array.isArray(result.data) ? result.data : null;
    if (check?.email_exists) {
      setDupError({ email: 'Este correo ya está registrado' });
      toast.error('El correo ya está registrado');
      return;
    }
    setFormData(data);
    setStep(showPlans ? 2 : confirmStepN);
  };

  const handleGoToConfirm = () => {
    if (showPlans && requirePlan && !selectedPlanSlug) {
      toast.error('Debes seleccionar un plan para continuar');
      return;
    }
    setStep(confirmStepN);
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    const planSlug = selectedPlanSlug || defaultPlanSlug || activePlans.find(p => p.is_free || Number(p.price) === 0)?.slug || activePlans[0]?.slug || '';
    if (showPlans && requirePlan && !planSlug) {
      toast.error('Debes seleccionar un plan');
      setStep(showPlans ? 2 : 1);
      return;
    }
    const selectedPlan = activePlans.find(p => p.slug === planSlug);
    const isFree = !planSlug || !selectedPlan || selectedPlan.is_free || Number(selectedPlan.price) === 0;
    setLoading(true);
    const refCode = (formData.referral_code || searchParams.get('ref') || '').trim().toUpperCase();
    const signUpResult = await backend.auth.signUp(formData.email, formData.password, {
      full_name: formData.full_name,
      plan: planSlug,
      referral_code: refCode,
    });
    if (signUpResult.error) {
      toast.error(translateAuthError(signUpResult.error));
      setLoading(false);
      return;
    }
    const userId = signUpResult.session?.user?.id;
    const hasSession = !!signUpResult.session;
    if (avatarFile && userId) {
      try {
        const ext = avatarFile.name.split('.').pop() || 'jpg';
        const path = `${userId}/avatar.${ext}`;
        const uploadResult = await storage.upload('avatars', path, avatarFile);
        if (uploadResult.url) {
          await database.update('profiles', userId, { avatar_url: uploadResult.url, updated_at: new Date().toISOString() });
        }
      } catch { /* best-effort */ }
    }
    setLoading(false);
    if (!hasSession) {
      if (!isFree && planSlug) {
        toast.success('¡Cuenta creada! Confirma tu correo y luego completa el pago.');
        navigate(`/pago?plan=${planSlug}`);
      } else {
        toast.success('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.');
        navigate('/login');
      }
      return;
    }
    if (!isFree && planSlug) {
      toast.success('¡Cuenta creada! Completa el pago para activar tu plan.');
      navigate(`/pago?plan=${planSlug}`);
    } else {
      toast.success(`¡Bienvenido a ${companyName}! Tu cuenta está lista.`);
      navigate('/dashboard');
    }
  };

  const passwordVal = watch('password') || '';
  const strength = passwordVal.length === 0 ? 0 : passwordVal.length < 6 ? 1 : passwordVal.length < 8 ? 2 : passwordVal.length < 12 ? 3 : 4;
  const strengthLabels = ['', 'Muy corta', 'Débil', 'Aceptable', 'Segura'];
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left Panel ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[120px]" />

        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl">{companyName}</span>
            </Link>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
              Construye tu libertad<br />financiera con <span className="text-primary">MLM 360</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-10">
              Únete a miles de emprendedores latinos que ya están generando ingresos recurrentes con nuestro sistema multinivel.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {leftStats.map(s => (
                <div key={s.label}>
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-black text-white">{s.value}</span>
                  </div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <img
                  src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="María Torres"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <div className="text-sm font-bold text-white">María Torres</div>
                  <div className="text-xs text-slate-400">Rango Diamante · Lima</div>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "En 8 meses pasé de ganar S/ 800 a S/ 12,000 mensuales. El sistema de comisiones es transparente y los pagos siempre llegan puntual."
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-green-400" /> Datos seguros
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Globe className="w-4 h-4 text-blue-400" /> 8 países
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-border">
          <Link to="/" className="lg:hidden flex items-center gap-2.5">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-lg text-foreground" />
          </Link>
          <div className="hidden lg:block" />
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-10 py-8">
          <div className="w-full max-w-md">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1 mb-10">
              {steps.map((s, i) => (
                <div key={s.n} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      step > s.n ? 'bg-green-500 text-white' :
                      step === s.n ? 'bg-primary text-white ring-4 ring-primary/20' :
                      'bg-muted text-muted-foreground',
                    )}>
                      {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                    </div>
                    <span className={cn('text-[11px] mt-2 whitespace-nowrap', step === s.n ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn('w-12 sm:w-16 h-0.5 mx-2 mb-5 rounded-full transition-colors', step > s.n ? 'bg-green-500' : 'bg-border')} />
                  )}
                </div>
              ))}
            </div>

            {/* ── Step 1: Datos ── */}
            {step === 1 && (
              <div className="bg-card border border-border rounded-2xl p-7 sm:p-8 shadow-sm">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-foreground mb-1">Crea tu cuenta</h2>
                  <p className="text-sm text-muted-foreground">Rápido, seguro y sin compromisos.</p>
                </div>

                {/* Google button first */}
                <button
                  type="button"
                  onClick={async () => {
                    const ref = (watch('referral_code') || searchParams.get('ref') || '').trim();
                    const result = await backend.auth.signInWithOAuth('google');
                    if (result.url) {
                      const url = new URL(result.url);
                      if (ref) url.searchParams.set('referral_code', ref);
                      window.location.href = url.toString();
                    }
                  }}
                  className="w-full border border-border hover:bg-muted/50 py-3 rounded-xl transition-colors flex items-center justify-center gap-3 text-sm font-semibold text-foreground mb-6"
                >
                  <GoogleIcon /> Continuar con Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium">o regístrate con email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSubmit(handleStep1)} className="space-y-4">
                  {/* Avatar */}
                  <div className="flex justify-center mb-2">
                    <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                        <Camera className="w-3 h-3" />
                      </div>
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center -mt-1 mb-2">Foto de perfil (opcional)</p>

                  {/* Full name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Nombre completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input {...register('full_name')} placeholder="Tu nombre"
                        className={cn('w-full pl-9 pr-3 py-2.5 bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60',
                          errors.full_name ? 'border-destructive' : 'border-border focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]')} />
                    </div>
                    {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Correo electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input {...register('email')} type="email" placeholder="tu@correo.com"
                        className={cn('w-full pl-9 pr-3 py-2.5 bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60',
                          errors.email || dupError.email ? 'border-destructive' : 'border-border focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]')} />
                    </div>
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    {!errors.email && dupError.email && (
                      <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {dupError.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                        className={cn('w-full pl-9 pr-10 py-2.5 bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60',
                          errors.password ? 'border-destructive' : 'border-border focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]')} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordVal.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', strength >= i ? strengthColors[strength] : 'bg-muted')} />
                          ))}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{strengthLabels[strength]}</p>
                      </div>
                    )}
                    {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Confirmar contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input {...register('confirm_password')} type={showPassword ? 'text' : 'password'} placeholder="Repite tu contraseña"
                        className={cn('w-full pl-9 pr-3 py-2.5 bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60',
                          errors.confirm_password ? 'border-destructive' : 'border-border focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]')} />
                    </div>
                    {errors.confirm_password && <p className="text-destructive text-xs mt-1">{errors.confirm_password.message}</p>}
                  </div>

                  {/* Referral code */}
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wide mb-1.5">
                      Código de referido <span className="text-muted-foreground font-normal">(opcional)</span>
                    </label>
                    <input {...register('referral_code')} placeholder="Ej: GUST001"
                      className="w-full px-3 py-2.5 bg-muted/50 border border-border focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)] rounded-xl text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60" />
                    {searchParams.get('ref') && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Código aplicado: {searchParams.get('ref')}
                      </p>
                    )}
                  </div>

                  <button type="submit" disabled={validating || !!dupError.email}
                    className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-lg shadow-primary/20 mt-2">
                    {validating
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Validando...</>
                      : <>Continuar <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>
            )}

            {/* ── Step 2: Plan (only when showPlans) ── */}
            {step === 2 && showPlans && formData && (
              <div className="bg-card border border-border rounded-2xl p-7 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-foreground mb-1">Elige tu plan</h2>
                  <p className="text-sm text-muted-foreground">
                    {requirePlan ? 'Selecciona un plan para comenzar.' : 'Elige un plan o continúa con el gratuito.'}
                  </p>
                </div>

                <div className="space-y-3 mb-6 max-h-[340px] overflow-y-auto pr-1">
                  {activePlans.map(plan => {
                    const isFree = plan.is_free || Number(plan.price) === 0;
                    const isSelected = selectedPlanSlug === plan.slug;
                    return (
                      <button key={plan.id} type="button"
                        onClick={() => setSelectedPlanSlug(isSelected && !requirePlan ? '' : plan.slug)}
                        className={cn('w-full text-left p-4 rounded-xl border-2 transition-all',
                          isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:border-muted-foreground/40')}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-foreground">{plan.name}</span>
                              {plan.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">{plan.badge}</span>}
                              {isFree && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">Gratis</span>}
                            </div>
                            {plan.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{plan.description}</p>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-black text-foreground">
                              {isFree ? 'Gratis' : formatPrice(plan.price, currency, currencySymbol, exchangeRate)}
                            </div>
                            {!isFree && <div className="text-[11px] text-muted-foreground">/mes</div>}
                          </div>
                        </div>
                        {isSelected && plan.features?.length > 0 && (
                          <ul className="mt-3 space-y-1 border-t border-border/50 pt-3">
                            {plan.features.slice(0, 4).map((f: string) => (
                              <li key={f} className="flex items-center gap-1.5 text-xs text-foreground">
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border border-border hover:bg-muted py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    Atrás
                  </button>
                  <button type="button" onClick={handleGoToConfirm}
                    className="flex-1 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Confirm step ── */}
            {step === confirmStepN && formData && (
              <div className="bg-card border border-border rounded-2xl p-7 sm:p-8 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                      : <CheckCircle className="w-7 h-7 text-primary" />}
                  </div>
                  <h2 className="text-xl font-black text-foreground mb-1">¡Todo listo!</h2>
                  <p className="text-sm text-muted-foreground">Revisa tu información antes de crear la cuenta.</p>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-0 divide-y divide-border/50">
                  {[
                    { label: 'Nombre', value: formData.full_name },
                    { label: 'Correo', value: formData.email },
                    ...(selectedPlanSlug
                      ? [{ label: 'Plan', value: activePlans.find(p => p.slug === selectedPlanSlug)?.name || selectedPlanSlug }]
                      : [{ label: 'Plan', value: 'Sin plan (puedes elegir uno más adelante)' }]),
                    ...(formData.referral_code ? [{ label: 'Referido por', value: formData.referral_code }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 first:pt-0 last:pb-0">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-[55%] truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {(() => {
                  const plan = activePlans.find(p => p.slug === selectedPlanSlug);
                  const isFree = !plan || plan.is_free || Number(plan.price) === 0;
                  if (!isFree) return (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        Este plan requiere pago. Serás redirigido a la pasarela de pago al crear tu cuenta.
                      </p>
                    </div>
                  );
                  return (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                      <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {plan ? 'Plan gratuito — tu cuenta se activará de inmediato.' : 'Tu cuenta se creará sin plan activo.'}
                      </p>
                    </div>
                  );
                })()}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(showPlans ? 2 : 1)}
                    className="flex-1 border border-border hover:bg-muted py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    Atrás
                  </button>
                  <button type="button" onClick={handleFinalSubmit} disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20">
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><CheckCircle className="w-4 h-4" /> Crear cuenta</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
