import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Reveal, MouseGlow } from '@/components/landing/Reveal';
import { testimonials, faqItems } from '@/lib/mockData';
import { ArrowRight, Check, Star, ChevronDown, Shield, Zap, Globe, Award, DollarSign, TrendingUp, Users, Lock, ShoppingBag, Bell, Network, CreditCard, Sparkles, ChartBar as BarChart3, Wallet, Building2, Target, ChartPie as PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useConfig, formatPrice } from '@/store/configStore';
import { useDatabase } from '@/lib/backend';
import { useCart } from '@/store/cartStore';
import type { Product, ProductCategory } from '@/lib/storeTypes';
import ProductCard from '@/components/store/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const bentoFeatures = [
  { label: 'Comisiones', title: 'Multiples niveles de ingresos', desc: '7% directa, 4% binaria, 2% unilevel. Calculo automatico, pagos quincenales.', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10', span: 'md:col-span-2 md:row-span-2' },
  { label: 'Genealogia', title: 'Tu red en tiempo real', desc: 'Arbol binario interactivo con estadisticas y zoom.', icon: Network, color: 'text-blue-500', bg: 'bg-blue-500/10', span: '' },
  { label: 'Rangos', title: 'Progresion con beneficios', desc: 'Bonos exclusivos por cada nivel alcanzado.', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', span: '' },
  { label: 'Tienda', title: 'Compras que generan ingresos', desc: 'Cada producto activa comisiones automaticas en tu red.', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10', span: 'md:col-span-2' },
];

const statsItems = [
  { value: '12,540+', label: 'Afiliados activos', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: 'S/ 2.8M+', label: 'Comisiones pagadas', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { value: '8', label: 'Paises activos', icon: Globe, color: 'text-primary', bg: 'bg-primary/10' },
  { value: '+340%', label: 'Crecimiento anual', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const steps = [
  { n: '1', title: 'Elige tu plan', desc: 'Selecciona Free, Pro o Elite. Sin permanencia, cambia cuando quieras.', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { n: '2', title: 'Comparte tu enlace', desc: 'Tu codigo unico conecta automaticamente a nuevos afiliados.', icon: Network, color: 'text-primary', bg: 'bg-primary/10' },
  { n: '3', title: 'Recibe comisiones', desc: 'Pago automatico cada 15 dias. Sin tramites, sin demoras.', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STORE SECTION
// ═══════════════════════════════════════════════════════════════════════════════

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
    <section className="relative section-py border-t border-border">
      <div className="absolute inset-0 bg-dub-grid opacity-30 mask-fade-center" />
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-4">
              <ShoppingBag className="w-3.5 h-3.5" />
              Tienda integrada
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Compra y genera <span className="text-gradient-animated">comisiones</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">Cada producto activa comisiones automaticas para toda tu red.</p>
          </div>
          <Link to="/tienda" className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-all group">
            Ver tienda <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {itemCount > 0 && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>}
          </Link>
        </Reveal>

        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
            <button onClick={() => setActiveCat('')} className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
              activeCat === '' ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30'
            )}>Todos</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id ? '' : cat.id)} className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
                activeCat === cat.id ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30'
              )}>{cat.name}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border"><Skeleton className="aspect-square" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PREVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-[720px] mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background border border-border rounded-md px-4 py-1.5 text-xs text-muted-foreground text-center">app.mlm360.pe/dashboard</div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Comisiones', value: 'S/ 3,240', trend: '+12%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Mi red', value: '48', sub: 'afiliados', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Rango', value: 'Platino', sub: '→ Diamante', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map(s => (
              <div key={s.label} className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.bg)}>
                    <s.icon className={cn('w-4 h-4', s.color)} />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                <div className="text-lg font-bold text-foreground">{s.value}</div>
                <div className={cn('text-xs font-medium', s.color)}>{s.trend || s.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-muted/30 rounded-xl p-4 mb-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Comisiones — ultimas 12 semanas</span>
              <span className="text-xs text-primary font-medium">+S/ 890</span>
            </div>
            <div className="flex items-end gap-1 h-20">
              {[30, 50, 40, 70, 55, 80, 65, 90, 75, 95, 85, 100].map((h, i) => (
                <div key={i} className={cn('flex-1 rounded-sm transition-all', i === 11 ? 'bg-primary' : 'bg-primary/25')} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: DollarSign, text: 'Comision binaria recibida', val: '+S/ 120', color: 'text-emerald-500 bg-emerald-500/10' },
              { icon: Users, text: 'Nuevo afiliado: Maria G.', val: 'Red Activa', color: 'text-blue-500 bg-blue-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', item.color)}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-foreground flex-1">{item.text}</span>
                <span className="text-sm font-semibold text-emerald-500">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -right-4 bg-card border border-emerald-500/20 rounded-xl px-4 py-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Notificacion</div>
            <div className="text-sm font-bold text-foreground">+S/ 320.50</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 bg-card border border-amber-500/20 rounded-xl px-4 py-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Nuevo rango</div>
            <div className="text-sm font-bold text-amber-500">Diamante</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

const extendedTestimonials = [
  ...testimonials,
  { id: '4', name: 'Sandra Palomino', role: 'Emprendedora, Trujillo', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'La automatizacion de comisiones me ahorro horas de trabajo manual. Ahora me enfoco en expandir mi red.', rank: 'platinum', earnings: 'S/ 6,100/mes' },
  { id: '5', name: 'Diego Ramirez', role: 'Profesional independiente, Piura', avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'Escale de Bronce a Platino en 4 meses. El panel de reportes me ayuda a identificar que parte de mi red necesita atencion.', rank: 'platinum', earnings: 'S/ 5,500/mes' },
  { id: '6', name: 'Luciana Flores', role: 'Comerciante, Ica', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'El soporte 24/7 es increible. Tuve una duda un domingo y en 15 minutos tenia la respuesta.', rank: 'gold', earnings: 'S/ 3,800/mes' },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="w-[320px] shrink-0 bg-card border border-border rounded-2xl p-6 mx-2 hover:border-primary/30 transition-colors">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.content}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">{t.name}</div>
          <div className="text-xs text-muted-foreground">{t.role}</div>
        </div>
        <div className="text-sm font-bold text-emerald-500">{t.earnings}</div>
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const row1 = [...extendedTestimonials, ...extendedTestimonials];
  const row2 = [...extendedTestimonials, ...extendedTestimonials].reverse();
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex mb-4 animate-marquee-left">
        {row1.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
      </div>
      <div className="flex animate-marquee-right">
        {row2.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dub-grid mask-fade-top" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-[120px] opacity-60" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma MLM #1 en Peru</span>
              <span className="w-px h-3.5 bg-primary/20" />
              <span className="text-primary/70">Verificado</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-8">
              Construye tu red.<br />
              Cobra{' '}
              <span className="text-gradient-animated">automaticamente.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Sistema de comisiones en tiempo real: 7% directa, 4% binaria, 2% unilevel. Pago quincenal sin tramites.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={user ? '/dashboard' : '/registro'}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-base shadow-lg">
                {user ? 'Ir a mi Panel' : 'Crear cuenta gratis'} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/planes"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border border-border text-foreground font-medium rounded-xl hover:border-primary/50 transition-all text-base">
                Ver precios
              </Link>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: Lock, text: 'SSL 256-bit', color: 'text-emerald-500' },
                { icon: Shield, text: 'INDECOPI', color: 'text-blue-500' },
                { icon: Check, text: 'Sin permanencia', color: 'text-primary' },
                { icon: CreditCard, text: 'Pago quincenal', color: 'text-amber-500' },
              ].map(item => (
                <span key={item.text} className="flex items-center gap-2">
                  <item.icon className={cn('w-4 h-4', item.color)} />
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={500} className="mt-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <DashboardPreview />
          </div>
        </Reveal>
      </section>

      {/* ── LOGO BAR ───────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <p className="text-xs text-center text-muted-foreground mb-8 uppercase tracking-wider font-medium">Confiado por empresas en toda Latinoamerica</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, name: '500+ Empresas' },
              { icon: Target, name: '8 Paises' },
              { icon: PieChart, name: 'S/ 2.8M+ Pagado' },
              { icon: Users, name: '12,540 Afiliados' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-muted-foreground">
                <item.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ─────────────────────────────────────────────────── */}
      <section className="relative section-py">
        <div className="absolute inset-0 bg-dub-grid opacity-20 mask-fade-center" />
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
              <Zap className="w-3.5 h-3.5" />
              Funcionalidades
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Diseñado para <span className="text-gradient-animated">escalar</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Cada herramienta resuelve un problema real del negocio multinivel.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 bento-gap">
            {bentoFeatures.map((block, i) => (
              <Reveal key={block.label} delay={i * 80} className={block.span}>
                <div className="bg-card border border-border rounded-2xl p-6 h-full card-lift hover:border-primary/30 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', block.bg)}>
                      <block.icon className={cn('w-5 h-5', block.color)} />
                    </div>
                    <span className={cn('text-xs font-semibold uppercase tracking-wider', block.color)}>{block.label}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{block.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{block.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsItems.map((s, i) => (
              <Reveal key={s.label} delay={i * 50}>
                <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4', s.bg)}>
                    <s.icon className={cn('w-6 h-6', s.color)} />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="section-py">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
              <span>Proceso</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              De cero a <span className="text-gradient-animated">comisiones</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Sin curva de aprendizaje. Sin configuraciones complicadas.</p>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={step.n} className="relative">
                  <div className="bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/30 transition-all text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                      {step.n}
                    </div>
                    <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6', step.bg)}>
                      <step.icon className={cn('w-7 h-7', step.color)} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border" />
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RANKS ──────────────────────────────────────────────────────────── */}
      {ranks.filter(r => r.is_active !== false).length > 0 && (
        <section className="relative section-py border-t border-border">
          <div className="absolute inset-0 bg-dub-grid opacity-20 mask-fade-center" />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-500 mb-6">
                  <Award className="w-3.5 h-3.5" />
                  Sistema de rangos
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                  Cada nivel, <span className="text-gradient-animated">mas ingresos</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  El sistema de rangos premia tu crecimiento con bonos progresivos. Desde Bronce hasta Corona, cada nivel desbloquea beneficios exclusivos.
                </p>
                <Link to={user ? '/dashboard/rangos' : '/registro'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-all text-sm">
                  {user ? 'Ver mis rangos' : 'Ver todos los rangos'} <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>

              <Reveal delay={150}>
                <div className="grid grid-cols-2 gap-4">
                  {ranks.filter(r => r.is_active !== false).slice(0, 4).map((r) => (
                    <div key={r.id} className={cn(
                      'bg-card rounded-2xl p-6 border transition-all card-lift',
                      r.border_color || 'border-border hover:border-primary/30'
                    )}>
                      <div className="text-4xl mb-4">{r.icon}</div>
                      <div className={cn('font-bold text-lg mb-2', r.color || 'text-foreground')}>{r.name}</div>
                      <div className="text-xs text-muted-foreground mb-3">Bono de rango</div>
                      <div className="text-2xl font-bold text-foreground">
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

      {/* ── PLANS ──────────────────────────────────────────────────────────── */}
      {plans.length > 0 && (
        <section className="section-py border-t border-border" id="planes">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <Reveal className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
                Precios
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                <span className="text-gradient-animated">Elige tu plan</span>
              </h2>
              <p className="text-lg text-muted-foreground">Comienza gratis, escala cuando crezcas.</p>
            </Reveal>

            <Reveal delay={100}>
              <div className={cn(
                'grid gap-6',
                plans.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              )}>
                {plans.map(plan => {
                  const isFree = plan.is_free || plan.price === 0;
                  const isCurrent = user && (user as any).plan === plan.slug;
                  return (
                    <div key={plan.id} className={cn(
                      'bg-card rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all card-lift',
                      plan.is_popular
                        ? 'border-2 border-primary shadow-lg shadow-primary/10'
                        : 'border border-border hover:border-primary/30'
                    )}>
                      {plan.is_popular && (
                        <>
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
                          <div className="absolute top-4 right-4">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Popular</span>
                          </div>
                        </>
                      )}

                      <h3 className="font-bold text-foreground text-2xl mb-2">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                      <div className="mb-6">
                        <span className="text-4xl font-bold text-foreground">
                          {isFree ? 'Gratis' : formatPrice(plan.price, currency, currencySymbol, exchangeRate)}
                        </span>
                        {!isFree && <span className="text-base text-muted-foreground">/mes</span>}
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {(plan.features || []).slice(0, 5).map((f: string) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {isCurrent ? (
                        <div className="text-center py-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                          <span className="text-sm font-semibold text-emerald-600">Tu plan actual</span>
                        </div>
                      ) : (
                        <Link to={user ? '/dashboard/mi-plan' : `/registro?plan=${plan.slug}`}
                          className={cn(
                            'text-center py-4 rounded-xl text-sm font-medium transition-all',
                            plan.is_popular
                              ? 'bg-foreground text-background hover:opacity-90'
                              : 'border border-border hover:bg-muted hover:border-primary/30'
                          )}>
                          {isFree ? 'Comenzar gratis' : 'Activar plan'}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <p className="text-center text-sm text-muted-foreground mt-8">
              <Link to="/planes" className="text-primary font-medium hover:underline">Ver comparacion completa →</Link>
            </p>
          </div>
        </section>
      )}

      {/* ── STORE ──────────────────────────────────────────────────────────── */}
      <StoreSection />

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="section-py border-t border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-12 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
              Testimonios
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Miles de afiliados ya <span className="text-gradient-animated">ganan</span>
            </h2>
            <p className="text-lg text-muted-foreground">Historias reales de emprendedores latinoamericanos.</p>
          </Reveal>
        </div>
        <TestimonialsCarousel />
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="relative section-py border-t border-border">
        <div className="absolute inset-0 bg-dub-grid opacity-20 mask-fade-center" />
        <div className="relative max-w-3xl mx-auto px-6 sm:px-8">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Preguntas <span className="text-gradient-animated">frecuentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">Todo lo que necesitas saber antes de empezar.</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <div key={i} className={cn(
                  'bg-card border rounded-2xl overflow-hidden transition-all',
                  openFaq === i
                    ? 'border-primary/30'
                    : 'border-border hover:border-primary/20'
                )}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group">
                    <span className="text-base font-semibold text-foreground">{faq.question}</span>
                    <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform shrink-0', openFaq === i && 'rotate-180')} />
                  </button>
                  <div className={cn(
                    'grid transition-all',
                    openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}>
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-dub-grid-dark opacity-50" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-gradient-to-br from-blue-600/25 via-blue-500/15 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-15%] w-[40%] h-[50%] bg-gradient-to-bl from-blue-400/20 via-blue-500/10 to-transparent rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs font-medium text-white/80 mb-8">
              <Zap className="w-4 h-4 text-amber-400" />
              Sin tarjeta de credito
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Tu red no espera.<br />
              <span className="text-white/50">Empieza hoy.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-lg mx-auto mb-12 leading-relaxed">
              Unete a miles de emprendedores construyendo libertad financiera.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={user ? '/dashboard' : '/registro'}
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-2xl text-base">
                {user ? 'Ir a mi Panel' : 'Crear cuenta gratis'} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contacto"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/15 transition-all text-base">
                Hablar con ventas
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-sm text-white/40">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white/60" /> Cuenta gratuita</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white/60" /> Sin permanencia</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white/60" /> Pago quincenal</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white/60" /> Soporte 24/7</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
