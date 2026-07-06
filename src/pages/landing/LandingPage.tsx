import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { testimonials, faqItems } from '@/lib/mockData';
import {
  ArrowRight, CircleCheck as CheckCircle, Star, ChevronDown, Shield, Zap,
  Globe, Award, GitBranch, DollarSign, ChartBar as BarChart3, TrendingUp,
  Users, Lock, ShoppingBag, Package,
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

// ── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { label: 'Afiliados activos', value: '12,540+', icon: Users },
  { label: 'Comisiones pagadas', value: 'S/ 2.8M+', icon: DollarSign },
  { label: 'Países con presencia', value: '8 países', icon: Globe },
  { label: 'Crecimiento anual', value: '+340%', icon: TrendingUp },
];

const featureHero = {
  icon: GitBranch,
  title: 'Árbol genealógico en tiempo real',
  desc: 'Visualiza toda tu red de afiliados en un canvas interactivo. Zoom, búsqueda instantánea, expansión multinivel y estadísticas de cada nodo — todo en tiempo real, sin recargas.',
  color: 'text-blue-500',
  bg: 'bg-blue-500/10',
  badge: 'El núcleo del sistema',
};

const featuresGrid = [
  { icon: DollarSign, title: 'Comisiones automáticas', desc: 'Binario y unilevel calculado al instante. Pago quincenal sin trámites.', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: Award, title: 'Sistema de rangos', desc: '6 niveles del Bronce a la Corona, bonos y viajes exclusivos.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: BarChart3, title: 'Reportes avanzados', desc: 'Dashboards en vivo. Exporta en PDF o Excel cuando quieras.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: ShoppingBag, title: 'Tienda integrada', desc: 'Vende físico y digital. Comisiones MLM automáticas en cada compra.', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { icon: Globe, title: 'Multi-moneda', desc: 'Soles y USD con tipo de cambio en tiempo real vía Fixer.io.', color: 'text-teal-500', bg: 'bg-teal-500/10' },
];

const howItWorks = [
  { n: '01', title: 'Crea tu cuenta', desc: 'Regístrate en menos de 5 minutos. Elige tu plan y personaliza tu perfil.', icon: '🚀' },
  { n: '02', title: 'Construye tu red', desc: 'Invita afiliados con tu código único. Gestiona tu estructura fácilmente.', icon: '🌐' },
  { n: '03', title: 'Cobra comisiones', desc: 'Recibe pagos quincenales automáticos en tu cuenta o billetera digital.', icon: '💰' },
];

// ── Embedded store section ───────────────────────────────────────────────────
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
      database.select<ProductCategory>('product_categories', { filter: { status: 'active' }, order: { column: 'sort_order' }, limit: 10 }),
      database.select<Product>('products', { filter: { status: 'active' }, order: { column: 'sort_order' }, limit: 12 }),
    ]);
    setCategories((catsRes.data as ProductCategory[]) || []);
    setProducts((prodsRes.data as Product[]) || []);
    setLoading(false);
  }, [database]);

  useEffect(() => { load(); }, [load]);

  const filtered = activeCat ? products.filter(p => p.category_id === activeCat) : products;

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Tienda MLM360</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-3 tracking-tight leading-tight">
              Productos que generan<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">comisiones automáticas</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base max-w-md">
              Cada compra activa comisiones para toda tu red de afiliados.
            </p>
          </div>
          <Link to="/tienda"
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap self-start sm:self-auto">
            <ShoppingBag className="w-4 h-4" /> Ver tienda completa
            {itemCount > 0 && <span className="bg-white/25 text-white text-xs font-black px-2 py-0.5 rounded-full ml-1">{itemCount}</span>}
          </Link>
        </div>

        {categories.length > 0 && (
          <div className="mb-10">
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
              <button onClick={() => setActiveCat('')} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-all border-2',
                  activeCat === '' ? 'bg-primary border-primary shadow-lg shadow-primary/30 scale-105' : 'bg-card border-border hover:border-primary/40 group-hover:scale-105')}>
                  <ShoppingBag className={cn('w-6 h-6', activeCat === '' ? 'text-white' : 'text-muted-foreground')} />
                </div>
                <span className={cn('text-[11px] font-bold', activeCat === '' ? 'text-primary' : 'text-muted-foreground')}>Todos</span>
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id ? '' : cat.id)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                  <div className={cn('w-16 h-16 rounded-2xl overflow-hidden transition-all border-2',
                    activeCat === cat.id ? 'border-primary shadow-lg shadow-primary/25 scale-105' : 'border-border hover:border-primary/40 group-hover:scale-105')}>
                    {cat.image_url
                      ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-muted flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground" /></div>}
                  </div>
                  <span className={cn('text-[11px] font-bold line-clamp-2 max-w-[72px] text-center',
                    activeCat === cat.id ? 'text-primary' : 'text-muted-foreground')}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {filtered.length > 8 && (
          <div className="text-center mt-10">
            <Link to="/tienda" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted hover:border-primary/40 transition-all text-foreground">
              Ver {filtered.length - 8} productos más <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { plans: allPlans, ranks, currency, currencySymbol, exchangeRate } = useConfig();
  const plans = allPlans.filter(p => p.is_active);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] lg:min-h-[110vh] flex items-center overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-muted/20" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/6 rounded-full blur-[160px] translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -translate-x-1/4 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left copy */}
            <div className="lg:pr-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold mb-8 tracking-wide">
                <Zap className="w-3.5 h-3.5" /> Sistema MLM Empresarial · Perú 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-black text-foreground leading-[1.08] mb-6 tracking-tight">
                Construye tu red.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-blue-500">
                  Multiplica tus ingresos.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-[520px]">
                La plataforma MLM más completa del Perú. Gestiona tu red, automatiza comisiones y escala tu negocio desde un solo lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to={user ? '/dashboard' : '/registro'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25 text-sm">
                  {user ? 'Ir a mi panel' : 'Comenzar gratis'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/tienda"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-2xl hover:bg-muted hover:border-primary/30 transition-all text-sm">
                  <ShoppingBag className="w-4 h-4" /> Explorar tienda
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-green-500" /> SSL 256-bit</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> INDECOPI</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Sin contrato</span>
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Setup 5 min</span>
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="relative hidden lg:block">
              <div className="relative bg-card border border-border/80 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden ring-1 ring-border/50">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border bg-muted/40">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 bg-background/60 rounded-lg px-3 py-1.5 text-xs text-muted-foreground ml-2 border border-border/50">
                    app.mlm360.pe/dashboard
                  </div>
                </div>
                {/* Dashboard UI */}
                <div className="p-5 bg-muted/20">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Ingresos', value: 'S/ 14,200', change: '+18%', color: 'text-blue-600 bg-blue-500/15' },
                      { label: 'Comisiones', value: 'S/ 5,150', change: '+22%', color: 'text-green-600 bg-green-500/15' },
                      { label: 'Afiliados', value: '128', change: '+12', color: 'text-purple-600 bg-purple-500/15' },
                      { label: 'Rango', value: 'Diamante', change: '💎', color: 'text-cyan-600 bg-cyan-500/15' },
                    ].map(item => (
                      <div key={item.label} className="bg-card rounded-2xl p-4 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                        <div className="text-lg font-black text-foreground">{item.value}</div>
                        <div className={cn('text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full inline-block', item.color)}>{item.change}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-card rounded-2xl p-4 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-3 font-medium">Ingresos últimas 8 semanas</div>
                    <div className="flex items-end gap-1.5 h-16">
                      {[35, 52, 48, 68, 55, 78, 65, 88].map((h, i) => (
                        <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 transition-all cursor-pointer" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-5 -left-8 bg-card border border-border rounded-2xl p-4 shadow-xl flex items-center gap-3 w-56 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Nueva comisión</div>
                  <div className="text-base font-black text-green-500">+ S/ 450.00</div>
                </div>
              </div>
              <div className="absolute -top-5 -right-8 bg-card border border-border rounded-2xl p-4 shadow-xl flex items-center gap-3 w-48">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg flex-shrink-0">💎</div>
                <div>
                  <div className="text-xs font-bold text-foreground">Rango alcanzado</div>
                  <div className="text-xs font-bold text-primary">Diamante</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-14 border-t border-border/60">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <s.icon className="w-5 h-5 text-primary" />
                  <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{s.value}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — editorial layout ──────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-muted/30 via-muted/15 to-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Por qué MLM 360</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-4 mb-4 tracking-tight max-w-2xl leading-tight">
              Todo lo que necesitas.<br />En un solo lugar.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Herramientas diseñadas para emprendedores que quieren construir negocios sólidos y escalables.
            </p>
          </div>

          {/* Editorial grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Hero feature card */}
            <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group min-h-[360px]">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
                  {featureHero.badge}
                </div>
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110', featureHero.bg)}>
                  <featureHero.icon className={cn('w-8 h-8', featureHero.color)} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-4 leading-tight">{featureHero.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">{featureHero.desc}</p>
              </div>
              <div className="mt-8">
                <Link to={user ? '/dashboard/red' : '/registro'}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all group/link">
                  {user ? 'Ver mi red' : 'Explorar ahora'} <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* 2 support features */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {featuresGrid.slice(0, 2).map(f => (
                <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/25 hover:shadow-lg transition-all duration-300 group">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110', f.bg)}>
                    <f.icon className={cn('w-6 h-6', f.color)} />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Second row — 3 wide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            {featuresGrid.slice(2).map(f => (
              <div key={f.title} className="bg-card border border-border rounded-2xl p-7 hover:border-primary/25 hover:shadow-lg transition-all duration-300 group">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110', f.bg)}>
                  <f.icon className={cn('w-6 h-6', f.color)} />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">El proceso</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-4 mb-4 tracking-tight">
              Empieza en 3 pasos
            </h2>
            <p className="text-muted-foreground text-lg">De cero a generar ingresos en menos de 10 minutos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30" />
            {howItWorks.map(step => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-primary/8 border border-primary/15 flex items-center justify-center text-4xl shadow-sm">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-lg">
                    {step.n.slice(1)}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKS ────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-muted/20 via-muted/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Sistema de rangos</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-4 mb-4 tracking-tight">
              Del Bronce a la Corona
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Cada nivel desbloquea bonos, beneficios y reconocimientos exclusivos.
            </p>
          </div>
          {ranks.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {ranks.map(r => (
                <div key={r.id} className={cn(
                  'bg-card border-2 rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2 duration-300',
                  r.border_color || 'border-border'
                )}>
                  <div className="text-4xl mb-4">{r.icon}</div>
                  <div className={cn('text-base font-black mb-2', r.color || 'text-foreground')}>{r.name}</div>
                  <div className="text-xs text-muted-foreground mb-1">Bono mensual</div>
                  <div className="text-base font-bold text-foreground">
                    {formatPrice(r.bonus, currency, currencySymbol, exchangeRate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PLANS ────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32" id="planes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Planes</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-4 mb-4 tracking-tight">
              Invierte en tu crecimiento
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Sin costos ocultos. Cancela en cualquier momento.</p>
          </div>
          <div className={cn(
            'grid gap-6 max-w-5xl mx-auto',
            plans.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
            plans.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}>
            {plans.map(plan => {
              const isFree = plan.is_free || plan.price === 0;
              const isCurrent = user && (user as any).plan === plan.slug;
              return (
                <div key={plan.id} className={cn(
                  'relative bg-card rounded-3xl p-8 flex flex-col transition-all hover:shadow-2xl',
                  plan.is_popular
                    ? 'border-2 border-primary shadow-xl shadow-primary/15 md:scale-[1.03]'
                    : 'border border-border hover:border-primary/30'
                )}>
                  {plan.badge && (
                    <div className={cn(
                      'absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg',
                      plan.is_popular ? 'bg-primary text-white' : 'bg-amber-500 text-white'
                    )}>{plan.badge}</div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-4 right-4 text-xs font-black px-3 py-1.5 rounded-full bg-green-500 text-white shadow-lg">Plan Actual</div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="mb-7">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-foreground">
                        {isFree ? 'Gratis' : formatPrice(plan.price, currency, currencySymbol, exchangeRate)}
                      </span>
                      {!isFree && <span className="text-muted-foreground text-sm">/mes</span>}
                    </div>
                    {plan.trial_days > 0 && (
                      <div className="text-xs text-green-600 mt-2 font-bold">{plan.trial_days} días de prueba gratis</div>
                    )}
                  </div>
                  <ul className="space-y-3 flex-1 mb-7">
                    {plan.features.map((f: string) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-green-500/10 text-green-600 border border-green-500/30">
                      <CheckCircle className="w-4 h-4" /> Tu plan actual
                    </div>
                  ) : (
                    <Link
                      to={user ? '/dashboard/mi-plan' : isFree ? `/registro?plan=${plan.slug}` : `/pago?plan=${plan.slug}`}
                      className={cn(
                        'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all',
                        plan.is_popular
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                          : 'border border-border hover:bg-muted hover:border-primary/40 text-foreground'
                      )}>
                      {user ? 'Cambiar plan' : 'Empezar con'} {plan.name} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORE ────────────────────────────────────────────────────────── */}
      <StoreSection />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Testimonios</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-4 mb-4 tracking-tight">
              Historias reales de éxito
            </h2>
            <p className="text-muted-foreground text-lg">
              Personas que transformaron su vida financiera con MLM 360.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1 italic text-sm">"{t.content}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-border" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Gana</div>
                    <div className="text-base font-black text-green-500">{t.earnings}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mt-4 mb-4 tracking-tight">
              Preguntas frecuentes
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div key={i} className={cn(
                'bg-card border rounded-2xl overflow-hidden transition-all duration-200',
                openFaq === i ? 'border-primary/40 shadow-md' : 'border-border'
              )}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 min-h-[64px]"
                >
                  <span className="text-sm font-bold text-foreground">{faq.question}</span>
                  <ChevronDown className={cn(
                    'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                    openFaq === i && 'rotate-180 text-primary'
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/8 rounded-full blur-[140px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
            ¿Listo para transformar<br className="hidden sm:block" /> tu vida financiera?
          </h2>
          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Únete a más de 12,000 afiliados peruanos que ya están construyendo su libertad financiera.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? '/dashboard' : '/registro'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-primary font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-2xl text-sm">
              {user ? 'Ir a mi panel' : 'Crear cuenta gratis'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-colors text-sm">
              Hablar con un asesor
            </Link>
          </div>
          <p className="mt-8 text-white/50 text-sm">Sin contrato. Sin tarjeta de crédito. Comienza hoy.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
