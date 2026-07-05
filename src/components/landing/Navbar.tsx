import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router';
import {
  X, Sun, Moon, ChevronDown, LogOut, LayoutDashboard, User,
  ShoppingBag, Package, Heart, Menu, Settings,
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

function CartBadge() {
  const { itemCount } = useCart();
  return itemCount > 0 ? (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
      {itemCount > 9 ? '9+' : itemCount}
    </span>
  ) : null;
}

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
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">
          {user.full_name?.split(' ')[0] || 'Usuario'}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-bold text-primary">{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{user.full_name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cuenta</p>
            {[
              { icon: LayoutDashboard, label: 'Mi Panel', path: '/dashboard' },
              { icon: User, label: 'Mi Perfil', path: '/dashboard/perfil' },
              { icon: Settings, label: 'Configuracion', path: '/dashboard/configuracion' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-foreground transition-colors text-left"
              >
                <item.icon className="w-4 h-4 text-muted-foreground" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-border">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tienda</p>
            {[
              { icon: ShoppingBag, label: 'Tienda', path: '/tienda' },
              { icon: Package, label: 'Mis Pedidos', path: '/dashboard/pedidos' },
              { icon: Heart, label: 'Favoritos', path: '/favoritos' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-foreground transition-colors text-left"
              >
                <item.icon className="w-4 h-4 text-muted-foreground" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-border">
            <button
              onClick={async () => { await signOut(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-500 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesion
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
    if (mobileOpen) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
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

  return (
    <>
      {/* Main navigation bar */}
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm'
          : 'bg-background',
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 z-10">
              <LogoWithText
                value={logoValue}
                fallbackText={companyName}
                size="w-8 h-8"
                textClass="text-lg font-bold text-foreground"
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    location.pathname === link.href || location.pathname.startsWith(link.href + '/')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => navigate('/carrito')}
                className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <CartBadge />
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Auth buttons - Desktop */}
              {isLoggedIn ? (
                <div className="hidden md:block">
                  <DesktopUserMenu />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/registro"
                    className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  >
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/50 text-foreground transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - Full screen, no scroll issues */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          'transition-opacity duration-300 ease-out',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu panel - slides from bottom */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl',
            'max-h-[90vh] overflow-y-auto',
            'border-t border-border shadow-2xl',
            'transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          {/* Handle indicator */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* User section - Show profile photo when logged in */}
          {isLoggedIn && user ? (
            <div className="px-4 pb-4">
              <button
                onClick={() => { navigate('/dashboard/perfil'); setMobileOpen(false); }}
                className="w-full p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center ring-2 ring-primary/20">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-primary">{initials}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
              </button>
            </div>
          ) : (
            <div className="px-4 pb-4 pt-2">
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-center text-sm font-medium text-foreground bg-muted/50 rounded-xl"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-center text-sm font-semibold bg-primary text-primary-foreground rounded-xl"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="px-4 pb-3">
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'py-3 rounded-xl text-center text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/40 text-foreground hover:bg-muted/60',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Quick actions grid */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => { navigate('/carrito'); setMobileOpen(false); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  <CartBadge />
                </div>
                <span className="text-xs font-medium text-foreground">Carrito</span>
              </button>

              <button
                onClick={() => { navigate('/tienda'); setMobileOpen(false); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <Package className="w-5 h-5 text-foreground" />
                <span className="text-xs font-medium text-foreground">Tienda</span>
              </button>

              <button
                onClick={() => { navigate('/favoritos'); setMobileOpen(false); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <Heart className="w-5 h-5 text-foreground" />
                <span className="text-xs font-medium text-foreground">Favoritos</span>
              </button>

              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
                <span className="text-xs font-medium text-foreground">{isDark ? 'Claro' : 'Oscuro'}</span>
              </button>
            </div>
          </div>

          {/* User actions if logged in */}
          {isLoggedIn && (
            <div className="px-4 pb-6 pt-2 border-t border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                  className="flex-1 py-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" /> Mi Panel
                </button>
                <button
                  onClick={async () => { await signOut(); setMobileOpen(false); }}
                  className="py-3 px-4 flex items-center justify-center gap-2 border border-red-400/40 text-red-500 rounded-xl text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
