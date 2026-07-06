import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { ArrowRight, Target, Award, HeartHandshake, Users, TrendingUp, Globe, Rocket, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const values = [
  { icon: Target, title: 'Misión', text: 'Democratizar las oportunidades de negocio en Latinoamérica mediante tecnología MLM de vanguardia.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Award, title: 'Visión', text: 'Ser la plataforma MLM empresarial líder en Latinoamérica para 2028, con presencia en 20 países.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: HeartHandshake, title: 'Valores', text: 'Transparencia, integridad, innovación y compromiso genuino con el éxito de cada afiliado.', color: 'text-green-500', bg: 'bg-green-500/10' },
];

const timeline = [
  { year: '2020', title: 'Fundación', desc: 'Perú' },
  { year: '2021', title: 'Crecimiento', desc: '+1,000 afiliados' },
  { year: '2022', title: 'Expansión', desc: 'Regional' },
  { year: '2023', title: 'Premium', desc: 'Tienda MLM' },
  { year: '2024', title: 'Liderazgo', desc: '+12,000 afiliados' },
];

const team = [
  { name: 'Carlos Mendoza', role: 'CEO & Fundador', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Ana Rodríguez', role: 'CTO', img: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Luis García', role: 'Director Comercial', img: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'María Torres', role: 'Head of Growth', img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

const stats = [
  { value: '12K+', label: 'Afiliados', icon: Users },
  { value: 'S/ 2.8M', label: 'Comisiones', icon: TrendingUp },
  { value: '8', label: 'Países', icon: Globe },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO: Clean, direct ─────────────────────────────────────────────────── */}
      <section className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Nosotros</span>
          </nav>

          <div className="max-w-2xl">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Sobre nosotros</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4 leading-tight">
              Empoderamos a emprendedores latinoamericanos
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              MLM 360 democratiza las oportunidades de negocio. Desde Lima, Perú, construimos tecnología que genera libertad financiera.
            </p>
            <div className="flex gap-3">
              <Link to="/registro" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">
                Únete hoy <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contacto" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors text-sm">
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS: Compact ───────────────────────────────────────────────────────── */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <s.icon className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{s.value}</span>
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES: 3 columns, minimal ───────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map(v => (
              <div key={v.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-4', v.bg)}>
                  <v.icon className={cn('w-5 h-5', v.color)} />
                </div>
                <h3 className={cn('font-bold text-foreground mb-2', v.color)}>{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE: Horizontal, scannable ─────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Historia</span>
            <h2 className="text-2xl font-bold text-foreground mt-2">Nuestro camino</h2>
          </div>

          <div className="relative overflow-x-auto pb-4">
            <div className="absolute top-4 left-0 right-0 h-px bg-border min-w-[500px]" />
            <div className="flex justify-between min-w-[500px] gap-4">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex flex-col items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center mb-3 text-xs font-bold z-10',
                    i === timeline.length - 1 ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'
                  )}>
                    {i === 0 ? <Rocket className="w-4 h-4" /> : i === timeline.length - 1 ? <Zap className="w-3 h-3" /> : i + 1}
                  </div>
                  <div className="text-xs font-bold text-foreground mb-0.5">{item.year}</div>
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM: Grid, concise info ────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Equipo</span>
            <h2 className="text-2xl font-bold text-foreground mt-2">Las personas detrás de MLM 360</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map(member => (
              <div key={member.name} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 text-center">
                  <div className="font-semibold text-foreground text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-3">Sé parte de nuestra historia</h2>
              <p className="text-white/70 mb-6 text-sm">Únete a +12,000 emprendedores construyendo su futuro.</p>
              <Link to="/registro" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
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
