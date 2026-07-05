import { Link } from '@/lib/router';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useConfig } from '@/store/configStore';
import { LogoWithText } from '@/components/Logo';

export default function Footer() {
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';
  const companyEmail = company.company_email || 'contacto@mlm360.pe';
  const companyPhone = company.company_phone || '+51 1 234-5678';
  const companyAddress = company.company_address || 'Av. Javier Prado Este 4200, San Isidro, Lima, Peru';

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand section - wider */}
            <div className="md:col-span-5 lg:col-span-4">
              <LogoWithText
                value={logoValue}
                fallbackText={companyName}
                size="w-8 h-8"
                textClass="text-lg font-bold text-foreground"
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-xs">
                Sistema empresarial ML M 360. Gestion tu red y maximiza tus ingresos.
              </p>
              <div className="flex gap-2 mt-6">
                {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links - compact grid */}
            <div className="md:col-span-7 lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {/* Plataforma */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Plataforma</h4>
                  <ul className="space-y-2.5">
                    {[
                      { href: '/planes', label: 'Planes' },
                      { href: '/tienda', label: 'Tienda' },
                      { href: '/nosotros', label: 'Nosotros' },
                      { href: '/empresa', label: 'Empresa' },
                      { href: '/blog', label: 'Blog' },
                    ].map(l => (
                      <li key={l.href}>
                        <Link
                          to={l.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Legal</h4>
                  <ul className="space-y-2.5">
                    {[
                      'Terminos de servicio',
                      'Politica de privacidad',
                      'Politica de cookies',
                      'Aviso legal',
                    ].map(l => (
                      <li key={l}>
                        <a
                          href="#"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Contacto</h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href={`mailto:${companyEmail}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-2"
                      >
                        <Mail className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                        <span className="break-all">{companyEmail}</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${companyPhone}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-2"
                      >
                        <Phone className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                        <span>{companyPhone}</span>
                      </a>
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span>{companyAddress}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">Hecho en Lima, Peru</p>
        </div>
      </div>
    </footer>
  );
}
