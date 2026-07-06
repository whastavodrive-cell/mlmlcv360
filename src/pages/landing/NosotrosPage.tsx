import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { Target, Award, HeartHandshake, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Timeline - mantener el diseño que funcionaba
const timeline = [
  { year: '2020', title: 'Fundación', desc: 'MLM 360 nace para democratizar el marketing multinivel en Perú.', color: 'bg-blue-500' },
  { year: '2021', title: 'Expansión', desc: '1,000 afiliados activos. Operaciones en 3 regiones del país.', color: 'bg-green-500' },
  { year: '2022', title: 'Plataforma', desc: 'Lanzamiento del árbol genealógico en tiempo real y app móvil.', color: 'bg-purple-500' },
  { year: '2023', title: 'Consolidación', desc: '8,000+ afiliados. Más de S/ 1M en comisiones pagadas.', color: 'bg-amber-500' },
  { year: '2024', title: 'Internacional', desc: 'Expansión a 8 países de Latinoamérica. Versión 2.0 del sistema.', color: 'bg-red-500' },
];

// Equipo
const team = [
  {
    name: 'Gustavo Ortiz',
    role: 'CEO & Fundador',
    img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: '15+ años en MLM. Fundó MLM 360 con la visión de democratizar el multinivel.',
  },
  {
    name: 'María González',
    role: 'Directora Comercial',
    img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Especialista en redes de venta directa. Lidera el equipo de soporte a afiliados.',
  },
  {
    name: 'Carlos Torres',
    role: 'CTO',
    img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Ex-Google. Arquitecto de la plataforma tecnológica de MLM 360.',
  },
  {
    name: 'Ana Ríos',
    role: 'Directora de Operaciones',
    img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'MBA Stanford. Optimiza procesos para que todo funcione sin fricción.',
  },
];

// Valores
const values = [
  { icon: Target, title: 'Misión', desc: 'Empoderar a emprendedores con herramientas MLM de clase mundial.', color: 'text-blue-500 bg-blue-500/10' },
  { icon: Award, title: 'Visión', desc: 'Ser la plataforma MLM líder de Latinoamérica en 2026.', color: 'text-amber-500 bg-amber-500/10' },
  { icon: HeartHandshake, title: 'Valores', desc: 'Transparencia, integridad, innovación y compromiso con nuestros afiliados.', color: 'text-rose-500 bg-rose-500/10' },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Nosotros</span>
            </nav>
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Somos MLM 360</h1>
              <p className="text-lg text-muted-foreground">Una empresa peruana que transforma la vida financiera de emprendedores desde 2020.</p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-card border border-border rounded-xl p-6">
                  <div className={cn('w-11 h-11 rounded-lg flex items-center justify-center mb-4', v.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline - diseño mejorado */}
        <div className="bg-muted/30 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold text-foreground mb-8 text-center">Nuestra historia</h2>
            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

              <div className="space-y-6">
                {timeline.map((item, idx) => (
                  <div key={item.year} className="flex gap-5">
                    {/* Punto */}
                    <div className="relative flex-shrink-0">
                      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold', item.color)}>
                        {item.year}
                      </div>
                      {/* Línea conectora hacia abajo */}
                      {idx < timeline.length - 1 && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border hidden sm:block" />
                      )}
                    </div>
                    {/* Contenido */}
                    <div className="bg-card border border-border rounded-xl p-5 flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Equipo */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground mb-2">Nuestro equipo</h2>
            <p className="text-muted-foreground">Las personas detrás de MLM 360.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                  />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border-t border-border py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl font-bold text-foreground mb-3">¿Listo para empezar?</h2>
            <p className="text-muted-foreground mb-6">Únete a miles de afiliados que construyen su futuro.</p>
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
