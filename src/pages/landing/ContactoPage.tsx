import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Mail, Phone, MapPin, Send, Clock, ChevronRight, CircleCheck as CheckCircle } from 'lucide-react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { useConfig } from '@/store/configStore';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const { company } = useConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Mensaje enviado. Te contactaremos pronto.');
    setSent(true);
    setLoading(false);
  };

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
              <span className="text-foreground font-medium">Contacto</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Contacto</h1>
            <p className="text-muted-foreground">Estamos aquí para ayudarte. Respuesta en menos de 24h.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <a href="mailto:contacto@mlm360.pe" className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Email</div>
              <div className="text-sm text-muted-foreground">{company.company_email || 'contacto@mlm360.pe'}</div>
            </a>
            <a href="tel:+5112345678" className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Teléfono</div>
              <div className="text-sm text-muted-foreground">{company.company_phone || '+51 1 234-5678'}</div>
            </a>
            <div className="group bg-card border border-border rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Horario</div>
              <div className="text-sm text-muted-foreground">Lun-Vie 9am-6pm</div>
            </div>
          </div>

          {/* Two columns: Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">¡Mensaje enviado!</h2>
                  <p className="text-muted-foreground mb-6">Te responderemos en menos de 24 horas.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-foreground mb-6">Envíanos un mensaje</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Nombre *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="+51 999 888 777"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Mensaje *</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Map embed - OpenStreetMap (free, no API key needed) */}
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px] relative">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-77.0432%2C-12.1097%2C-77.0232%2C-12.0897&amp;layer=mapnik&amp;marker=-12.0997%2C-77.0332"
                  className="w-full h-full border-0"
                  title="Ubicación MLM 360"
                  loading="lazy"
                />
                {/* Overlay con dirección */}
                <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Oficina MLM 360</div>
                      <div className="text-sm text-muted-foreground">{company.company_address || 'Av. Javier Prado Este 4200, San Isidro, Lima'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
