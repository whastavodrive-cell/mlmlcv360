import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import {
  ArrowRight, Server, Shield, Globe, Database,
  CircleCheck as CheckCircle, Lock, Zap, Cloud, RefreshCw,
  CreditCard, Building2, FileText,
} from 'lucide-react';
import { useConfig } from '@/store/configStore';
import { cn } from '@/lib/utils';

const techStack = [
  { name: 'AWS', desc: 'Infraestructura global en la nube con auto-scaling y alta disponibilidad.', icon: Cloud, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'PostgreSQL', desc: 'Base de datos relacional de alto rendimiento con replicación en tiempo real.', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Cloudflare', desc: 'CDN global, DDoS protection y optimización de rendimiento en el borde.', icon: Globe, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'SSL/TLS 256-bit', desc: 'Cifrado de extremo a extremo para todos los datos en tránsito y reposo.', icon: Lock, color: 'text-green-500', bg: 'bg-green-500/10' },
];

const certifications = [
  { name: 'ISO 27001', desc: 'Gestión de seguridad de la información', icon: Shield },
  { name: 'PCI DSS', desc: 'Seguridad en pagos con tarjeta', icon: CreditCard },
  { name: 'SSL Certificate', desc: 'Certificado de seguridad web', icon: Lock },
  { name: 'GDPR Ready', desc: 'Protección de datos europeos', icon: FileText },
];

const gateways = [
  { name: 'Yape', desc: 'Pagos móviles BCP', color: 'from-violet-500 to-purple-600' },
  { name: 'Plin', desc: 'Pagos instantáneos', color: 'from-blue-500 to-cyan-500' },
  { name: 'Niubiz', desc: 'Pasarela Visa/MC', color: 'from-green-500 to-emerald-600' },
  { name: 'Izipay', desc: 'Terminal virtual', color: 'from-red-500 to-orange-500' },
];

const infraStats = [
  { value: '99.9%', label: 'Uptime garantizado', icon: RefreshCw },
  { value: '<50ms', label: 'Latencia promedio', icon: Zap },
  { value: '3 capas', label: 'Seguridad activa', icon: Shield },
  { value: '24/7', label: 'Monitoreo activo', icon: Server },
];

export default function EmpresaPage() {
  const { company } = useConfig();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Empresa</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Building2 className="w-3.5 h-3.5" /> Infraestructura empresarial
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-[1.08] tracking-tight mb-5">
              Tecnología de clase mundial
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500"> para tu negocio</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              Nuestra plataforma está construida sobre infraestructura empresarial de primer nivel, garantizando la máxima seguridad, rendimiento y disponibilidad.
            </p>
          </div>

          {/* Infrastructure stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {infraStats.map(s => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-black text-foreground tracking-tight mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Stack tecnológico</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3 mb-3 tracking-tight max-w-xl">
              Construido para escalar sin límites
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Cada componente de nuestra arquitectura está seleccionado para garantizar el máximo rendimiento y seguridad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {techStack.map(tech => (
              <div key={tech.name} className="bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex gap-5">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform', tech.bg)}>
                  <tech.icon className={cn('w-6 h-6', tech.color)} />
                </div>
                <div>
                  <h3 className="font-black text-foreground mb-2">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Certificaciones</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3 mb-3 tracking-tight">
              Cumplimiento y seguridad
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Cumplimos con los estándares internacionales más exigentes para proteger tu negocio y tus datos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {certifications.map(cert => (
              <div key={cert.name} className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <cert.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-black text-foreground mb-1">{cert.name}</div>
                <div className="text-xs text-muted-foreground">{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Gateways ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Pasarelas de pago</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3 mb-3 tracking-tight">
              Múltiples métodos de pago
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Integraciones nativas con las principales pasarelas de pago del mercado peruano y regional.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {gateways.map(gw => (
              <div key={gw.name} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={cn('h-24 bg-gradient-to-br flex items-center justify-center', gw.color)}>
                  <CreditCard className="w-8 h-8 text-white opacity-60" />
                </div>
                <div className="p-4 text-center">
                  <div className="font-black text-foreground">{gw.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{gw.desc}</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Activo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legal info ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Información legal</span>
            <h2 className="text-3xl font-black text-foreground mt-3 tracking-tight">Empresa registrada</h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Razón social', value: company.razon_social || 'MLM 360 S.A.C.' },
                { label: 'RUC', value: company.ruc || '20603456789' },
                { label: 'Dirección', value: company.address || 'Av. Javier Prado Este 4200, San Isidro, Lima' },
                { label: 'INDECOPI', value: company.indecopi || 'Registro N° 2024-001234' },
                { label: 'Correo legal', value: company.legal_email || 'legal@mlm360.pe' },
                { label: 'Teléfono', value: company.phone || '+51 1 234-5678' },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative">
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">¿Listo para escalar?</h2>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
                Contacta a nuestro equipo de ventas enterprise para conocer soluciones personalizadas para tu empresa.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/contacto"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-black rounded-xl hover:bg-blue-50 transition-colors shadow-xl text-sm">
                  Hablar con ventas <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/registro"
                  className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Crear cuenta gratis
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
