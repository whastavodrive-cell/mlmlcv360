import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Reveal, MouseGlow } from '@/components/landing/Reveal';
import { Link } from '@/lib/router';
import {
  ArrowRight, Target, Award, HeartHandshake, Users, TrendingUp, Globe, Rocket, Zap,
  Building2, MapPin, Phone, Mail, Sparkles, Shield, Lock, Cpu, Cloud, Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfig } from '@/store/configStore';
import { useEffect, useRef } from 'react';

const timeline = [
  { year: '2020', title: 'Fundación', desc: 'Lima, Perú. Un equipo de 3 personas con una visión.', icon: Rocket, active: true },
  { year: '2021', title: 'Validación', desc: '+1,000 afiliados. Primeros pagos de comisiones.', icon: TrendingUp, active: true },
  { year: '2022', title: 'Expansión regional', desc: 'Presencia en Colombia, Ecuador y Bolivia.', icon: Globe, active: true },
  { year: '2023', title: 'Tienda MLM', desc: 'Marketplace propio con +200 productos.', icon: Building2, active: true },
  { year: '2024', title: 'Liderazgo', desc: '+12,000 afiliados. S/2.8M en comisiones.', icon: Award, active: true },
  { year: '2025', title: 'Escalado', desc: 'Meta: 20 países y 50,000 afiliados.', icon: Zap, active: false },
];

const team = [
  { name: 'Carlos Mendoza', role: 'CEO & Fundador', bio: '10 años en MLM, ex-director comercial de multinacional.', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Ana Rodríguez', role: 'CTO', bio: 'Ex-Amazon, especialista en sistemas escalables.', img: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Luis García', role: 'Director Comercial', bio: 'Experto en redes de afiliados, +500 entrenamientos.', img: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'María Torres', role: 'Head of Growth', bio: 'Especialista en adquisición y retención de usuarios.', img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const values = [
  { icon: Target, title: 'Misión', text: 'Democratizar las oportunidades de negocio en Latinoamérica mediante tecnología MLM de vanguardia que empodera a cualquier persona.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Award, title: 'Visión', text: 'Ser la plataforma MLM empresarial líder en Latinoamérica para 2028, con presencia en 20 países y 50,000 afiliados activos.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: HeartHandshake, title: 'Valores', text: 'Transparencia radical. Integridad sin compromisos. Innovación constante. Éxito compartido con cada afiliado.', color: 'text-green-500', bg: 'bg-green-500/10' },
];

const infra = [
  { icon: Cloud, title: 'Cloud nativo', desc: 'Infraestructura serverless en Supabase Edge Functions con auto-scaling.', color: 'text-blue-500' },
  { icon: Shield, title: 'Seguridad bancaria', desc: 'Cifrado AES-256, RLS por usuario y auditoría de transacciones.', color: 'text-green-500' },
  { icon: Database, title: 'PostgreSQL + RLS', desc: 'Base de datos transaccional con Row Level Security en cada tabla.', color: 'text-primary' },
  { icon: Cpu, title: 'Cálculo en tiempo real', desc: 'Motor de comisiones binario + unilevel con triggers PostgreSQL.', color: 'text-amber-500' },
  { icon: Lock, title: 'Cumplimiento legal', desc: 'INDECOPI, facturación electrónica y retenciones automáticas.', color: 'text-purple-500' },
  { icon: Zap, title: '99.9% uptime', desc: 'Monitoreo proactivo, failover automático y backups cada hora.', color: 'text-emerald-500' },
];

const statsItems = [
  { value: '12,540+', label: 'Afiliados activos', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: 'S/ 2.8M+', label: 'Comisiones pagadas', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  { value: '8 países', label: 'Presencia regional', icon: Globe, color: 'text-primary', bg: 'bg-primary/10' },
  { value: '+340%', label: 'Crecimiento anual', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

function StatsCarousel() {
  const items = [...statsItems, ...statsItems];
  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex" style={{ animation: 'marquee-left 30s linear infinite' }}>
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-8 shrink-0">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', s.bg)}>
              <s.icon className={cn('w-6 h-6', s.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground leading-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NosotrosPage() {
  const { company } = useConfig();
  const companyName = company.company_name || 'MLM 360';
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
      <style>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
      <MouseGlow />
      <div id="mouse-glow" ref={glowRef} className="mouse-glow" />

      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-24 relative overflow-hidden">
        {/* Faded grid — dub.co style */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_50%,transparent_100%)]" />
        {/* Aurora */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">Nosotros</span>
          </nav>

          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Desde Lima para Latinoamérica</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6 max-w-3xl">
              Empoderamos a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]">
                emprendedores
              </span>{' '}
              latinos
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-9 leading-relaxed">
              Construímos tecnología que genera libertad financiera real. Nuestra plataforma automatiza lo difícil para que te enfoques en lo importante: tu red.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-wrap gap-3">
              <Link to="/registro" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 text-sm">
                Únete hoy <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contacto" className="inline-flex items-center gap-2 px-6 py-3.5 bg-muted border border-border text-foreground font-medium rounded-xl hover:border-primary/40 transition-all text-sm">
                Contáctanos
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS CAROUSEL ───────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-muted/30">
        <StatsCarousel />
      </div>

      {/* ── VALUES ──────────────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">Nuestro norte</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Lo que nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">define</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/30 hover:shadow-lg transition-all group">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform', v.bg)}>
                    <v.icon className={cn('w-6 h-6', v.color)} />
                  </div>
                  <h3 className={cn('font-bold text-xl mb-3', v.color)}>{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ────────────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-muted/20" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">historia</span>
            </h2>
            <p className="text-muted-foreground">De una idea a la plataforma MLM líder en Latinoamérica.</p>
          </Reveal>

          <Reveal>
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-ml-px" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={item.year} className={cn(
                    'relative flex items-start gap-6',
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}>
                    <div className={cn(
                      'w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 z-10 transition-all',
                      item.active
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-dashed border-border bg-muted/50 text-muted-foreground/50'
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className={cn(
                      'flex-1 bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all',
                      i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    )}>
                      <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{item.year}</div>
                      <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── INFRASTRUCTURE ──────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">Infraestructura</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Tecnología <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">de nivel empresarial</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Construido sobre las mejores herramientas. Cada componente es production-ready.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {infra.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 hover:shadow-lg transition-all group">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-muted group-hover:scale-110 transition-transform')}>
                    <item.icon className={cn('w-5 h-5', item.color)} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-muted/20" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              El equipo detrás de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{companyName}</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">Combinamos experiencia en MLM, tecnología y crecimiento para construir la mejor plataforma.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 100}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group">
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-foreground text-lg leading-tight">{member.name}</h3>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wide mt-0.5 mb-3">{member.role}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY INFO ────────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Información <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">legal</span>
            </h2>
            <p className="text-muted-foreground">Empresa registrada con transparencia total.</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-8 space-y-6">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Razón social</div>
                    <div className="font-bold text-lg text-foreground">{company.razon_social || 'MLM 360 S.A.C.'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">RUC</div>
                    <div className="font-bold text-lg text-foreground">{company.ruc || '20603456789'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">País de origen</div>
                    <div className="font-bold text-lg text-foreground">Perú</div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Dirección</div>
                    <div className="font-semibold text-foreground leading-relaxed">{company.address || 'Av. Javier Prado Este 100, San Isidro, Lima, Perú'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</div>
                    <div className="font-semibold text-foreground">{company.contact_email || 'contacto@mlm360.pe'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Teléfono</div>
                    <div className="font-semibold text-foreground">{company.phone || '+51 916 085 797'}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-foreground">
          <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[70%] bg-gradient-to-br from-primary/25 via-blue-500/15 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-[10%] right-[-20%] w-[50%] h-[60%] bg-gradient-to-bl from-blue-500/20 via-primary/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs font-bold text-white/80 mb-8">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Sin tarjeta de crédito requerida</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
              Sé parte de nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">historia</span>
            </h2>
            <p className="text-xl text-white/50 max-w-lg mx-auto mb-10 leading-relaxed">
              Únete a emprendedores que ya construyen su futuro con {companyName}.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/registro" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-foreground font-bold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-2xl text-base">
                Crear cuenta gratis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/empresa" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all text-base">
                Ver infraestructura
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
