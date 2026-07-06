import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { ArrowRight, Target, HeartHandshake, Award, Users, TrendingUp, Globe, Rocket, Shield, Zap, CircleCheck as CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const values = [
  {
    icon: Target,
    title: 'Misión',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'Democratizar las oportunidades de negocio en Latinoamérica mediante tecnología MLM de vanguardia, permitiendo que cualquier persona pueda construir su libertad financiera.',
  },
  {
    icon: Award,
    title: 'Visión',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'Ser la plataforma MLM empresarial líder en Latinoamérica para 2028, con presencia en 20 países y más de 100,000 afiliados activos generando ingresos sostenibles.',
  },
  {
    icon: HeartHandshake,
    title: 'Valores',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'Transparencia total, integridad en cada transacción, innovación constante y compromiso genuino con el éxito de cada afiliado. Creemos en el crecimiento colectivo.',
  },
];

const timeline = [
  { year: '2020', title: 'Fundación', desc: 'Nace MLM 360 con la visión de modernizar el modelo de negocio multinivel en el Perú.', icon: Rocket },
  { year: '2021', title: 'Crecimiento inicial', desc: 'Alcanzamos 1,000 afiliados y lanzamos el sistema de comisiones automáticas y árbol genealógico.', icon: TrendingUp },
  { year: '2022', title: 'Expansión regional', desc: 'Expandimos operaciones a Colombia, Chile y Ecuador. Superamos S/ 500K en comisiones pagadas.', icon: Globe },
  { year: '2023', title: 'Plataforma premium', desc: 'Lanzamos la tienda integrada con MLM, los rangos avanzados y el sistema de reportes en tiempo real.', icon: Zap },
  { year: '2024', title: 'Liderazgo de mercado', desc: 'Más de 12,000 afiliados activos, S/ 2.8M en comisiones pagadas y presencia en 8 países.', icon: Award },
];

const team = [
  { name: 'Carlos Mendoza', role: 'CEO & Fundador', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', bio: '15 años en negocios digitales y marketing multinivel.' },
  { name: 'Ana Rodríguez', role: 'CTO', img: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Arquitecta de software especializada en sistemas distribuidos.' },
  { name: 'Luis García', role: 'Director Comercial', img: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Experto en expansión de negocios MLM en Latinoamérica.' },
  { name: 'María Torres', role: 'Head of Growth', img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Especialista en marketing de afiliados y crecimiento viral.' },
];

const stats = [
  { value: '12K+', label: 'Afiliados activos', icon: Users },
  { value: 'S/ 2.8M', label: 'Comisiones pagadas', icon: TrendingUp },
  { value: '8', label: 'Países con presencia', icon: Globe },
  { value: '99.9%', label: 'Uptime garantizado', icon: Shield },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Nosotros</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                <HeartHandshake className="w-3.5 h-3.5" /> Sobre nosotros
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-[1.08] tracking-tight mb-5">
                Construimos el futuro del
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500"> MLM empresarial</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Somos un equipo apasionado por democratizar las oportunidades de negocio. Desde Lima, Perú, construimos tecnología que empodera a miles de emprendedores en toda Latinoamérica.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/registro"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                  Únete hoy <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contacto"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-muted transition-colors">
                  Habla con nosotros
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-black text-foreground tracking-tight mb-1">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Nuestros pilares</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3 mb-3 tracking-tight">
              Lo que nos define
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Los principios que guían cada decisión que tomamos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className={cn('bg-card border rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300', v.border)}>
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-5', v.bg)}>
                  <v.icon className={cn('w-6 h-6', v.color)} />
                </div>
                <h3 className={cn('text-lg font-black mb-3', v.color)}>{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Historia</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3 mb-3 tracking-tight">
              Nuestro camino
            </h2>
            <p className="text-muted-foreground text-sm">De startup a referente del MLM empresarial en Latinoamérica.</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={item.year} className={cn('relative flex gap-8 md:gap-0', i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')}>
                  {/* Content */}
                  <div className={cn('flex-1 md:w-[calc(50%-2rem)] pl-14 md:pl-0', i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12')}>
                    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                      <span className="text-xs font-black text-primary uppercase tracking-widest">{item.year}</span>
                      <h3 className="text-base font-black text-foreground mt-1 mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-4 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Spacer for alternating side */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">El equipo</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3 mb-3 tracking-tight">
              Las personas detrás de MLM 360
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Un equipo multidisciplinario unido por la pasión de crear oportunidades.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-foreground">{member.name}</h3>
                  <div className="text-xs font-semibold text-primary mt-0.5 mb-3">{member.role}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-white/10 rounded-full blur-[80px]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-6">
                <CheckCircle className="w-3.5 h-3.5" /> Sin contrato · Sin letra pequeña
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                Sé parte de nuestra historia
              </h2>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
                Únete a más de 12,000 emprendedores que ya están construyendo su futuro financiero con MLM 360.
              </p>
              <Link to="/registro"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-black rounded-xl hover:bg-blue-50 transition-colors shadow-xl text-sm">
                Comenzar ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
