import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router';
import {
  X, Sun, Moon, ChevronDown, LogOut, LayoutDashboard, User,
  ShoppingBag, ShoppingCart, Package, Heart, ArrowRight, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useConfig } from '@/store/configStore';
import { useCart } from '@/store/cartStore';
import Logo from '@/components/Logo';

const navLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/planes', label: 'Planes' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

function CartButton() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/carrito')}
      className="relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="w-4 h-4" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[9px] font-black flex items-center justify-center leading-none">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}

function UserMenu() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const initials = (user.full_name || user.email || 'U')
    .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-border hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
          {user.avatar_url
            ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{initials}</div>}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block max-w-[90px] truncate">
          {user.full_name?.split(' ')[0] || 'Usuario'}
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
              {user.avatar_url
                ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{initials}</div>}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground truncate">{user.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              {user.plan && <div className="text-[10px] text-primary font-semibold capitalize mt-0.5 bg-primary/10 px-1.5 py-0.5 rounded-full inline-block">{user.plan}</div>}
            </div>
          </div>
          <div className="py-1">
            <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mi cuenta</p>
            {[
              { icon: LayoutDashboard, label: 'Mi Panel', path: '/dashboard' },
              { icon: User, label: 'Mi Perfil', path: '/dashboard/perfil' },
            ].map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors text-left">
                <item.icon className="w-4 h-4 text-muted-foreground" /> {item.label}
              </button>
            ))}
          </div>
          <div className="py-1 border-t border-border">
            <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tienda</p>
            {[
              { icon: ShoppingBag, label: 'Ver Tienda', path: '/tienda' },
              { icon: ShoppingCart, label: 'Mi Carrito', path: '/carrito' },
              { icon: Package, label: 'Mis Pedidos', path: '/dashboard/pedidos' },
              { icon: Heart, label: 'Mis Favoritos', path: '/favoritos' },
            ].map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors text-left">
                <item.icon className="w-4 h-4 text-muted-foreground" /> {item.label}
              </button>
            ))}
          </div>
          <div className="py-1 border-t border-border">
            <button onClick={async () => { await signOut(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 text-sm text-red-500 transition-colors text-left">
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const { company, logoValue } = useConfig();
  const { itemCount } = useCart();
  const companyName = company.company_name || 'MLM 360';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';
  const isLoggedIn = !!user;

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = user
    ? (user.full_name || user.email || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <>
      {/* ── Top bar ── */}
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2">
          {/* Logo — single instance in the top bar */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-4">
            <Logo
              value={logoValue}
              fallbackText={companyName}
              size="w-8 h-8"
            />
            <span className="text-lg font-bold text-foreground">{companyName}</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  location.pathname === link.href || location.pathname.startsWith(link.href + '/')
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1.5">
            <CartButton />

            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              aria-label="Cambiar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn ? (
              <div className="hidden md:block">
                <UserMenu />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
                  Ingresar
                </Link>
                <Link to="/registro"
                  className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile hamburger — only shows on < lg */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              <span className={cn('absolute transition-all duration-200', mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90')}>
                <X className="w-5 h-5" />
              </span>
              <span className={cn('absolute transition-all duration-200', mobileOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0')}>
                <Menu className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-screen mobile overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 lg:hidden flex flex-col',
          'transition-all duration-300 ease-in-out',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'hsl(var(--background))' }}
      >
        {/* Ambient background accents */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/6 rounded-full blur-[80px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/4 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
        </div>

        {/* ── Zone 1: Header row (no logo duplication — just close button) ── */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/50 flex-shrink-0">
          {/* Logo inside mobile menu — this is the ONLY logo in this overlay */}
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
            <Logo value={logoValue} fallbackText={companyName} size="w-8 h-8" />
            <span className="text-base font-bold text-foreground">{companyName}</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center hover:bg-muted text-foreground transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User identity card (logged in) */}
        {isLoggedIn && user && (
          <div className={cn(
            'mx-4 mt-4 p-4 bg-muted/50 border border-border rounded-2xl flex items-center gap-3',
            'transition-all duration-300 delay-75',
            mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
              {user.avatar_url
                ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{initials}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">{user.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
        )}

        {/* ── Zone 2: Navigation links ── */}
        <nav className="flex-1 flex flex-col overflow-y-auto px-4 py-4" aria-label="Links de navegación">
          <div className="space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between min-h-[56px] px-5 rounded-2xl text-lg font-semibold transition-all duration-300',
                  'focus-visible:outline-2 focus-visible:outline-primary',
                  location.pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:bg-muted hover:text-primary',
                  mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                )}
                style={{ transitionDelay: mobileOpen ? `${i * 35 + 60}ms` : '0ms' }}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}

            {/* Cart link */}
            <button
              onClick={() => { navigate('/carrito'); setMobileOpen(false); }}
              className={cn(
                'w-full flex items-center justify-between min-h-[56px] px-5 rounded-2xl text-lg font-semibold',
                'text-foreground hover:bg-muted hover:text-primary transition-all duration-300',
                'focus-visible:outline-2 focus-visible:outline-primary',
                mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
              )}
              style={{ transitionDelay: mobileOpen ? `${navLinks.length * 35 + 60}ms` : '0ms' }}
            >
              Carrito
              {itemCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-black px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* ── Zone 3: Account CTAs — distinct visual zone ── */}
        <div
          className={cn(
            'flex-shrink-0 bg-muted/30 border-t border-border/60 px-4 pb-8 pt-5 space-y-3',
            'transition-all duration-300',
            mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          )}
          style={{ transitionDelay: mobileOpen ? '300ms' : '0ms' }}
        >
          {/* Theme toggle row */}
          <div className="flex items-center justify-between px-1 pb-3 border-b border-border/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Apariencia</span>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="min-h-[44px] min-w-[44px] flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {isDark ? <><Sun className="w-4 h-4" /> Claro</> : <><Moon className="w-4 h-4" /> Oscuro</>}
            </button>
          </div>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full min-h-[52px] px-4 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                <LayoutDashboard className="w-4 h-4" /> Ir a mi panel
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
              <button
                onClick={async () => { await signOut(); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full min-h-[48px] px-4 rounded-2xl border border-red-400/30 text-red-500 text-sm font-semibold hover:bg-red-500/8 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/registro"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full min-h-[52px] px-4 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                Registrarse gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full min-h-[48px] px-4 rounded-2xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
              >
                Ingresar al sistema
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
