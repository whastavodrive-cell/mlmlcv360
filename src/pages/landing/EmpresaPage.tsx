import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { Shield, Server, Globe, ChevronRight, CircleCheck as CheckCircle, Database, Clock, Users, TrendingUp } from 'lucide-react';
import { useConfig } from '@/store/configStore';

// Datos de infraestructura - específicos de la empresa
const infrastructure = [
  { icon: Server, label: 'Servidores', value: 'AWS + Cloudflare', desc: 'Infestructura cloud global' },
  { icon: Database, label: 'Base de datos', value: 'PostgreSQL', desc: 'Con replicas en 3 regiones' },
  { icon: Shield, label: 'Seguridad', value: 'SSL + Encriptación', desc: 'Certificado ISO 27001' },
  { icon: Globe, label: 'CDN', value: 'Cloudflare', desc: 'Contenido en 200+ locations' },
];

// Estadísticas de la empresa
const companyStats = [
  { label: 'Afiliados activos', value: '12,540+', icon: Users },
  { label: 'Comisiones pagadas', value: 'S/ 2.8M+', icon: TrendingUp },
  { label: 'Uptime último año', value: '99.97%', icon: Clock },
  { label: 'Países activos', value: '8', icon: Globe },
];

// Certificaciones
const certifications = [
  { name: 'ISO 27001', desc: 'Gestión de seguridad de la información' },
  { name: 'SSL/TLS', desc: 'Encriptación de datos en tránsito' },
  { name: 'PCI DSS', desc: 'Seguridad en procesamiento de pagos' },
];

// Gateways de pago soportados
const paymentGateways = [
  { name: 'Yape', status: 'Activo' },
  { name: 'Plin', status: 'Activo' },
  { name: 'Niubiz', status: 'Activo' },
  { name: 'Izipay', status: 'Activo' },
];

export default function EmpresaPage() {
  const { company } = useConfig();

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
              <span className="text-foreground font-medium">Empresa</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Infraestructura empresarial</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Conoce la tecnología y certificaciones detrás de MLM 360. Plataforma diseñada para escalar.</p>
          </div>
        </div>

        {/* Stats barra */}
        <div className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {companyStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Infraestructura */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Stack tecnológico</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infrastructure.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="font-semibold text-foreground mb-1">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="bg-muted/30 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Certificaciones */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Certificaciones</h2>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.name} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">{cert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métodos de pago */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Métodos de pago integrados</h2>
                <div className="grid grid-cols-2 gap-3">
                  {paymentGateways.map((gw) => (
                    <div key={gw.name} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                      <span className="font-medium text-foreground">{gw.name}</span>
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">{gw.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Datos de contacto empresa */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Datos legales</h2>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Razón social</div>
                <div className="font-medium text-foreground">{company.company_name || 'MLM 360 Peru S.A.C.'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">RUC</div>
                <div className="font-medium text-foreground">20601234567</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Dirección fiscal</div>
                <div className="font-medium text-foreground">{company.company_address || 'Av. Javier Prado Este 4200, San Isidro, Lima'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email corporativo</div>
                <div className="font-medium text-foreground">{company.company_email || 'contacto@mlm360.pe'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border-t border-border py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl font-bold text-foreground mb-3">¿Tienes un proyecto grande?</h2>
            <p className="text-muted-foreground mb-6">Contáctanos para soluciones enterprise personalizadas.</p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Contactar ventas
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
