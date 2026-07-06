import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Reveal, MouseGlow } from '@/components/landing/Reveal';
import { testimonials, faqItems } from '@/lib/mockData';
import {
  ArrowRight, CircleCheck as CheckCircle, Star, ChevronDown, Shield, Zap, Globe,
  Award, DollarSign, TrendingUp, Users, Lock, ShoppingBag, Bell, Network, CreditCard,
  Sparkles, BarChart3, Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useConfig, formatPrice } from '@/store/configStore';
import { useDatabase } from '@/lib/backend';
import { useCart } from '@/store/cartStore';
import type { Product, ProductCategory } from '@/lib/storeTypes';
import ProductCard from '@/components/store/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

// ── Bento feature grid (dub.co style) ──────────────────────────────────────────
const bentoFeatures = [
  {
    label: 'Comisiones',
    title: 'Gana en multiples niveles',
    desc: '7% comision directa, 4% binaria y 2% unilevel. Todo calculado automaticamente, pagado cada 15 dias.',
    icon: Wallet,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    span: 'md:col-span-2',
  },
  {
    label: 'Red',
    title: 'Visualiza tu red',
    desc: 'Panel genealogico interactivo con zoom y estadisticas en tiempo real.',
    icon: Network,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    span: '',
  },
  {
    label: 'Rangos',
    title: 'Sube de rango',
    desc: 'Bonos progresivos. Cada nivel desbloquea beneficios exclusivos.',
    icon: Award,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    span: '',
  },
  {
    label: 'Tienda',
    title: 'Compra y gana',
    desc: 'Cada compra genera comisiones automaticas para tu red.',
    icon: ShoppingBag,
    color: 'text-primary',
    bg: 'bg-primary/10',
    span: 'md:col-span-2',
  },
];

const statsItems = [
  { value: '12,540+', label: 'Afiliados activos', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: 'S/ 2.8M+', label: 'Comisiones pagadas', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  { value: '8 paises', label: 'Presencia regional', icon: Globe, color: 'text-primary', bg: 'bg-primary/10' },
  { value: '+340%', label: 'Crecimiento anual', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

// ── Store Section ─────────────────────────────────────────────────────────────
function StoreSection() {
  const database = useDatabase();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState('');
  const [loading, setLoading] = useState(true);
  const { itemCount } = useCart();

  const load = useCallback(async () => {
    setLoading(true);
    const [catsRes, prodsRes] = await Promise.all([
      database.select<ProductCategory>('product_categories', { filter: { status: 'active' }, order: { column: 'sort_order' }, limit: 8 }),
      database.select<Product>('products', { filter: { status: 'active' }, order: { column: 'sort_order' }, limit: 8 }),
    ]);
    setCategories((catsRes.data as ProductCategory[]) || []);
    setProducts((prodsRes.data as Product[]) || []);
    setLoading(false);
  }, [database]);

  useEffect(() => { load(); }, [load]);

  const filtered = activeCat ? products.filter(p => p.category_id === activeCat) : products;
  if (!loading && products.length === 0) return null;

  return (
    <section className="section-py relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-dub-grid mask-fade-center opacity-50" />
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Tienda</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Compra y gana <span className="text-gradient-animated">comisiones</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5">Cada compra genera comisiones automaticas para tu red.</p>
          </div>
          <Link to="/tienda" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all shrink-0">
            Ver tienda completa <ArrowRight className="w-4 h-4" />
            {itemCount > 0 && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>}
          </Link>
        </Reveal>

        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
            <button onClick={() => setActiveCat('')} className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
              activeCat === '' ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30'
            )}>Todos</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id ? '' : cat.id)} className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
                activeCat === cat.id ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30'
              )}>{cat.name}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border"><Skeleton className="aspect-square" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Dashboard mockup preview ───────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Browser bar */}
        <div className="bg-muted/50 border-b border-border px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background border border-border rounded-md px-3 py-1 text-[10px] text-muted-foreground text-center truncate">app.mlm360.pe/dashboard</div>
          </div>
        </div>
        {/* Dashboard content */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Comisiones', value: 'S/ 3,240', trend: '+12%', color: 'text-green-500' },
              { label: 'Mi red', value: '48 afiliados', trend: '+3 hoy', color: 'text-blue-500' },
              { label: 'Rango', value: 'Platino', trend: '→ Diamante', color: 'text-amber-500' },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 rounded-lg p-3 border border-border">
                <div className="text-[10px] text-muted-foreground mb-1">{s.label}</div>
                <div className="text-sm font-bold text-foreground leading-tight">{s.value}</div>
                <div className={cn('text-[10px] font-medium mt-0.5', s.color)}>{s.trend}</div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="bg-muted/40 rounded-lg p-3 mb-4 border border-border">
            <div className="flex items-end gap-1 h-16">
              {[30, 50, 40, 70, 55, 80, 65, 90, 75, 95, 85, 100].map((h, i) => (
                <div key={i} className={cn('flex-1 rounded-sm transition-all', i === 11 ? 'bg-primary' : 'bg-primary/20')} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">Comisiones — ultimas 12 semanas</div>
          </div>
          {/* Activity */}
          <div className="space-y-2">
            {[
              { icon: DollarSign, text: 'Comision binaria de Juan P.', val: '+S/120', color: 'text-green-500 bg-green-500/10' },
              { icon: Users, text: 'Nuevo afiliado en tu red', val: '+1', color: 'text-blue-500 bg-blue-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 border border-border">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', item.color)}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-foreground flex-1">{item.text}</span>
                <span className="text-xs font-bold text-green-500">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Floating notifications */}
      <div className="absolute -top-3 -right-3 bg-card border border-green-500/30 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-green-500" />
          <div>
            <div className="text-[10px] font-bold text-foreground">Comision recibida</div>
            <div className="text-[10px] text-green-500 font-bold">+S/ 320.50</div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-3 -left-3 bg-card border border-amber-500/30 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <div>
            <div className="text-[10px] font-bold text-foreground">Nuevo rango</div>
            <div className="text-[10px] text-amber-500 font-bold">Diamante</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const extendedTestimonials = [
  ...testimonials,
  {
    id: '4', name: 'Sandra Palomino', role: 'Emprendedora, Trujillo',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    content: 'La automatizacion de comisiones me ahorro horas de trabajo manual. Ahora me enfoco en expandir mi red.',
    rank: 'platinum', earnings: 'S/ 6,100/mes',
  },
  {
    id: '5', name: 'Diego Ramirez', role: 'Profesional independiente, Piura',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100',
    content: 'Escale de Bronce a Platino en 4 meses. El panel de reportes me ayuda a identificar que parte de mi red necesita atencion.',
    rank: 'platinum', earnings: 'S/ 5,500/mes',
  },
  {
    id: '6', name: 'Luciana Flores', role: 'Comerciante, Ica',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    content: 'El soporte 24/7 es increible. Tuve una duda un domingo y en 15 minutos tenia la respuesta. Eso genera mucha confianza.',
    rank: 'gold', earnings: 'S/ 3,800/mes',
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="w-[300px] shrink-0 bg-card border border-border rounded-xl p-5 mx-2">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.content}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground leading-tight">{t.name}</div>
          <div className="text-xs text-muted-foreground">{t.role}</div>
        </div>
        <div className="text-sm font-bold text-green-500 shrink-0">{t.earnings}</div>
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const row1 = [...extendedTestimonials, ...extendedTestimonials];
  const row2 = [...extendedTestimonials, ...extendedTestimonials].reverse();
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex mb-3 animate-marquee-left">
        {row1.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
      </div>
      <div className="flex animate-marquee-right">
        {row2.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
      </div>
    </div>
  );
}

function StatsCarousel() {
  const items = [...statsItems, ...statsItems];
  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee-left">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-6 shrink-0">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
              <s.icon className={cn('w-5 h-5', s.color)} />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground leading-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { plans: allPlans, ranks, currency, currencySymbol, exchangeRate } = useConfig();
  const plans = allPlans.filter(p => p.is_active);
  const { user } = useAuthStore();
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const glow = glowRef.current;
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.classList.add('active');
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <MouseGlow />
      <div id="mouse-glow" ref={glowRef} className="mouse-glow" />

      <Navbar />

      {/* ── HERO — dub.co style: centered on visible grid ─────────────────────── */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Visible grid — the dub.co signature */}
        <div className="absolute inset-0 -z-10 bg-dub-grid mask-fade-top" />
        {/* Subtle aurora */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[50%] h-[40%] bg-gradient-to-b from-primary/10 via-primary/3 to-transparent rounded-full blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Centered hero */}
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plata MLM lider en Latinoamerica</span>
                <span className="w-px h-3 bg-primary/20" />
                <span className="text-primary/70">Verificado</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
                Construye tu red.<br />
                Cobra comisiones{' '}
                <span className="text-gradient-animated">automaticamente.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-9 leading-relaxed">
                MLM 360 calcula, paga y visualiza tus comisiones en tiempo real. 7% directa, 4% binaria, pago cada 15 dias.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to={user ? '/dashboard' : '/registro'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 active:scale-[0.98] transition-all text-sm">
                  {user ? 'Ir a mi Panel' : 'Empezar gratis'} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/planes"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-medium rounded-lg hover:border-foreground/30 transition-all text-sm">
                  Ver precios
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {[
                  { icon: Lock, text: 'SSL seguro', color: 'text-green-500' },
                  { icon: Shield, text: 'INDECOPI', color: 'text-blue-500' },
                  { icon: CheckCircle, text: 'Sin permanencia', color: 'text-primary' },
                  { icon: CreditCard, text: 'Pago cada 15 dias', color: 'text-amber-500' },
                ].map(item => (
                  <span key={item.text} className="flex items-center gap-1.5">
                    <item.icon className={cn('w-3.5 h-3.5', item.color)} />
                    {item.text}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Dashboard preview */}
          <Reveal delay={500} className="mt-16">
            <DashboardPreview />
          </Reveal>
        </div>
      </section>

      {/* ── STATS CAROUSEL ───────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-muted/20">
        <StatsCarousel />
      </div>

      {/* ── BENTO FEATURES — dub.co style grid ──────────────────────────────── */}
      <section className="section-py relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-dub-grid mask-fade-center opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Diseñado para <span className="text-gradient-animated">escalar</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Cada funcionalidad resuelve un problema real del negocio multinivel.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bentoFeatures.map((block, i) => (
              <Reveal key={block.label} delay={i * 80} className={block.span}>
                <div className="bg-card border border-border rounded-xl p-6 h-full card-lift hover:border-foreground/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', block.bg)}>
                      <block.icon className={cn('w-4 h-4', block.color)} />
                    </div>
                    <span className={cn('text-xs font-semibold uppercase tracking-wider', block.color)}>{block.label}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{block.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{block.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="section-py relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 -z-10 bg-muted/20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              De cero a <span className="text-gradient-animated">comisiones</span> en minutos
            </h2>
            <p className="text-muted-foreground">Sin curva de aprendizaje. Sin configuraciones complicadas.</p>
          </Reveal>

          <Reveal>
            <div className="relative">
              <div className="hidden md:block absolute top-7 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { n: '1', title: 'Elige tu plan', desc: 'Free Trial, Pro o Elite. Cambia cuando quieras, sin penalizacion.', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { n: '2', title: 'Invita con tu codigo', desc: 'Un enlace unico. Tus referidos se suman automaticamente a tu red.', icon: Network, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                  { n: '3', title: 'Recibe comisiones', desc: 'Cada 15 dias directo a tu cuenta. Sin tramites, sin demoras.', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
                ].map(step => (
                  <div key={step.n} className="text-center relative">
                    <div className={cn('w-14 h-14 rounded-xl border-2 flex items-center justify-center mx-auto mb-4 relative z-10 bg-background', step.bg)}>
                      <step.icon className={cn('w-6 h-6', step.color)} />
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1.5">PASO {step.n}</div>
                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RANKS ───────────────────────────────────────────────────────────── */}
      {ranks.filter(r => r.is_active !== false).length > 0 && (
        <section className="section-py relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-dub-grid mask-fade-center opacity-40" />
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -z-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Reveal>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Rangos</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                  Cada nivel, <span className="text-gradient-animated">mas beneficios</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  El sistema de rangos premia tu crecimiento con bonos en efectivo progresivos. Desde el bono de bienvenida Bronce hasta el maximo Corona.
                </p>
                <Link to={user ? '/dashboard/rangos' : '/registro'}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
                  {user ? 'Ver mis rangos' : 'Ver todos los rangos'} <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>

              <Reveal delay={150}>
                <div className="grid grid-cols-2 gap-4">
                  {ranks.filter(r => r.is_active !== false).map(r => (
                    <div key={r.id} className={cn(
                      'bg-card rounded-xl p-6 border transition-all card-lift',
                      r.border_color || 'border-border'
                    )}>
                      <div className="text-4xl mb-4">{r.icon}</div>
                      <div className={cn('font-bold text-lg mb-1', r.color || 'text-foreground')}>{r.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">Bono de rango</div>
                      <div className="text-xl font-bold text-foreground">
                        {formatPrice(r.bonus, currency, currencySymbol, exchangeRate)}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ── PLANS ───────────────────────────────────────────────────────────── */}
      {plans.length > 0 && (
        <section className="section-py relative overflow-hidden border-t border-border" id="planes">
          <div className="absolute inset-0 -z-10 bg-muted/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                <span className="text-gradient-animated">Elige tu plan</span>
              </h2>
              <p className="text-muted-foreground">Comienza gratis, escala cuando crezcas.</p>
            </Reveal>

            <Reveal delay={100}>
              <div className={cn(
                'grid gap-4',
                plans.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              )}>
                {plans.map(plan => {
                  const isFree = plan.is_free || plan.price === 0;
                  const isCurrent = user && (user as any).plan === plan.slug;
                  return (
                    <div key={plan.id} className={cn(
                      'bg-card rounded-xl p-6 flex flex-col relative overflow-hidden transition-all card-lift',
                      plan.is_popular
                        ? 'border-2 border-foreground shadow-lg'
                        : 'border border-border hover:border-foreground/20'
                    )}>
                      {plan.is_popular && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
                        <div className="flex gap-1.5">
                          {plan.badge && (
                            <span className="text-[10px] font-bold text-white bg-foreground px-2 py-0.5 rounded-full">{plan.badge}</span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">Tu plan</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-foreground">
                          {isFree ? 'Gratis' : formatPrice(plan.price, currency, currencySymbol, exchangeRate)}
                        </span>
                        {!isFree && <span className="text-sm font-normal text-muted-foreground">/mes</span>}
                      </div>
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {(plan.features || []).slice(0, 5).map((f: string) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      {isCurrent ? (
                        <div className="text-center text-sm font-semibold text-green-600 py-3 bg-green-500/5 rounded-lg border border-green-500/20">Tu plan actual</div>
                      ) : (
                        <Link to={user ? '/dashboard/mi-plan' : `/registro?plan=${plan.slug}`}
                          className={cn(
                            'text-center py-3 rounded-lg text-sm font-medium transition-all',
                            plan.is_popular
                              ? 'bg-foreground text-background hover:bg-foreground/90'
                              : 'border border-border hover:bg-muted hover:border-foreground/30'
                          )}>
                          {isFree ? 'Comenzar gratis' : 'Activar plan'}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <p className="text-center text-xs text-muted-foreground mt-6">
              <Link to="/planes" className="text-primary font-medium hover:underline">Ver comparacion completa de planes →</Link>
            </p>
          </div>
        </section>
      )}

      {/* ── STORE ───────────────────────────────────────────────────────────── */}
      <StoreSection />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="section-py relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 -z-10 bg-muted/20" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              Miles de afiliados ya <span className="text-gradient-animated">ganan</span>
            </h2>
            <p className="text-muted-foreground">Historias reales de emprendedores latinoamericanos.</p>
          </Reveal>
        </div>
        <TestimonialsCarousel />
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="section-py relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-dub-grid mask-fade-center opacity-40" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              Preguntas <span className="text-gradient-animated">frecuentes</span>
            </h2>
            <p className="text-muted-foreground text-sm">Todo lo que necesitas saber antes de empezar.</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-3">
              {faqItems.map((faq, i) => (
                <div key={i} className={cn(
                  'bg-card border rounded-xl overflow-hidden transition-all',
                  openFaq === i
                    ? 'border-foreground/30 shadow-md'
                    : 'border-border hover:border-foreground/20'
                )}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all text-xs font-bold',
                        openFaq === i ? 'bg-foreground text-background' : 'bg-muted group-hover:bg-foreground/10'
                      )}>
                        {i + 1}
                      </div>
                      <span className="text-base font-semibold text-foreground">{faq.question}</span>
                    </div>
                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openFaq === i && 'rotate-180')} />
                  </button>
                  <div className={cn(
                    'grid transition-all',
                    openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-4 pl-[4rem]">
                        <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA — dub.co style dark section ───────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-dub-grid-dark" />
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[70%] bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-[10%] right-[-20%] w-[50%] h-[60%] bg-gradient-to-bl from-blue-500/15 via-primary/8 to-transparent rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs font-medium text-white/80 mb-8">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Sin tarjeta de credito requerida</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Tu red no espera.<br />
              <span className="text-white/60">Empieza hoy.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-lg mx-auto mb-10 leading-relaxed">
              Unete a emprendedores que ya construyen libertad financiera.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={user ? '/dashboard' : '/registro'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-foreground font-medium rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all shadow-2xl text-base">
                {user ? 'Ir a mi Panel' : 'Crear cuenta gratis'} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/15 transition-all text-base">
                Hablar con ventas
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-white/40">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-white/60" /> Cuenta gratuita</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-white/60" /> Sin permanencia</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-white/60" /> Pago cada 15 dias</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-white/60" /> Soporte 24/7</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
