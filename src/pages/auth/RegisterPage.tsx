import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate, useSearchParams } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBackend, useDatabase, useStorage } from '@/lib/backend';
import { useAuthStore } from '@/store/authStore';
import { useConfig, formatPrice } from '@/store/configStore';
import { toast } from 'sonner';
import { Eye, EyeOff, CircleCheck as CheckCircle, ArrowRight, User, Mail, Lock, Loader as Loader2, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoWithText } from '@/components/Logo';

const step1Schema = z.object({
  full_name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password: z.string(),
  referral_code: z.string().optional(),
}).refine(d => d.password === d.confirm_password, { message: 'No coinciden', path: ['confirm_password'] });

type Step1Data = z.infer<typeof step1Schema>;

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

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('already registered')) return 'Este correo ya está registrado';
  if (m.includes('invalid email')) return 'Correo inválido';
  if (m.includes('rate limit')) return 'Demasiados intentos. Espera unos minutos.';
  return 'Error al crear cuenta. Intenta de nuevo.';
}

export default function RegisterPage() {
  const { user } = useAuthStore();
  const backend = useBackend();
  const database = useDatabase();
  const storage = useStorage();
  const { plans, currency, currencySymbol, exchangeRate, company, logoValue, loading: configLoading } = useConfig();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const companyName = company.company_name || 'MLM 360';

  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [formData, setFormData] = useState<Step1Data | null>(null);
  const [dupError, setDupError] = useState<{ email?: string }>({});
  const [selectedPlan, setSelectedPlan] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const showPlans = configLoading ? false : company.register_show_plans !== 'false';
  const requirePlan = company.register_require_plan === 'true';
  const defaultPlan = company.register_default_plan || '';
  const activePlans = plans.filter(p => p.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const confirmStep = showPlans ? 3 : 2;

  useEffect(() => {
    const planSlug = searchParams.get('plan') || '';
    if (planSlug) { setSelectedPlan(planSlug); return; }
    if (!showPlans) {
      const auto = defaultPlan || activePlans.find(p => p.is_free)?.slug || activePlans[0]?.slug || '';
      setSelectedPlan(auto);
    }
  }, [searchParams, activePlans, showPlans, defaultPlan]);

  if (user) return <Navigate to="/dashboard" />;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { referral_code: searchParams.get('ref') || '' },
  });

  const emailVal = watch('email');
  useEffect(() => {
    if (!emailVal || !emailVal.includes('@')) { setDupError(p => ({ ...p, email: undefined })); return; }
    const t = setTimeout(async () => {
      const result = await database.rpc<{ email_exists: boolean }>('check_user_exists', { p_username: '', p_email: emailVal });
      const data = result.data && !Array.isArray(result.data) ? result.data : null;
      setDupError(p => ({ ...p, email: data?.email_exists ? 'Ya registrado' : undefined }));
    }, 600);
    return () => clearTimeout(t);
  }, [emailVal, database]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('Máx 3MB'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleStep1 = async (data: Step1Data) => {
    if (dupError.email) { toast.error('Correo ya registrado'); return; }
    setValidating(true);
    const result = await database.rpc<{ email_exists: boolean }>('check_user_exists', { p_username: '', p_email: data.email });
    setValidating(false);
    const check = result.data && !Array.isArray(result.data) ? result.data : null;
    if (check?.email_exists) { setDupError({ email: 'Ya registrado' }); toast.error('Correo ya registrado'); return; }
    setFormData(data);
    setStep(showPlans ? 2 : confirmStep);
  };

  const handleFinal = async () => {
    if (!formData) return;
    const planSlug = selectedPlan || defaultPlan || activePlans.find(p => p.is_free)?.slug || activePlans[0]?.slug || '';
    if (showPlans && requirePlan && !planSlug) { toast.error('Selecciona un plan'); setStep(showPlans ? 2 : 1); return; }
    const selectedPlanData = activePlans.find(p => p.slug === planSlug);
    const isFree = !planSlug || !selectedPlanData || selectedPlanData.is_free || Number(selectedPlanData.price) === 0;
    setLoading(true);
    const refCode = (formData.referral_code || searchParams.get('ref') || '').trim().toUpperCase();
    const result = await backend.auth.signUp(formData.email, formData.password, { full_name: formData.full_name, plan: planSlug, referral_code: refCode });
    if (result.error) { toast.error(translateError(result.error)); setLoading(false); return; }
    const userId = result.session?.user?.id;
    const hasSession = !!result.session;
    if (avatarFile && userId) {
      try {
        const ext = avatarFile.name.split('.').pop() || 'jpg';
        const upload = await storage.upload('avatars', `${userId}/avatar.${ext}`, avatarFile);
        if (upload.url) await database.update('profiles', userId, { avatar_url: upload.url, updated_at: new Date().toISOString() });
      } catch {}
    }
    setLoading(false);
    if (!hasSession) {
      if (!isFree && planSlug) { toast.success('¡Cuenta creada! Confirma tu correo.'); navigate(`/pago?plan=${planSlug}`); }
      else { toast.success('¡Cuenta creada! Revisa tu correo.'); navigate('/login'); }
      return;
    }
    if (!isFree && planSlug) { toast.success('¡Cuenta creada! Completa el pago.'); navigate(`/pago?plan=${planSlug}`); }
    else { toast.success(`¡Bienvenido a ${companyName}!`); navigate('/dashboard'); }
  };

  const pwdVal = watch('password') || '';
  const strength = pwdVal.length === 0 ? 0 : pwdVal.length < 6 ? 1 : pwdVal.length < 8 ? 2 : pwdVal.length < 12 ? 3 : 4;
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'];

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
          <h1 className="text-3xl font-bold text-white mb-4">Únete a MLM 360</h1>
          <p className="text-white/50 text-sm mb-8">Crea tu cuenta y empieza a construir tu red.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border">
          <Link to="/" className="lg:hidden">
            <LogoWithText value={logoValue} fallbackText={companyName} size="w-8 h-8" textClass="font-bold text-foreground" />
          </Link>
          <div className="hidden lg:block" />
          <span className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-medium">Inicia sesión</Link>
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            {/* Steps indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[(showPlans ? 1 : 1), (showPlans ? 2 : 2), (showPlans ? 3 : 2)].slice(0, showPlans ? 3 : 2).map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    step > s ? 'bg-green-500 text-white' : step === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {i < (showPlans ? 2 : 1) && <div className={cn('w-12 h-0.5', step > s ? 'bg-green-500' : 'bg-border')} />}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-foreground">Crear cuenta</h2>
                  <p className="text-sm text-muted-foreground">Rápido y seguro.</p>
                </div>

                <button onClick={async () => {
                  const ref = watch('referral_code') || searchParams.get('ref') || '';
                  const result = await backend.auth.signInWithOAuth('google');
                  if (result.url) { const url = new URL(result.url); if (ref) url.searchParams.set('referral_code', ref); window.location.href = url.toString(); }
                }} className="w-full flex items-center justify-center gap-2 py-2.5 border border-border hover:bg-muted rounded-xl text-sm font-medium mb-4">
                  <GoogleIcon /> Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">o</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSubmit(handleStep1)} className="space-y-3">
                  {/* Avatar */}
                  <div className="flex justify-center mb-3">
                    <button type="button" onClick={() => fileRef.current?.click()} className="relative">
                      {avatarPreview ? <img src={avatarPreview} className="w-14 h-14 rounded-full object-cover" /> :
                        <div className="w-14 h-14 rounded-full bg-muted border border-dashed border-border flex items-center justify-center"><User className="w-5 h-5 text-muted-foreground" /></div>}
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center"><Camera className="w-3 h-3" /></div>
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input {...register('full_name')} placeholder="Tu nombre"
                        className={cn('w-full pl-9 pr-3 py-2 bg-muted/50 border rounded-lg text-sm outline-none', errors.full_name ? 'border-destructive' : 'border-border focus:border-primary')} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Correo</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="email" {...register('email')} placeholder="tu@correo.com"
                        className={cn('w-full pl-9 pr-3 py-2 bg-muted/50 border rounded-lg text-sm outline-none', errors.email || dupError.email ? 'border-destructive' : 'border-border focus:border-primary')} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type={showPwd ? 'text' : 'password'} {...register('password')} placeholder="Mínimo 8 caracteres"
                        className={cn('w-full pl-9 pr-10 py-2 bg-muted/50 border rounded-lg text-sm outline-none', errors.password ? 'border-destructive' : 'border-border focus:border-primary')} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwdVal.length > 0 && <div className="flex gap-1 mt-1">{[1,2,3,4].map(i => <div key={i} className={cn('h-1 flex-1 rounded-full', strength >= i ? strengthColors[strength] : 'bg-muted')} />)}</div>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Confirmar</label>
                    <input type={showPwd ? 'text' : 'password'} {...register('confirm_password')} placeholder="Repite"
                      className={cn('w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm outline-none', errors.confirm_password ? 'border-destructive' : 'border-border focus:border-primary')} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Código referido <span className="text-muted-foreground/60">(opcional)</span></label>
                    <input {...register('referral_code')} placeholder="Ej: GUST001"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary" />
                  </div>

                  <button type="submit" disabled={validating || !!dupError.email}
                    className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50">
                    {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Continuar</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Plan selection */}
            {step === 2 && showPlans && formData && (
              <>
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-foreground">Elige tu plan</h2>
                  <p className="text-sm text-muted-foreground">{requirePlan ? 'Selecciona uno para continuar.' : 'O continúa con el gratuito.'}</p>
                </div>

                <div className="space-y-2 mb-5 max-h-64 overflow-y-auto">
                  {activePlans.map(plan => {
                    const isFree = plan.is_free || Number(plan.price) === 0;
                    const isSelected = selectedPlan === plan.slug;
                    return (
                      <button key={plan.id} type="button" onClick={() => setSelectedPlan(isSelected && !requirePlan ? '' : plan.slug)}
                        className={cn('w-full text-left p-4 rounded-xl border-2 transition-all', isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40')}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-foreground">{plan.name}</div>
                            <div className="text-xs text-muted-foreground">{isFree ? 'Gratis' : formatPrice(plan.price, currency, currencySymbol, exchangeRate) + '/mes'}</div>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 border border-border py-2 rounded-xl text-sm hover:bg-muted">Atrás</button>
                  <button onClick={() => setStep(confirmStep)} className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-1">
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* Confirm step */}
            {step === confirmStep && formData && (
              <>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    {avatarPreview ? <img src={avatarPreview} className="w-full h-full rounded-full object-cover" /> : <CheckCircle className="w-6 h-6 text-primary" />}
                  </div>
                  <h2 className="text-lg font-bold text-foreground">¡Todo listo!</h2>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 mb-5 space-y-0 text-sm divide-y divide-border">
                  <div className="flex justify-between py-2"><span className="text-muted-foreground">Nombre</span><span className="font-medium">{formData.full_name}</span></div>
                  <div className="flex justify-between py-2"><span className="text-muted-foreground">Correo</span><span className="font-medium">{formData.email}</span></div>
                  {selectedPlan && <div className="flex justify-between py-2"><span className="text-muted-foreground">Plan</span><span className="font-medium">{activePlans.find(p => p.slug === selectedPlan)?.name}</span></div>}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(showPlans ? 2 : 1)} className="flex-1 border border-border py-2 rounded-xl text-sm hover:bg-muted">Atrás</button>
                  <button onClick={handleFinal} disabled={loading}
                    className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-1 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Crear cuenta</>}
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
