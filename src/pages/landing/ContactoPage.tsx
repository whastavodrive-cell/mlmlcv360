import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import {
  Mail, Phone, Clock, MapPin, Send, CircleCheck as CheckCircle,
  MessageSquare, ArrowRight, Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const contactChannels = [
  { icon: Mail, label: 'Correo electrónico', value: 'hola@mlm360.pe', sub: 'Respuesta en menos de 24h', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Phone, label: 'WhatsApp', value: '+51 987 654 321', sub: 'Lun–Vie 9:00–18:00', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: MapPin, label: 'Dirección', value: 'San Isidro, Lima, Perú', sub: 'Av. Javier Prado Este 4200', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Clock, label: 'Horario de atención', value: 'Lun–Vie: 9:00–18:00', sub: 'Sáb: 9:00–13:00', color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const topics = [
  'Información general',
  'Soporte técnico',
  'Afiliación y planes',
  'Pagos y comisiones',
  'Alianzas empresariales',
  'Prensa y medios',
];

export default function ContactoPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success('Mensaje enviado correctamente');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Contacto</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <MessageSquare className="w-3.5 h-3.5" /> Estamos aquí para ayudarte
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-[1.08] tracking-tight mb-4">
              Hablemos
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              ¿Tienes preguntas sobre MLM 360? Nuestro equipo está listo para atenderte y ayudarte a dar el siguiente paso.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact channels ─────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactChannels.map(ch => (
              <div key={ch.label} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all group">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', ch.bg)}>
                  <ch.icon className={cn('w-5 h-5', ch.color)} />
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{ch.label}</div>
                <div className="text-sm font-bold text-foreground">{ch.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ch.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ───────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-2xl p-7 sm:p-9">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">¡Mensaje enviado!</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Hemos recibido tu mensaje. Te responderemos a <strong className="text-foreground">{form.email}</strong> en menos de 24 horas.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-7">
                      <h2 className="text-xl font-black text-foreground mb-1.5">Envíanos un mensaje</h2>
                      <p className="text-sm text-muted-foreground">Completamos todos los campos y te contactaremos pronto.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Nombre completo *</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Tu nombre"
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary focus:bg-card transition-all placeholder:text-muted-foreground/60"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Correo electrónico *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="tu@correo.com"
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary focus:bg-card transition-all placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Tema</label>
                        <select
                          value={form.topic}
                          onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary focus:bg-card transition-all"
                        >
                          <option value="">Selecciona un tema...</option>
                          {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Mensaje *</label>
                        <textarea
                          rows={5}
                          value={form.message}
                          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                          placeholder="Cuéntanos en qué podemos ayudarte..."
                          className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary focus:bg-card transition-all resize-none placeholder:text-muted-foreground/60"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        {loading
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><Send className="w-4 h-4" /> Enviar mensaje</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5">
              {/* Map */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-77.0350%2C-12.1050%2C-77.0100%2C-12.0850&layer=mapnik&marker=-12.0950%2C-77.0225"
                  className="w-full h-48 border-0"
                  title="Ubicación MLM 360"
                />
                <div className="p-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">MLM 360 — Oficinas centrales</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Av. Javier Prado Este 4200, San Isidro, Lima 27, Perú</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-black text-foreground">Accesos rápidos</h3>
                {[
                  { icon: Users, label: 'Únete como afiliado', href: '/registro', color: 'text-primary' },
                  { icon: ArrowRight, label: 'Ver planes y precios', href: '/planes', color: 'text-amber-500' },
                  { icon: MessageSquare, label: 'Soporte técnico', href: '/dashboard/configuracion', color: 'text-green-500' },
                ].map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className={cn('w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform')}>
                      <item.icon className={cn('w-4 h-4', item.color)} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
