import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { testimonials, faqItems } from '@/lib/mockData';
import {
  ArrowRight, CircleCheck as CheckCircle, Star, ChevronDown, Shield, Zap,
  Globe, Award, GitBranch, DollarSign, ChartBar as BarChart3, TrendingUp,
  Users, Lock, ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useConfig, formatPrice } from '@/store/configStore';
import { useDatabase } from '@/lib/backend';
import { useCart } from '@/store/cartStore';
import type { Product, ProductCategory } from '@/lib/storeTypes';
import ProductCard from '@/components/store/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

// ── Stats from DB (these will be enhanced with real data) ─────────────────────
const stats = [
  { label: 'Afiliados activos', value: '12,540+', icon: Users },
  { label: 'Comisiones pagadas', value: 'S/ 2.8M+', icon: DollarSign },
  { label: 'Países', value: '8', icon: Globe },
  { label: 'Crecimiento anual', value: '+340%', icon: TrendingUp },
];

// ── Hero feature (core differentiator) ─────────────────────────────────────────
const heroFeature = {
  icon: GitBranch,
  title: 'Árbol genealógico en tiempo real',
  desc: 'Visualiza tu red completa con zoom, búsqueda instantánea y estadísticas por nodo. El núcleo de tu operación MLM.',
  badge: 'Core Feature',
};

// ── Supporting features grid ───────────────────────────────────────────────────
const features = [
  { icon: DollarSign, title: 'Comisiones automáticas', desc: 'Binario y unilevel calculados al instante. Pago quincenal.' },
  { icon: Award, title: 'Sistema de rangos', desc: 'Bonos, viajes y reconocimientos exclusivos por nivel.' },
  { icon: BarChart3, title: 'Reportes en vivo', desc: 'Dashboards con exportación PDF/Excel.' },
  { icon: ShoppingBag, title: 'Tienda integrada', desc: 'Comisiones automáticas en cada venta.' },
  { icon: Globe, title: 'Multi-moneda', desc: 'Soles y USD con tipo de cambio en tiempo real.' },
];

// ── How it works steps ────────────────────────────────────────────────────────
const steps = [
  { n: '01', title: 'Crea tu cuenta', desc: 'Registro en menos de 5 minutos.' },
  { n: '02', title: 'Construye tu red', desc: 'Invita con tu código único.' },
  { n: '03', title: 'Cobra comisiones', desc: 'Pagos quincenales automáticos.' },
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
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Tienda</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">Productos con comisiones</h2>
          </div>
          <Link to="/tienda" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            Ver tienda <ArrowRight className="w-4 h-4" />
            {itemCount > 0 && <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>}
          </Link>
        </div>

        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
            <button onClick={() => setActiveCat('')} className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeCat === '' ? 'bg-primary text-white' : 'bg-card border border-border hover:border-primary/50'
            )}>Todos</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id ? '' : cat.id)} className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                activeCat === cat.id ? 'bg-primary text-white' : 'bg-card border border-border hover:border-primary/50'
              )}>{cat.name}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden"><Skeleton className="aspect-square" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { plans: allPlans, ranks, currency, currencySymbol, exchangeRate } = useConfig();
  const plans = allPlans.filter(p => p.is_active);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO: Clear value proposition, minimal noise ────────────────────────── */}
      <section className="relative pt-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge: Social proof */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
              <Zap className="w-3 h-3" />
              <span>+12,000 afiliados activos</span>
            </div>

            {/* Headline: Bold, specific, benefit-oriented */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
              Construye tu red.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Gana con cada venta.</span>
            </h1>

            {/* Subheadline: Clear explanation */}
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              MLM 360 automatiza tus comisiones, gestiona tu red multinivel y escala tu negocio desde un solo lugar.
            </p>

            {/* CTAs: Primary action prominent */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to={user ? '/dashboard' : '/registro'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm">
                {user ? 'Ir a mi Panel' : 'Crear cuenta gratis'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/planes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors text-sm">
                Ver planes
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-green-500" /> SSL seguro</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-500" /> INDECOPI</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary" /> Sin contrato</span>
            </div>
          </div>

          {/* Stats row: Social proof metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-border">
            {stats.map(s => (
              <div key={s.label}>
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{s.value}</span>
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO FEATURE: Single most important differentiator ────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{heroFeature.badge}</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 mb-4">{heroFeature.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{heroFeature.desc}</p>
                <Link to={user ? '/dashboard/red' : '/registro'}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  {user ? 'Ver mi red' : 'Explorar ahora'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                {/* Simplified tree visualization */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-xl font-bold text-primary">Tú</div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-sm font-bold text-blue-600">I</div>
                      <span className="text-xs text-muted-foreground mt-1">Izq</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center text-sm font-bold text-green-600">D</div>
                      <span className="text-xs text-muted-foreground mt-1">Der</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID: Compact, scannable ───────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Funcionalidades</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">Todo en un solo lugar</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: Simple 3-step ─────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Cómo funciona</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">Empieza en 3 pasos</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {steps.map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 text-lg font-bold text-primary">{s.n}</div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKS: Dynamic from DB ─────────────────────────────────────────────── */}
      {ranks.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Rangos</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">Del Bronce a la Corona</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {ranks.map(r => (
                <div key={r.id} className={cn(
                  'bg-card border rounded-xl px-5 py-3 text-center min-w-[100px]',
                  r.border_color || 'border-border'
                )}>
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className={cn('text-sm font-bold', r.color || 'text-foreground')}>{r.name}</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(r.bonus, currency, currencySymbol, exchangeRate)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PLANS: Dynamic from DB ─────────────────────────────────────────────── */}
      {plans.length > 0 && (
        <section className="py-20 bg-muted/30" id="planes">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Planes</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">Elige tu plan</h2>
            </div>

            <div className={cn(
              'grid gap-4',
              plans.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            )}>
              {plans.map(plan => {
                const isFree = plan.is_free || plan.price === 0;
                const isCurrent = user && (user as any).plan === plan.slug;
                return (
                  <div key={plan.id} className={cn(
                    'bg-card rounded-xl p-6 flex flex-col',
                    plan.is_popular ? 'border-2 border-primary ring-4 ring-primary/10' : 'border border-border'
                  )}>
                    {plan.badge && (
                      <div className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full self-start mb-3 -mt-1">{plan.badge}</div>
                    )}
                    {isCurrent && <div className="text-xs font-bold text-green-600 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-full self-start mb-3 -mt-1">Actual</div>}

                    <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <div className="text-2xl font-bold text-foreground mb-4">
                      {isFree ? 'Gratis' : formatPrice(plan.price, currency, currencySymbol, exchangeRate)}
                      {!isFree && <span className="text-sm font-normal text-muted-foreground">/mes</span>}
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {(plan.features || []).slice(0, 4).map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <div className="text-center text-sm font-medium text-green-600 py-2.5">Tu plan actual</div>
                    ) : (
                      <Link to={user ? '/dashboard/mi-plan' : `/registro?plan=${plan.slug}`}
                        className={cn(
                          'text-center py-2.5 rounded-lg text-sm font-semibold transition-colors',
                          plan.is_popular ? 'bg-primary text-white hover:bg-primary/90' : 'border border-border hover:bg-muted'
                        )}>Comenzar</Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── STORE: Products with commissions ──────────────────────────────────── */}
      <StoreSection />

      {/* ── TESTIMONIALS: Social proof ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Testimonios</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">Historias de éxito</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-500">{t.earnings}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ: Accordion ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((faq, i) => (
              <div key={i} className={cn('bg-card border rounded-xl overflow-hidden', openFaq === i ? 'border-primary/40' : 'border-border')}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
                  <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openFaq === i && 'rotate-180')} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: Final push ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
              <p className="text-white/70 mb-6 max-w-sm mx-auto">Únete a miles de afiliados que ya construyen su libertad financiera.</p>
              <Link to={user ? '/dashboard' : '/registro'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm">
                {user ? 'Ir a mi Panel' : 'Crear cuenta gratis'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
