import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router';
import {
  X, Sun, Moon, ChevronDown, LogOut, LayoutDashboard, User,
  ShoppingBag, ShoppingCart, Package, Heart, Menu,
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

function CartButton() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/carrito')}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="w-[18px] h-[18px]" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
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
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-border hover:bg-muted/60 transition-colors"
      >
        <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center">
          {user.avatar_url
            ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-primary">{initials}</span>}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block max-w-[80px] truncate">
          {user.full_name?.split(' ')[0] || 'Usuario'}
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2.5 border-b border-border bg-muted/30 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center">
              {user.avatar_url
                ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                : <span className="text-sm font-bold text-primary">{initials}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground truncate">{user.full_name}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <div className="py-1.5">
            {[
              { icon: LayoutDashboard, label: 'Mi Panel', path: '/dashboard' },
              { icon: User, label: 'Mi Perfil', path: '/dashboard/perfil' },
            ].map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-sm text-foreground transition-colors text-left">
                <item.icon className="w-4 h-4 text-muted-foreground" /> {item.label}
              </button>
            ))}
          </div>
          <div className="py-1.5 border-t border-border">
            {[
              { icon: ShoppingBag, label: 'Tienda', path: '/tienda' },
              { icon: Package, label: 'Mis Pedidos', path: '/dashboard/pedidos' },
              { icon: Heart, label: 'Favoritos', path: '/favoritos' },
            ].map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-sm text-foreground transition-colors text-left">
                <item.icon className="w-4 h-4 text-muted-foreground" /> {item.label}
              </button>
            ))}
          </div>
          <div className="py-1.5 border-t border-border">
            <button onClick={async () => { await signOut(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-500/10 text-sm text-red-500 transition-colors text-left">
              <LogOut className="w-4 h-4" /> Cerrar sesion
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
  const companyName = company.company_name || 'MLM 360';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';
  const isLoggedIn = !!user;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = user
    ? (user.full_name || user.email || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <>
      {/* Main navigation bar - always visible */}
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/60'
          : 'bg-background',
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-15 flex items-center gap-3" style={{ height: '60px' }}>
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
            <div className="hidden lg:flex items-center gap-1 flex-1 ml-4">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    location.pathname === link.href || location.pathname.startsWith(link.href + '/')
                      ? 'text-primary bg-primary/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                  )}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right controls */}
            <div className="ml-auto flex items-center gap-1">
              <CartButton />

              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cambiar tema"
              >
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              {isLoggedIn ? (
                <div className="hidden md:block ml-1"><UserMenu /></div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <Link to="/login"
                    className="h-9 px-4 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Ingresar
                  </Link>
                  <Link to="/registro"
                    className="h-9 px-4 flex items-center text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted text-foreground transition-colors ml-1"
                aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out menu - NO duplicate logo or theme button */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegacion"
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          'transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Slide-out panel */}
        <div
          className={cn(
            'absolute top-[60px] right-0 bottom-0 w-[85%] max-w-sm bg-background overflow-y-auto',
            'border-l border-border shadow-2xl',
            'transition-transform duration-200 ease-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {/* User card if logged in */}
          {isLoggedIn && user && (
            <div className="mx-4 mt-4 p-3 bg-muted/40 border border-border/60 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center">
                {user.avatar_url
                  ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-primary">{initials}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{user.full_name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="px-4 py-5">
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center justify-between h-12 px-4 rounded-xl text-base font-medium',
                    'transition-colors',
                    location.pathname === link.href
                      ? 'text-primary bg-primary/8'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Cart */}
              <button
                onClick={() => { navigate('/carrito'); setMobileOpen(false); }}
                className="w-full flex items-center justify-between h-12 px-4 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                Carrito
                {useCart().itemCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {useCart().itemCount}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Bottom actions */}
          <div className="px-4 pb-6 pt-2 border-t border-border">
            {isLoggedIn ? (
              <div className="space-y-2.5">
                <button
                  onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                  className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Mi Panel
                </button>
                <button
                  onClick={async () => { await signOut(); setMobileOpen(false); }}
                  className="w-full h-10 flex items-center justify-center gap-2 border border-red-400/40 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/8 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Cerrar sesion
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <Link
                  to="/registro"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Registrarse gratis
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-10 flex items-center justify-center border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Ingresar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to push content below fixed nav */}
      <div style={{ height: '60px' }} />
    </>
  );
}
