import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useConfig } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@/lib/router';
import { useState } from 'react';
import { LayoutDashboard, Users, GitBranch, DollarSign, Award, ChartBar as BarChart3, Settings, ChevronDown, X, ChevronLeft, UserCog, CreditCard, User, ShoppingBag, Package, Truck, Tag, ChartBar as BarChart2, ShoppingCart, FolderOpen, MessageSquare, Shield } from 'lucide-react';
import Logo, { LogoWithText } from '@/components/Logo';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string;
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
  { label: 'Tienda', href: '/tienda', icon: ShoppingBag },
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

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = item.href
    ? location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
    : item.children?.some(c => c.href && location.pathname.startsWith(c.href));

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm',
            isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            collapsed && 'lg:justify-center lg:px-0',
          )}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-7 mt-0.5 space-y-0.5">
            {item.children.map(child => (
              <Link
                key={child.href}
                to={child.href!}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  location.pathname === child.href ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href!}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm',
        isActive ? 'text-primary bg-primary/10 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        collapsed && 'lg:justify-center lg:px-0',
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { company, logoValue } = useConfig();

  const role = (user as any)?.role || 'user';
  const navItems = getNavForRole(role);
  const name = company.company_name || 'MLM360';

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        'fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px]',
        sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]',
      )}>
        {/* Logo header */}
        <div className={cn(
          'flex items-center gap-3 p-4 border-b border-border flex-shrink-0',
          sidebarCollapsed && 'lg:justify-center lg:px-2',
        )}>
          {sidebarCollapsed ? (
            /* Collapsed: icon only */
            <Logo value={logoValue} fallbackText={name} size="w-9 h-9" />
          ) : (
            /* Expanded: logo + text label + role */
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <LogoWithText
                value={logoValue}
                fallbackText={name}
                size="w-9 h-9"
                textClass="text-sm font-black text-foreground truncate"
              />
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role badge — only when expanded */}
        {!sidebarCollapsed && (
          <div className="px-4 py-2 border-b border-border/50 flex-shrink-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider capitalize">
              {role.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item, i) => (
            <NavItemComponent key={i} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="p-3 border-t border-border flex-shrink-0 hidden lg:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
            {!sidebarCollapsed && 'Colapsar'}
          </button>
        </div>
      </aside>
    </>
  );
}
