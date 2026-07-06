import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { ArrowRight, Server, Shield, Globe, Database, Lock, Zap, Cloud, CreditCard, CircleCheck as CheckCircle } from 'lucide-react';
import { useConfig } from '@/store/configStore';
import { cn } from '@/lib/utils';

const techStack = [
  { name: 'AWS', desc: 'Infraestructura global con auto-scaling', icon: Cloud, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'PostgreSQL', desc: 'Base de datos de alto rendimiento', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Cloudflare', desc: 'CDN global y DDoS protection', icon: Globe, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'SSL 256-bit', desc: 'Cifrado de extremo a extremo', icon: Lock, color: 'text-green-500', bg: 'bg-green-500/10' },
];

const gateways = [
  { name: 'Yape', desc: 'Pagos móviles BCP' },
  { name: 'Plin', desc: 'Pagos instantáneos' },
  { name: 'Niubiz', desc: 'Visa/Mastercard' },
  { name: 'Izipay', desc: 'Terminal virtual' },
];

const infraStats = [
  { value: '99.9%', label: 'Uptime', icon: Zap },
  { value: '<50ms', label: 'Latencia', icon: Server },
  { value: '24/7', label: 'Monitoreo', icon: Shield },
];

export default function EmpresaPage() {
  const { company } = useConfig();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Empresa</span>
          </nav>

          <div className="max-w-2xl">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Infraestructura</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4 leading-tight">
              Tecnología empresarial para tu negocio
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Plataforma construida sobre infraestructura de primer nivel, garantizando seguridad, rendimiento y disponibilidad.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            {infraStats.map(s => (
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

      {/* Tech Stack */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Stack</span>
            <h2 className="text-2xl font-bold text-foreground mt-2">Tecnología probada</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map(tech => (
              <div key={tech.name} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', tech.bg)}>
                  <tech.icon className={cn('w-5 h-5', tech.color)} />
                </div>
                <div className="font-semibold text-foreground text-sm">{tech.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Gateways */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Pagos</span>
            <h2 className="text-2xl font-bold text-foreground mt-2">Pasarelas integradas</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {gateways.map(gw => (
              <div key={gw.name} className="bg-card border border-border rounded-xl px-5 py-3 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-foreground text-sm">{gw.name}</div>
                  <div className="text-xs text-muted-foreground">{gw.desc}</div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Info */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Legal</span>
            <h2 className="text-2xl font-bold text-foreground mt-2">Empresa registrada</h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">Razón social</span>
                <div className="font-medium text-foreground">{company.razon_social || 'MLM 360 S.A.C.'}</div>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">RUC</span>
                <div className="font-medium text-foreground">{company.ruc || '20603456789'}</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">Dirección</span>
                <div className="font-medium text-foreground">{company.address || 'Av. Javier Prado Este 4200, San Isidro, Lima'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative">
              <h2 className="text-xl font-bold text-white mb-3">¿Preguntas empresariales?</h2>
              <p className="text-white/70 text-sm mb-6">Contacta a nuestro equipo de ventas enterprise.</p>
              <Link to="/contacto" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Contactar ventas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
