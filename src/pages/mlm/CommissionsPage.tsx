import { useAuthStore } from '@/store/authStore';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, Clock, CircleCheck as CheckCircle, Download, Circle as XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCommissions, useCommissionsPagination, TYPE_LABELS } from '@/modules/mlm';
import { STATUS_CONFIG } from '@/modules/mlm/services/mlmService';
import { Skeleton } from '@/components/ui/skeleton';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="font-semibold text-foreground mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">Comisiones:</span>
        <span className="font-semibold text-foreground">S/ {Number(payload[0].value).toLocaleString()}</span>
      </div>
    </div>
  );
}

function CommissionsSkeleton() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-[220px] w-full rounded-lg" />
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg flex-shrink-0" />
        ))}
      </div>

      {/* Table – 5 columns matching real layout */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {['Fecha', 'Tipo', 'Descripción', 'Estado', 'Monto'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3 px-4 hidden sm:table-cell"><Skeleton className="h-4 w-36" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CommissionsPage() {
  const { user } = useAuthStore();
  const { commissions, loading, stats, chartData, exportCSV } = useCommissions({ userId: user?.id, autoLoad: true });
  const { page, setPage, filter, setFilter, paginatedData, totalPages, total } = useCommissionsPagination(commissions, 10);

  const handleExport = () => {
    exportCSV();
    toast.success('Exportado a CSV');
  };

  if (loading) return <CommissionsSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Comisiones</h1>
          <p className="text-muted-foreground text-sm mt-1">Historial completo de tus comisiones.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total', value: `S/ ${stats.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Pagado', value: `S/ ${stats.paid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
          { label: 'Pendiente', value: `S/ ${stats.pending.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-yellow-500 bg-yellow-500/10' },
          { label: 'Registros', value: String(stats.count), icon: DollarSign, color: 'text-purple-500 bg-purple-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', s.color)}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold text-foreground truncate">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Evolución de comisiones</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="comisiones" name="Comisiones" stroke="#1d4ed8" strokeWidth={2} fill="url(#colorComm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {['all', 'pending', 'approved', 'paid', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground')}>
            {f === 'all' ? 'Todos' : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label || f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Fecha</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Tipo</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Descripcion</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Estado</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Monto</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No hay comisiones registradas</td></tr>
              ) : paginatedData.map(c => {
                const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                const Icon = c.status === 'pending' ? Clock : c.status === 'paid' || c.status === 'approved' ? CheckCircle : XCircle;
                return (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString('es-PE')}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{TYPE_LABELS[c.type] || c.type}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{c.description || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={cn('text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1', sc.color)}>
                        <Icon className="w-3 h-3" /> {sc.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-foreground">S/ {Number(c.amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="text-xs text-muted-foreground">Mostrando {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} de {total}</div>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-muted disabled:opacity-40">Anterior</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-muted disabled:opacity-40">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
