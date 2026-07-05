import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router';
import {
  X, Sun, Moon, ChevronDown, LogOut, LayoutDashboard, User,
  ShoppingBag, Package, Heart, Menu, Settings, GitBranch,
  SlidersHorizontal, Phone, FileText, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useConfig } from '@/store/configStore';
import { useCart } from '@/store/cartStore';
import { LogoWithText } from '@/components/Logo';

const navLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/planes', label: 'Planes' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

function DesktopUserMenu() {
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
        className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border/60 hover:bg-muted/50 transition-all duration-200"
      >
        <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>
        <span className="text-sm font-medium text-foreground max-w-[90px] truncate">
          {user.full_name?.split(' ')[0] || 'Usuario'}
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground truncate text-sm">{user.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <div className="p-1.5">
            {[
              { icon: LayoutDashboard, label: 'Mi Panel', path: '/dashboard' },
              { icon: User, label: 'Mi Perfil', path: '/dashboard/perfil' },
              { icon: GitBranch, label: 'Mi Red', path: '/dashboard/red' },
              { icon: Settings, label: 'Configuracion', path: '/dashboard/configuracion' },
            ].map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-foreground transition-colors text-left">
                <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />{item.label}
              </button>
            ))}
          </div>
          <div className="p-1.5 border-t border-border">
            {[
              { icon: ShoppingBag, label: 'Tienda', path: '/tienda' },
              { icon: Package, label: 'Mis Pedidos', path: '/dashboard/pedidos' },
              { icon: Heart, label: 'Favoritos', path: '/favoritos' },
            ].map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-foreground transition-colors text-left">
                <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />{item.label}
              </button>
            ))}
          </div>
          <div className="p-1.5 border-t border-border">
            <button onClick={async () => { await signOut(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-500 transition-colors text-left">
              <LogOut className="w-4 h-4 flex-shrink-0" />Cerrar sesion
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

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { html.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = user
    ? (user.full_name || user.email || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  // Quick access buttons for logged-in users
  const loggedInQuickActions = [
    { icon: LayoutDashboard, label: 'Panel', action: () => navigate('/dashboard') },
    { icon: Package, label: 'Pedidos', action: () => navigate('/dashboard/pedidos') },
    { icon: Heart, label: 'Favoritos', action: () => navigate('/favoritos') },
    { icon: SlidersHorizontal, label: 'Comparar', action: () => navigate('/tienda/comparar') },
  ];

  // Quick access for guests — public-facing, useful for discovery
  const guestQuickActions = [
    { icon: ShoppingBag, label: 'Tienda', action: () => navigate('/tienda') },
    { icon: FileText, label: 'Planes', action: () => navigate('/planes') },
    { icon: BookOpen, label: 'Blog', action: () => navigate('/blog') },
    { icon: Phone, label: 'Contacto', action: () => navigate('/contacto') },
  ];

  const quickActions = isLoggedIn ? loggedInQuickActions : guestQuickActions;

  return (
    <>
      {/* ── Fixed top bar — z-50, always on top ─────────────────────── */}
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-background border-b border-border/50 shadow-sm'
          : 'bg-background',
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <LogoWithText
                value={logoValue}
                fallbackText={companyName}
                size="w-8 h-8"
                textClass="text-lg font-bold text-foreground"
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                    location.pathname === link.href || location.pathname.startsWith(link.href + '/')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right controls */}
            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => navigate('/carrito')}
                className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Carrito">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cambiar tema">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isLoggedIn ? (
                <div className="hidden md:block ml-1"><DesktopUserMenu /></div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Ingresar
                  </Link>
                  <Link to="/registro" className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/60 text-foreground transition-colors ml-1"
                aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay — starts BELOW navbar (top-16), z-40 < navbar z-50 ── */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed top-16 left-0 right-0 bottom-0 z-40 lg:hidden',
          'transition-opacity duration-250',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop — does NOT cover the navbar */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* Bottom-sheet panel */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl border-t border-border shadow-2xl',
            'transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>

          <div className="px-4 pt-3 pb-6 overflow-y-auto max-h-[calc(100vh-5rem)]">

            {/* User card — only when logged in */}
            {isLoggedIn && user && (
              <button
                onClick={() => { navigate('/dashboard/perfil'); setMobileOpen(false); }}
                className="w-full mb-4 p-4 bg-gradient-to-r from-primary/8 to-muted/30 border border-border/50 rounded-2xl flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/15">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-primary">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 flex-shrink-0" />
              </button>
            )}

            {/* Auth buttons — only when NOT logged in */}
            {!isLoggedIn && (
              <div className="flex gap-2 mb-4">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-center text-sm font-semibold text-foreground bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors">
                  Ingresar
                </Link>
                <Link to="/registro" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-center text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Navigation links grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                  className={cn(
                    'py-3 rounded-xl text-center text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/40 text-foreground hover:bg-muted/60',
                  )}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Quick access icons — conditional on auth state */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickActions.map(({ icon: Icon, label, action }) => (
                <button key={label} onClick={() => { action(); setMobileOpen(false); }}
                  className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors active:scale-95">
                  <Icon className="w-5 h-5 text-foreground" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>

            {/* Logged-in bottom actions */}
            {isLoggedIn && (
              <div className="flex gap-2">
                <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                  className="flex-1 py-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />Mi Panel
                </button>
                <button onClick={async () => { await signOut(); setMobileOpen(false); }}
                  className="w-12 flex items-center justify-center border border-red-400/40 text-red-500 rounded-xl hover:bg-red-500/8 transition-colors"
                  aria-label="Cerrar sesion">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer below fixed nav */}
      <div className="h-16" />
    </>
  );
}
