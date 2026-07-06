import { Link } from '@/lib/router';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, X } from 'lucide-react';
import { useConfig } from '@/store/configStore';
import { LogoWithText } from '@/components/Logo';

export default function Footer() {
  const { company, logoValue } = useConfig();
  const companyName = company.company_name || 'MLM 360';
  const companyEmail = company.company_email || 'contacto@mlm360.pe';
  const companyPhone = company.company_phone || '+51 1 234-5678';
  const companyAddress = company.company_address || 'Av. Javier Prado Este 4200, San Isidro, Lima, Peru';

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Subtle grid on dark */}
      <div className="absolute inset-0 bg-dub-grid-dark opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 rounded-full blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">
            {/* Brand section */}
            <div className="lg:w-72 flex-shrink-0">
              <LogoWithText
                value={logoValue}
                fallbackText={companyName}
                size="w-7 h-7"
                textClass="text-base font-bold text-background tracking-tight"
              />
              <p className="text-sm text-background/60 leading-relaxed mt-4 max-w-xs">
                Plataforma empresarial para gestion de redes y comercio. Impulsa tu negocio al siguiente nivel.
              </p>
              <div className="flex gap-1.5 mt-5">
                {[
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                  { Icon: X, label: 'X' },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-lg bg-background/10 border border-background/10 flex items-center justify-center text-background/60 hover:text-background hover:bg-background/15 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
              <div>
                <h4 className="text-xs font-semibold text-background uppercase tracking-wider mb-4">Plataforma</h4>
                <ul className="space-y-3">
                  {[
                    { href: '/planes', label: 'Planes' },
                    { href: '/tienda', label: 'Tienda' },
                    { href: '/nosotros', label: 'Nosotros' },
                    { href: '/empresa', label: 'Empresa' },
                    { href: '/blog', label: 'Novedades' },
                    { href: '/contacto', label: 'Contacto' },
                  ].map(l => (
                    <li key={l.href}>
                      <Link
                        to={l.href}
                        className="text-sm text-background/60 hover:text-background transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-background uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-3">
                  {['Terminos de servicio', 'Politica de privacidad', 'Politica de cookies', 'Aviso legal'].map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-xs font-semibold text-background uppercase tracking-wider mb-4">Contacto</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`mailto:${companyEmail}`}
                      className="text-sm text-background/60 hover:text-background transition-colors flex items-start gap-2.5"
                    >
                      <Mail className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span className="break-all">{companyEmail}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${companyPhone.replace(/\s/g, '')}`}
                      className="text-sm text-background/60 hover:text-background transition-colors flex items-start gap-2.5"
                    >
                      <Phone className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span>{companyPhone}</span>
                    </a>
                  </li>
                  <li className="text-sm text-background/60 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                    <span>{companyAddress}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-background/40">Hecho en Lima, Peru</p>
        </div>
      </div>
    </footer>
  );
}
