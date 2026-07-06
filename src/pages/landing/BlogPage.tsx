import { useState } from 'react';
import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Clock, Eye, ArrowRight, Video, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['Todos', 'Estrategia', 'Rangos', 'Comisiones', 'Marketing', 'Tutoriales'];

const articles = [
  { id: 1, type: 'article', category: 'Estrategia', title: 'Cómo alcanzar el rango Diamante en 6 meses', excerpt: 'Sistema comprobado para escalar rangos rápidamente.', author: 'Carlos Mendoza', date: '15 Jun 2025', readTime: '8 min', views: 4280, image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, type: 'video', category: 'Tutoriales', title: 'Tour completo del dashboard', excerpt: 'Recorrido por cada función del panel de control.', author: 'Ana Rodríguez', date: '12 Jun 2025', readTime: '22 min', views: 6150, image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, type: 'article', category: 'Comisiones', title: 'Comisiones binarias: Guía definitiva 2025', excerpt: 'Algoritmo del sistema binario explicado.', author: 'Luis García', date: '10 Jun 2025', readTime: '6 min', views: 3890, image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, type: 'video', category: 'Marketing', title: '5 scripts de ventas que convierten', excerpt: 'Guiones probados para invitar sin presionar.', author: 'María Torres', date: '8 Jun 2025', readTime: '18 min', views: 5420, image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, type: 'article', category: 'Rangos', title: 'Sistema de rangos: del Bronce a la Corona', excerpt: 'Requisitos, bonos y beneficios de cada nivel.', author: 'Ana Rodríguez', date: '2 Jun 2025', readTime: '5 min', views: 4100, image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

function formatViews(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString(); }

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeFormat, setActiveFormat] = useState<'all' | 'video' | 'article'>('all');
  const [search, setSearch] = useState('');

  const filtered = articles.filter(a => {
    if (activeCategory !== 'Todos' && a.category !== activeCategory) return false;
    if (activeFormat !== 'all' && a.type !== activeFormat) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Blog</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Recursos</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">Artículos y tutoriales</h1>
            </div>
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary transition-all" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {([{ value: 'all', label: 'Todos' }, { value: 'article', label: 'Artículos' }, { value: 'video', label: 'Videos' }] as const).map(f => (
                <button key={f.value} onClick={() => setActiveFormat(f.value)}
                  className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    activeFormat === f.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                  {f.label}
                </button>
              ))}
            </div>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No se encontraron resultados.</p>
              <button onClick={() => { setActiveCategory('Todos'); setActiveFormat('all'); setSearch(''); }}
                className="mt-3 text-primary text-sm font-medium hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(article => (
                <Link key={article.id} to={`/blog/${article.id}`} className="group block">
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {article.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      <span className={cn('absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold',
                        article.type === 'video' ? 'bg-rose-500 text-white' : 'bg-black/50 text-white')}>
                        {article.type === 'video' ? 'Video' : 'Artículo'}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{article.category}</span>
                      <h3 className="font-semibold text-foreground text-sm mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto text-[11px] text-muted-foreground">
                        <span>{article.author}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(article.views)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">¿Quieres más recursos?</h2>
          <p className="text-sm text-muted-foreground mb-4">Crea tu cuenta y accede a todo el contenido.</p>
          <Link to="/registro" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
