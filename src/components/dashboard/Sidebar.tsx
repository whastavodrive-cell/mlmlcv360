import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useConfig } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@/lib/router';
import { useState } from 'react';
import { LayoutDashboard, Users, GitBranch, DollarSign, Award, ChartBar as BarChart3, Settings, ChevronDown, ChevronRight, X, UserCog, CreditCard, User, ShoppingBag, Package, Truck, Tag, ChartBar as BarChart2, ShoppingCart, FolderOpen, MessageSquare, Shield, Chrome as Home } from 'lucide-react';
import Logo, { LogoWithText } from '@/components/Logo';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const superAdminNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Usuarios', icon: Users, children: [
      { label: 'Todos los usuarios', href: '/dashboard/usuarios', icon: Users },
      { label: 'Roles y permisos', href: '/dashboard/roles', icon: UserCog },
    ],
  },
  {
    label: 'Red MLM', icon: GitBranch, children: [
      { label: 'Mi Red', href: '/dashboard/red', icon: GitBranch },
      { label: 'Comisiones MLM', href: '/dashboard/comisiones', icon: DollarSign },
      { label: 'Rangos', href: '/dashboard/rangos', icon: Award },
    ],
  },
  {
    label: 'Tienda', icon: ShoppingBag, children: [
      { label: 'Productos', href: '/dashboard/admin/productos', icon: Package },
      { label: 'Categorías', href: '/dashboard/admin/categorias', icon: FolderOpen },
      { label: 'Pedidos', href: '/dashboard/admin/pedidos', icon: ShoppingCart },
      { label: 'Cupones', href: '/dashboard/admin/cupones', icon: Tag },
      { label: 'Envíos', href: '/dashboard/admin/envios', icon: Truck },
      { label: 'Comisiones Tienda', href: '/dashboard/admin/comisiones-tienda', icon: DollarSign },
      { label: 'Reseñas', href: '/dashboard/admin/resenas', icon: MessageSquare },
    ],
  },
  { label: 'Mi Plan', href: '/dashboard/mi-plan', icon: CreditCard },
  { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { label: 'Gestión Admin', href: '/dashboard/admin', icon: Shield },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Usuarios', href: '/dashboard/usuarios', icon: Users },
  {
    label: 'Red MLM', icon: GitBranch, children: [
      { label: 'Mi Red', href: '/dashboard/red', icon: GitBranch },
      { label: 'Comisiones MLM', href: '/dashboard/comisiones', icon: DollarSign },
      { label: 'Rangos', href: '/dashboard/rangos', icon: Award },
    ],
  },
  {
    label: 'Tienda', icon: ShoppingBag, children: [
      { label: 'Productos', href: '/dashboard/admin/productos', icon: Package },
      { label: 'Categorías', href: '/dashboard/admin/categorias', icon: FolderOpen },
      { label: 'Pedidos', href: '/dashboard/admin/pedidos', icon: ShoppingCart },
      { label: 'Cupones', href: '/dashboard/admin/cupones', icon: Tag },
      { label: 'Envíos', href: '/dashboard/admin/envios', icon: Truck },
      { label: 'Reseñas', href: '/dashboard/admin/resenas', icon: MessageSquare },
    ],
  },
  { label: 'Mi Plan', href: '/dashboard/mi-plan', icon: CreditCard },
  { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { label: 'Gestión Admin', href: '/dashboard/admin', icon: Shield },
];

const userNav: NavItem[] = [
  { label: 'Mi Panel', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mi Perfil', href: '/dashboard/perfil', icon: User },
  { label: 'Mi Red', href: '/dashboard/red', icon: GitBranch },
  { label: 'Mis Comisiones', href: '/dashboard/comisiones', icon: DollarSign },
  { label: 'Mi Rango', href: '/dashboard/rangos', icon: Award },
  { label: 'Mi Plan', href: '/dashboard/mi-plan', icon: CreditCard },
  { label: 'Mis Pedidos', href: '/dashboard/pedidos', icon: ShoppingCart },
  { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart2 },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

const inspectorNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Usuarios', href: '/dashboard/usuarios', icon: Users },
  { label: 'Red MLM', href: '/dashboard/red', icon: GitBranch },
  { label: 'Comisiones', href: '/dashboard/comisiones', icon: DollarSign },
  { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
];

function getNavForRole(role: string): NavItem[] {
  if (role === 'super_admin') return superAdminNav;
  if (role === 'admin') return adminNav;
  if (role === 'inspector') return inspectorNav;
  return userNav;
}

function NavItemComponent({
  item,
  collapsed,
  onNavigate,
  pathname,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
  pathname: string;
}) {
  const isActiveLeaf = item.href
    ? item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === item.href || pathname.startsWith(item.href + '/')
    : false;

  const isActiveParent = item.children?.some(c =>
    c.href && (pathname === c.href || pathname.startsWith(c.href + '/'))
  );

  const isActive = isActiveLeaf || isActiveParent;

  // Auto-open if a child is currently active
  const [open, setOpen] = useState(() => Boolean(isActiveParent));

  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm cursor-pointer',
            isActive
              ? 'text-primary bg-primary/10 font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            collapsed && 'lg:justify-center lg:px-2',
          )}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open
                ? <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                : <ChevronRight className="w-3.5 h-3.5 transition-transform" />
              }
            </>
          )}
        </button>

        {open && !collapsed && (
          <div className="ml-7 mt-0.5 space-y-0.5 border-l border-border/50 pl-3">
            {item.children.map(child => {
              const childActive = child.href
                ? pathname === child.href || pathname.startsWith(child.href + '/')
                : false;
              return (
                <Link
                  key={child.href}
                  to={child.href!}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    childActive
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href!}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm',
        isActive
          ? 'text-primary bg-primary/10 font-semibold'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        collapsed && 'lg:justify-center lg:px-2',
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </Link>
  );
}

function MobileExpandableSection({ item, onNavigate, pathname }: { item: NavItem; onNavigate: () => void; pathname: string }) {
  const isActiveParent = item.children?.some(c => c.href && pathname.startsWith(c.href));
  const [expanded, setExpanded] = useState(Boolean(isActiveParent));

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className={cn(
          'w-full flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-medium transition-colors',
          isActiveParent ? 'bg-primary/10 text-primary' : 'bg-muted/40 text-foreground hover:bg-muted/60',
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {expanded
          ? <ChevronDown className="w-4 h-4" />
          : <ChevronRight className="w-4 h-4" />
        }
      </button>
      {expanded && item.children && (
        <div className="grid grid-cols-2 gap-1.5 mt-1.5 px-1">
          {item.children.map(child => {
            const childActive = child.href ? pathname.startsWith(child.href) : false;
            return (
              <Link
                key={child.href}
                to={child.href!}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm transition-colors',
                  childActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-muted/40 text-foreground hover:bg-muted/60 active:scale-95',
                )}
              >
                <child.icon className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { company, logoValue } = useConfig();
  const location = useLocation();
  const pathname = location.pathname;

  const role = (user as any)?.role || 'user';
  const navItems = getNavForRole(role);
  const name = company.company_name || 'MLM360';

  const initials = user
    ? (user.full_name || user.email || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Desktop Sidebar ────────────────────────────────────── */}
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300',
        'hidden lg:flex',
        sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
      )}>
        {/* Logo header */}
        <div className={cn(
          'flex items-center gap-3 p-4 border-b border-border flex-shrink-0 min-h-[64px]',
          sidebarCollapsed ? 'justify-center px-2' : '',
        )}>
          {sidebarCollapsed ? (
            <Logo value={logoValue} fallbackText={name} size="w-9 h-9" />
          ) : (
            <LogoWithText
              value={logoValue}
              fallbackText={name}
              size="w-9 h-9"
              textClass="text-sm font-black text-foreground truncate"
            />
          )}
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-2 border-b border-border/50 flex-shrink-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {role.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {navItems.map((item, i) => (
            <NavItemComponent
              key={i}
              item={item}
              collapsed={sidebarCollapsed}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* Bottom: user card + collapse toggle */}
        <div className="border-t border-border flex-shrink-0 p-2">
          {sidebarCollapsed ? (
            /* Collapsed: just avatar + collapse toggle stacked */
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-primary">{initials}</span>
                )}
              </div>
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-9 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Expandir"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Expanded: user card row + collapse */
            <div>
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-muted transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-primary">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user?.full_name || user?.username || 'Usuario'}</p>
                  <p className="text-[10px] text-muted-foreground capitalize truncate">{role.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                  title="Colapsar"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Mobile Sidebar — Bottom Sheet ──────────────────────── */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="bg-background rounded-t-3xl border-t border-border shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-3">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{initials}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user?.full_name || name}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider capitalize">
                  {role.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable nav */}
          <div className="px-4 pb-2 overflow-y-auto max-h-[65vh]">
            {/* Grid for simple (no-children) items */}
            {(() => {
              const simple = navItems.filter(item => !item.children);
              return simple.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {simple.map(item => {
                    const active = item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : item.href ? pathname.startsWith(item.href) : false;
                    return (
                      <Link
                        key={item.href}
                        to={item.href!}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 py-3 rounded-xl transition-colors text-center',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted/40 text-foreground hover:bg-muted/60 active:scale-95',
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs font-medium leading-tight">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null;
            })()}

            {/* Expandable group sections */}
            {navItems.filter(item => item.children).map(item => (
              <MobileExpandableSection
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={() => setSidebarOpen(false)}
              />
            ))}

            {/* Quick shortcuts */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-muted/50 text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              <Link
                to="/tienda"
                onClick={() => setSidebarOpen(false)}
                className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Tienda
              </Link>
            </div>
          </div>

          <div className="h-safe-area-bottom h-6" />
        </div>
      </div>

    </>
  );
}
