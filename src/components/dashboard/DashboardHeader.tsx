import { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabase } from '@/lib/backend';
import { Link, useNavigate } from '@/lib/router';
import { Bell, Search, Moon, Sun, Menu, LogOut, User, Settings, ChevronDown, ExternalLink, CheckCheck, Trash2, X, Users, Package, ShoppingBag, LayoutDashboard, GitBranch, CreditCard } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface SearchResult {
  type: 'user' | 'product' | 'order';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const database = useDatabase();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    const found: SearchResult[] = [];
    const lower = q.toLowerCase();
    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'inspector';

    try {
      if (isAdmin) {
        const { data: users } = await database.select<any>('profiles', { select: ['id', 'full_name', 'email', 'username'], limit: 20 });
        if (Array.isArray(users)) {
          users.filter((u: any) =>
            u.full_name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower) || u.username?.toLowerCase().includes(lower)
          ).slice(0, 4).forEach((u: any) => found.push({ type: 'user', id: u.id, title: u.full_name || u.username || 'Usuario', subtitle: u.email, href: '/dashboard/usuarios' }));
        }
      }
      const { data: products } = await database.select<any>('products', { select: ['id', 'name', 'sku'], limit: 20 });
      if (Array.isArray(products)) {
        products.filter((p: any) => p.name?.toLowerCase().includes(lower) || p.sku?.toLowerCase().includes(lower))
          .slice(0, 4).forEach((p: any) => found.push({ type: 'product', id: p.id, title: p.name, subtitle: p.sku ? `SKU: ${p.sku}` : 'Producto', href: `/tienda/${p.id}` }));
      }
      if (isAdmin) {
        const { data: orders } = await database.select<any>('orders', { select: ['id', 'order_number', 'status'], limit: 20 });
        if (Array.isArray(orders)) {
          orders.filter((o: any) => o.order_number?.toLowerCase().includes(lower) || o.id?.toLowerCase().includes(lower))
            .slice(0, 3).forEach((o: any) => found.push({ type: 'order', id: o.id, title: `Pedido #${o.order_number || o.id.slice(0, 8)}`, subtitle: o.status || 'Orden', href: '/dashboard/admin/pedidos' }));
        }
      }
    } catch { /* silent */ }

    setResults(found.slice(0, 8));
    setLoading(false);
  }, [database, user?.role]);

  useEffect(() => {
    const t = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(t);
  }, [query, performSearch]);

  const go = (href: string) => { navigate(href); onClose(); };

  const iconFor = (type: string) => type === 'user' ? Users : type === 'product' ? Package : ShoppingBag;

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'inspector';

  const quickLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: User, label: 'Mi Perfil', href: '/dashboard/perfil' },
    { icon: CreditCard, label: 'Mi Plan', href: '/dashboard/mi-plan' },
    { icon: GitBranch, label: 'Mi Red', href: '/dashboard/red' },
    ...(isAdmin ? [
      { icon: Users, label: 'Usuarios', href: '/dashboard/usuarios' },
      { icon: Settings, label: 'Configuración', href: '/dashboard/configuracion' },
    ] : []),
  ];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background">
      {/* Search input bar */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar usuarios, productos, pedidos..."
          className="flex-1 bg-transparent text-base outline-none text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => setQuery('')} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        <button onClick={onClose} className="ml-1 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          Cancelar
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {/* Idle state — show quick links */}
        {query.length < 2 && (
          <div className="py-2">
            <p className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Accesos rápidos
            </p>
            {quickLinks.map(link => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-muted/70 flex items-center justify-center flex-shrink-0">
                  <link.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{link.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading — skeletons */}
        {query.length >= 2 && loading && (
          <div className="py-2">
            <p className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Buscando...
            </p>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {query.length >= 2 && !loading && results.length > 0 && (
          <div className="py-2">
            <p className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Resultados
            </p>
            {results.map(result => {
              const Icon = iconFor(result.type);
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => go(result.href)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted transition-colors active:scale-[0.99]"
                >
                  <div className="w-9 h-9 rounded-xl bg-muted/70 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Sin resultados</p>
            <p className="text-xs text-muted-foreground">No encontramos nada para "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardHeader() {
  const { theme, setTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const database = useDatabase();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState('');
  const [desktopResults, setDesktopResults] = useState<SearchResult[]>([]);
  const [desktopLoading, setDesktopLoading] = useState(false);
  const [desktopFocused, setDesktopFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const unread = dbNotifications.filter(n => !n.read).length;
  const isDark = theme === 'dark';

  // Close desktop search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setDesktopFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const performDesktopSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setDesktopResults([]); return; }
    setDesktopLoading(true);
    const found: SearchResult[] = [];
    const lower = q.toLowerCase();
    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'inspector';

    try {
      if (isAdmin) {
        const { data: users } = await database.select<any>('profiles', { select: ['id', 'full_name', 'email', 'username'], limit: 20 });
        if (Array.isArray(users)) {
          users.filter((u: any) =>
            u.full_name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower) || u.username?.toLowerCase().includes(lower)
          ).slice(0, 3).forEach((u: any) => found.push({ type: 'user', id: u.id, title: u.full_name || u.username, subtitle: u.email, href: '/dashboard/usuarios' }));
        }
      }
      const { data: products } = await database.select<any>('products', { select: ['id', 'name', 'sku'], limit: 20 });
      if (Array.isArray(products)) {
        products.filter((p: any) => p.name?.toLowerCase().includes(lower) || p.sku?.toLowerCase().includes(lower))
          .slice(0, 3).forEach((p: any) => found.push({ type: 'product', id: p.id, title: p.name, subtitle: p.sku ? `SKU: ${p.sku}` : 'Producto', href: `/tienda/${p.id}` }));
      }
    } catch { /* silent */ }

    setDesktopResults(found.slice(0, 6));
    setDesktopLoading(false);
  }, [database, user?.role]);

  useEffect(() => {
    const t = setTimeout(() => performDesktopSearch(desktopQuery), 300);
    return () => clearTimeout(t);
  }, [desktopQuery, performDesktopSearch]);

  const goDesktop = (href: string) => { navigate(href); setDesktopQuery(''); setDesktopResults([]); setDesktopFocused(false); };

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoadingNotifs(true);
    const { data } = await database.select<any>('notifications', {
      filter: { user_id: user.id },
      order: { column: 'created_at', ascending: false },
      limit: 10,
    });
    setDbNotifications((data as any[]) || []);
    setLoadingNotifs(false);
  }, [user?.id, database]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await database.rpc('mark_notification_read', { p_notification_id: id });
    setDbNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    if (!user?.id || unread === 0) return;
    await database.rpc('mark_all_notifications_read', { p_user_id: user.id });
    setDbNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = async (id: string) => {
    await database.delete('notifications', id);
    setDbNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const iconFor = (type: string) => type === 'user' ? Users : type === 'product' ? Package : ShoppingBag;

  return (
    <>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile: search icon button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex lg:hidden w-9 h-9 rounded-full items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Desktop: search bar with inline results */}
        <div ref={desktopSearchRef} className="relative hidden lg:block flex-1 max-w-md">
          <div className={cn(
            'flex items-center gap-2 bg-muted/50 border rounded-full px-4 h-10 transition-all duration-200',
            desktopFocused ? 'border-primary/40 bg-background shadow-sm' : 'border-border/50',
          )}>
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={desktopQuery}
              onChange={e => setDesktopQuery(e.target.value)}
              onFocus={() => setDesktopFocused(true)}
              placeholder="Buscar usuarios, productos, pedidos..."
              className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            />
            {desktopQuery && (
              <button onClick={() => { setDesktopQuery(''); setDesktopResults([]); }} className="p-0.5 hover:bg-muted rounded-full">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Desktop results dropdown */}
          {desktopFocused && desktopQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
              {desktopLoading ? (
                <div className="py-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                      <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-3/4 rounded" />
                        <Skeleton className="h-2.5 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : desktopResults.length > 0 ? (
                <div className="py-1">
                  {desktopResults.map(r => {
                    const Icon = iconFor(r.type);
                    return (
                      <button key={`${r.type}-${r.id}`} onClick={() => goDesktop(r.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">Sin resultados para "{desktopQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link to="/" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-muted text-muted-foreground transition-colors">
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={(open) => { setNotifOpen(open); if (open) fetchNotifications(); }}>
            <DropdownMenuTrigger asChild>
              <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors">
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-sm">Notificaciones</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{unread} nuevas</Badge>
                  {unread > 0 && (
                    <button onClick={markAllAsRead} title="Marcar todas como leídas"
                      className="text-muted-foreground hover:text-primary transition-colors">
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifs ? (
                  <div className="px-4 py-8 text-center">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : dbNotifications.length > 0 ? dbNotifications.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      'group flex gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 cursor-pointer',
                      !n.read && 'bg-primary/5'
                    )}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      n.type === 'success' ? 'bg-green-500/20 text-green-500' :
                      n.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                      n.type === 'error' ? 'bg-red-500/20 text-red-500' :
                      'bg-blue-500/20 text-blue-500'
                    )}>
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm text-foreground', !n.read && 'font-semibold')}>{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(n.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="px-4 py-12 text-center">
                    <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Sin notificaciones</p>
                  </div>
                )}
              </div>
              {dbNotifications.length > 0 && (
                <div className="px-4 py-2 border-t border-border">
                  <button onClick={markAllAsRead} className="w-full text-xs text-primary hover:text-primary/80 text-center transition-colors py-1">
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-muted transition-colors ml-1">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name || 'Avatar'}
                    className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {user?.full_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-foreground leading-tight">{user?.full_name || user?.username || 'Usuario'}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ') || 'Usuario'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/perfil" className="flex items-center gap-2 rounded-xl">
                  <User className="w-4 h-4" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/configuracion" className="flex items-center gap-2 rounded-xl">
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive flex items-center gap-2 rounded-xl">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
