import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { Target, Award, Users, Heart, Shield, Zap, Globe, Star, ArrowRight, ChevronRight, Building2, Rocket, HeartHandshake, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Timeline data
const timeline = [
  { year: '2020', title: 'Nacimiento', desc: 'MLM 360 nace con la visión de democratizar el marketing multinivel en el Perú.', icon: Rocket },
  { year: '2021', title: 'Expansión', desc: 'Llegamos a 1,000 afiliados y expandimos operaciones a 3 regiones.', icon: TrendingUp },
  { year: '2022', title: 'Lanzamiento', desc: 'Presentamos la plataforma digital con árbol genealógico en tiempo real.', icon: Zap },
  { year: '2023', title: 'Crecimiento', desc: 'Superamos 8,000 afiliados activos y S/ 1M en comisiones pagadas.', icon: Star },
  { year: '2024', title: 'Proyección', desc: 'Expansión internacional y lanzamiento de la versión 2.0 del sistema.', icon: Globe },
];

// Values
const values = [
  {
    icon: Target,
    title: 'Misión',
    desc: 'Empoderar a emprendedores peruanos con las mejores herramientas de MLM para construir negocios sostenibles y rentables.',
    color: 'bg-blue-500',
  },
  {
    icon: Award,
    title: 'Visión',
    desc: 'Ser la plataforma MLM líder en Latinoamérica, reconocida por su innovación tecnológica y el éxito de sus afiliados.',
    color: 'bg-amber-500',
  },
  {
    icon: HeartHandshake,
    title: 'Valores',
    desc: 'Transparencia, integridad, innovación y compromiso con el crecimiento personal y profesional de cada afiliado.',
    color: 'bg-rose-500',
  },
];

// Team
const team = [
  {
    name: 'Gustavo Ortiz',
    role: 'CEO & Fundador',
    img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Emprendedor serial con 15+ años en MLM.',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'María González',
    role: 'Directora Comercial',
    img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Especialista en redes de venta directa.',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Carlos Torres',
    role: 'CTO',
    img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Arquitecto de software y ex-Google.',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Ana Ríos',
    role: 'Directora de Operaciones',
    img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'MBA Stanford, experta en procesos.',
    social: { linkedin: '#', twitter: '#' },
  },
];

// Stats
const stats = [
  { value: '12,540+', label: 'Afiliados activos', icon: Users },
  { value: 'S/ 2.8M+', label: 'Comisiones pagadas', icon: TrendingUp },
  { value: '8', label: 'Países con presencia', icon: Globe },
  { value: '99.9%', label: 'Uptime garantizado', icon: Shield },
];

// Benefits
const benefits = [
  { icon: Shield, title: 'Seguridad', desc: 'Tus datos y dinero están protegidos con encriptación bancaria.' },
  { icon: Zap, title: 'Velocidad', desc: 'Plataforma optimizada para cargar en menos de 2 segundos.' },
  { icon: Heart, title: 'Soporte', desc: 'Equipo dedicado que responde en menos de 24 horas.' },
  { icon: Star, title: 'Calidad', desc: 'Mejoras constantes basadas en feedback de afiliados.' },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <span className="text-foreground font-medium">Nosotros</span>
          </nav>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Sobre MLM 360
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">
                Somos la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">nueva era</span> del MLM en Perú
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                Una empresa peruana fundada en 2020 con la misión de transformar la vida financiera de miles de emprendedores a través del poder del marketing multinivel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/planes"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Ver planes
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            {/* Right - Image/Visual */}
            <div className="relative">
              <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                <img
                  src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Equipo MLM 360"
                  className="w-full aspect-[4/3] object-cover"
                />
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-5 shadow-xl hidden sm:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">S/ 2.8M+</div>
                      <div className="text-sm text-muted-foreground">En comisiones pagadas</div>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hidden sm:block">
                  Desde 2020
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Lo que nos define</h2>
            <p className="text-muted-foreground">Nuestra razón de ser y lo que guía cada decisión que tomamos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group bg-card border border-border rounded-3xl p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white',
                    value.color
                  )}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Nuestra historia</h2>
            <p className="text-muted-foreground">Un recorrido por los hitos que nos han traído hasta aquí.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Central line - hidden on mobile */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />

            <div className="space-y-8 lg:space-y-0">
              {timeline.map((item, idx) => {
                const Icon = item.icon;
                const isLeft = idx % 2 === 0;
                return (
                  <div key={item.year} className="relative lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Desktop layout */}
                    <div className={cn(
                      'hidden lg:block',
                      isLeft ? 'text-right pr-12' : 'col-start-2 pl-12'
                    )}>
                      <div className={cn(
                        'bg-card border border-border rounded-2xl p-6 inline-block transition-all hover:border-primary/30 hover:shadow-lg',
                        isLeft ? 'ml-auto' : ''
                      )}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-bold text-primary">{item.year}</span>
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>

                    {/* Year badge - desktop center */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary items-center justify-center text-white font-bold text-sm z-10">
                      {item.year}
                    </div>

                    {/* Hidden spacer for the opposite side on desktop */}
                    <div className="hidden lg:block" />

                    {/* Mobile layout */}
                    <div className="lg:hidden flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.year}
                        </div>
                        {idx < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                      </div>
                      <div className="bg-card border border-border rounded-2xl p-5 flex-1 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-foreground">{item.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Nuestro equipo</h2>
            <p className="text-muted-foreground">Las personas detrás de MLM 360, comprometidas con tu éxito.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs">{member.bio}</p>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">¿Por qué elegirnos?</h2>
            <p className="text-muted-foreground">Combinamos tecnología de punta con un modelo justo y transparente.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-primary via-primary to-blue-600 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Únete a miles de afiliados que ya están construyendo su futuro financiero con MLM 360.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/registro"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/planes"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Ver planes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
