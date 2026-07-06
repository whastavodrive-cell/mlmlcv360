import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from '@/lib/router';
import { Mail, Phone, MapPin, Send, CircleCheck as CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useConfig } from '@/store/configStore';

export default function ContactoPage() {
  const { company } = useConfig();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Completa todos los campos');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success('Mensaje enviado');
  };

  const channels = [
    { icon: Mail, label: 'Email', value: company.contact_email || 'hola@mlm360.pe' },
    { icon: Phone, label: 'WhatsApp', value: company.phone || '+51 987 654 321' },
    { icon: MapPin, label: 'Dirección', value: company.address || 'San Isidro, Lima, Perú' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-8 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Contacto</span>
          </nav>

          <div className="text-center mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Contacto</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 mb-2">¿En qué podemos ayudarte?</h1>
            <p className="text-sm text-muted-foreground">Respuesta en menos de 24 horas.</p>
          </div>

          {/* Contact channels */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {channels.map(ch => (
              <div key={ch.label} className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <ch.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">{ch.label}</div>
                <div className="text-sm font-medium text-foreground truncate">{ch.value}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-xl p-6">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Mensaje enviado</h3>
                <p className="text-sm text-muted-foreground mb-4">Te responderemos pronto.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                  className="text-sm text-primary font-medium hover:underline">Enviar otro</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Nombre</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Mensaje</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary transition-all resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Enviar</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">¿Prefieres llamar?</h2>
          <p className="text-sm text-muted-foreground mb-4">Lunes a viernes, 9:00 - 18:00</p>
          <Link to="/registro" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">
            Crear cuenta <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
