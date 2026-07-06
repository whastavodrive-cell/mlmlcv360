import { useState } from 'react';
import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Play, Clock, Eye, ArrowRight, BookOpen, Video, Tag, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['Todos', 'Estrategia', 'Rangos', 'Comisiones', 'Marketing', 'Tutoriales', 'Liderazgo'];

const articles = [
  {
    id: 1,
    type: 'article',
    category: 'Estrategia',
    title: 'Cómo alcanzar el rango Diamante en 6 meses: estrategia paso a paso',
    excerpt: 'Descubre el sistema comprobado que usan nuestros afiliados más exitosos para escalar rangos rápidamente sin desgastarse en el proceso.',
    author: 'Carlos Mendoza',
    date: '15 Jun 2025',
    readTime: '8 min',
    views: 4280,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: 2,
    type: 'video',
    category: 'Tutoriales',
    title: 'Tour completo del dashboard: todo lo que necesitas saber',
    excerpt: 'Recorremos cada función del panel de control, desde la gestión de tu red hasta la descarga de reportes.',
    author: 'Ana Rodríguez',
    date: '12 Jun 2025',
    readTime: '22 min',
    views: 6150,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 3,
    type: 'article',
    category: 'Comisiones',
    title: '¿Cómo se calculan las comisiones binarias? Guía definitiva 2025',
    excerpt: 'Explica de manera clara el algoritmo de comisiones del sistema binario y cómo optimizar tu red para maximizar tus ganancias.',
    author: 'Luis García',
    date: '10 Jun 2025',
    readTime: '6 min',
    views: 3890,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 4,
    type: 'video',
    category: 'Marketing',
    title: '5 scripts de ventas que convierten: cómo invitar sin presionar',
    excerpt: 'Aprende a presentar MLM 360 de manera natural y efectiva con estos guiones probados por nuestros mejores afiliados.',
    author: 'María Torres',
    date: '8 Jun 2025',
    readTime: '18 min',
    views: 5420,
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 5,
    type: 'article',
    category: 'Liderazgo',
    title: 'Cómo mantener motivado a tu equipo en los primeros 90 días',
    excerpt: 'El primer trimestre es crítico para retener a tus afiliados. Estas estrategias de liderazgo te ayudarán a construir un equipo sólido y comprometido.',
    author: 'Roberto Mendoza',
    date: '5 Jun 2025',
    readTime: '7 min',
    views: 2780,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 6,
    type: 'article',
    category: 'Rangos',
    title: 'Sistema de rangos MLM 360: del Bronce a la Corona explicado',
    excerpt: 'Entiende los requisitos, bonos y beneficios de cada rango para planificar tu crecimiento de forma estratégica y sostenible.',
    author: 'Ana Rodríguez',
    date: '2 Jun 2025',
    readTime: '5 min',
    views: 4100,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
];

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

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

  const featured = filtered.find(a => a.featured) || filtered[0];
  const rest = filtered.filter(a => a !== featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Blog</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <BookOpen className="w-3.5 h-3.5" /> Blog & Novedades
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                Recursos para tu crecimiento
              </h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-md">
                Artículos, tutoriales y videos para que puedas dominar MLM 360 y hacer crecer tu negocio.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar artículos..."
                className="w-full pl-9 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary focus:bg-card transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Format tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
              {([
                { value: 'all', label: 'Todos', icon: Tag },
                { value: 'article', label: 'Artículos', icon: BookOpen },
                { value: 'video', label: 'Videos', icon: Video },
              ] as const).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setActiveFormat(value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    activeFormat === value
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron artículos con esos filtros.</p>
              <button onClick={() => { setActiveCategory('Todos'); setActiveFormat('all'); setSearch(''); }}
                className="mt-4 text-primary text-sm font-medium hover:underline">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {featured && (
                <div className="mb-8">
                  <Link to={`/blog/${featured.id}`} className="group block">
                    <div className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                          <img
                            src={featured.image}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {featured.type === 'video' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-white fill-white ml-1" />
                              </div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary text-white">Destacado</span>
                            <span className={cn('px-2.5 py-1 rounded-full text-[11px] font-bold',
                              featured.type === 'video' ? 'bg-rose-500 text-white' : 'bg-black/50 backdrop-blur-sm text-white')}>
                              {featured.type === 'video' ? 'Video' : 'Artículo'}
                            </span>
                          </div>
                        </div>
                        <div className="p-8 lg:p-10 flex flex-col justify-center">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{featured.category}</span>
                          <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
                            {featured.title}
                          </h2>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{featured.author}</span>
                              <span>·</span>
                              <span>{featured.date}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                {featured.type === 'video' ? <Play className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {featured.readTime}
                              </span>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="w-3 h-3" /> {formatViews(featured.views)}
                            </span>
                          </div>
                          <div className="mt-5 pt-5 border-t border-border">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                              {featured.type === 'video' ? 'Ver video' : 'Leer artículo'} <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(article => (
                    <Link key={article.id} to={`/blog/${article.id}`} className="group block">
                      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {article.type === 'video' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold',
                              article.type === 'video' ? 'bg-rose-500 text-white' : 'bg-black/50 backdrop-blur-sm text-white')}>
                              {article.type === 'video' ? 'Video' : 'Artículo'}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">{article.category}</span>
                          <h3 className="text-base font-black text-foreground leading-tight mb-2 flex-1 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="font-medium text-foreground/70">{article.author}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                {article.type === 'video' ? <Play className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {article.readTime}
                              </span>
                            </div>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Eye className="w-3 h-3" /> {formatViews(article.views)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Mantente actualizado
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3 tracking-tight">
            Recibe los mejores recursos
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Suscríbete para recibir nuevos artículos, videos y estrategias directamente en tu correo.
          </p>
          <Link to="/registro"
            className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
