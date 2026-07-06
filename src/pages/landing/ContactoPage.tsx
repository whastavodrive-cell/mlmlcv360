import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Mail, Phone, MapPin, Send, CircleCheck as CheckCircle, Clock, MessageSquare, Globe, Headphones, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useConfig } from '@/store/configStore';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contacto@mlm360.pe',
    description: 'Respuesta en menos de 24h',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    href: 'mailto:contacto@mlm360.pe',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    value: '+51 1 234-5678',
    description: 'Lun-Vie 9am-6pm',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    href: 'tel:+5112345678',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    value: '+51 999 888 777',
    description: 'Respuesta inmediata',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    href: 'https://wa.me/51999888777',
  },
];

const scheduleItems = [
  { day: 'Lunes - Viernes', hours: '9:00 am - 6:00 pm', active: true },
  { day: 'Sábado', hours: '9:00 am - 1:00 pm', active: true },
  { day: 'Domingo', hours: 'Cerrado', active: false },
];

const faqItems = [
  {
    q: '¿Cómo empiezo a ganar comisiones?',
    a: 'Solo necesitas activar un plan y empezar a referir. Cada nuevo afiliado que use tu enlace suma a tu red.',
  },
  {
    q: '¿Cuánto tardan en pagarme?',
    a: 'Las comisiones se pagan quincenalmente. Transferencia bancaria o Yape, tú eliges.',
  },
  {
    q: '¿Puedo cancelar mi plan en cualquier momento?',
    a: 'Sí. Sin penalidades ni permanencia. Tu cuenta pasa al plan gratuito automáticamente.',
  },
];

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { company } = useConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular envío
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Mensaje enviado. Te contactaremos pronto.');
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <span className="text-foreground font-medium">Contacto</span>
          </nav>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              Estamos para ayudarte
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight leading-tight">
              ¿Tienes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">preguntas?</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Nuestro equipo responde en menos de 24 horas. Elige tu canal preferido o usa el formulario.
            </p>
          </div>

          {/* Contact Methods Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.title}
                  href={method.href}
                  className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-center"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110',
                    method.color
                  )}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{method.title}</h3>
                  <p className="text-sm font-medium text-foreground mb-1">{method.value}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-8 lg:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form Column */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 lg:p-10">
                {sent ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">¡Mensaje enviado!</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm">
                      Gracias por contactarnos. Revisaremos tu mensaje y te responderemos en menos de 24 horas.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-foreground mb-2">Envíanos un mensaje</h2>
                      <p className="text-sm text-muted-foreground">Completa el formulario y te responderemos rápido.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Juan Pérez"
                            required
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Correo electrónico</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="juan@ejemplo.pe"
                            required
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Asunto</label>
                        <input
                          type="text"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          placeholder="¿En qué podemos ayudarte?"
                          required
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Mensaje</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={5}
                          placeholder="Cuéntanos los detalles..."
                          required
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-muted-foreground"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Enviar mensaje
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Schedule */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Horario de atención</h3>
                </div>
                <div className="space-y-3">
                  {scheduleItems.map((item) => (
                    <div key={item.day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className={cn(
                        'text-sm',
                        item.active ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {item.day}
                      </span>
                      <span className={cn(
                        'text-sm font-medium',
                        item.active ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Ubicación</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {company.company_address || 'Av. Javier Prado Este 4200, San Isidro, Lima, Perú'}
                </p>
                <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Ubicación oficina"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* FAQ Mini */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Preguntas frecuentes</h3>
                </div>
                <div className="space-y-4">
                  {faqItems.map((item, idx) => (
                    <div key={idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <h4 className="text-sm font-medium text-foreground mb-1">{item.q}</h4>
                      <p className="text-xs text-muted-foreground">{item.a}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/blog"
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  Ver más en Novedades
                  <ArrowRight className="w-4 h-4" />
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
