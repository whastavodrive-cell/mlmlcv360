import { useState } from 'react';
import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Play, Clock, Eye, ChevronRight, Film, Newspaper, Video, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos
interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  type: 'article' | 'video';
  category: string;
  image: string;
  videoUrl?: string;
  duration?: string;
  views?: number;
  date: string;
  author: { name: string; avatar: string };
  content: string;
}

// Datos de ejemplo - En producción vendría de la BD
const articles: Article[] = [
  {
    id: '1',
    slug: 'estrategias-duplicar-red-90-dias',
    title: 'Estrategias para duplicar tu red en 90 días',
    excerpt: 'Técnicas probadas por los líderes Diamante para acelerar el crecimiento exponencial de tu red.',
    type: 'video',
    category: 'Estrategia',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:45',
    views: 3420,
    date: '2024-06-15',
    author: { name: 'Gustavo Ortiz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
    content: 'Contenido completo del artículo...',
  },
  {
    id: '2',
    slug: 'como-alcanzar-rango-diamante',
    title: 'Guía completa para alcanzar el rango Diamante',
    excerpt: 'Todo lo que necesitas saber sobre requisitos, estrategias y mentalidad para el máximo rango.',
    type: 'article',
    category: 'Rangos',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-06-10',
    author: { name: 'María González', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
    content: 'Contenido completo del artículo...',
  },
  {
    id: '3',
    slug: 'maximizar-comisiones-binarias',
    title: 'Maximiza tus comisiones binarias',
    excerpt: 'Optimiza el balance de tu red para cobrar el máximo cada quincena.',
    type: 'video',
    category: 'Comisiones',
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '8:30',
    views: 2180,
    date: '2024-06-05',
    author: { name: 'Carlos Torres', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
    content: 'Contenido completo del artículo...',
  },
  {
    id: '4',
    slug: 'marketing-digital-mlm-marca-personal',
    title: 'Marketing digital para MLM: Tu marca personal',
    excerpt: 'Usa redes sociales para atraer afiliados de calidad sin parecer un vendedor.',
    type: 'article',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/3194523/pexels-photo-3194523.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-06-01',
    author: { name: 'Ana Ríos', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
    content: 'Contenido completo del artículo...',
  },
  {
    id: '5',
    slug: 'tutorial-arbol-genealogico',
    title: 'Tutorial: Domina tu árbol genealógico',
    excerpt: 'Video paso a paso sobre filtros, zoom, búsqueda y exportación de tu red.',
    type: 'video',
    category: 'Tutoriales',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:20',
    views: 5420,
    date: '2024-05-28',
    author: { name: 'Carlos Torres', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
    content: 'Contenido completo del artículo...',
  },
  {
    id: '6',
    slug: 'retener-afiliados-activos',
    title: 'El arte de retener afiliados activos',
    excerpt: 'Técnicas de seguimiento y mentoring que multiplican la retención.',
    type: 'article',
    category: 'Liderazgo',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-05-22',
    author: { name: 'Gustavo Ortiz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
    content: 'Contenido completo del artículo...',
  },
];

const categories = ['Todos', 'Estrategia', 'Rangos', 'Comisiones', 'Marketing', 'Tutoriales', 'Liderazgo'];
const formats = ['Todo', 'Videos', 'Artículos'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeFormat, setActiveFormat] = useState('Todo');

  const filtered = articles.filter(a => {
    const catMatch = activeCategory === 'Todos' || a.category === activeCategory;
    const fmtMatch = activeFormat === 'Todo' || (activeFormat === 'Videos' ? a.type === 'video' : a.type === 'article');
    return catMatch && fmtMatch;
  });

  const videos = filtered.filter(a => a.type === 'video');
  const articlesList = filtered.filter(a => a.type === 'article');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header Compacto */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Novedades</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Novedades</h1>
            <p className="text-muted-foreground">Videos, tutoriales y artículos para hacer crecer tu negocio.</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {/* Formato */}
            <div className="flex bg-muted/50 rounded-xl p-1">
              {formats.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFormat(f)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeFormat === f
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f === 'Videos' ? <Video className="w-4 h-4 inline mr-1.5" /> : f === 'Artículos' ? <Newspaper className="w-4 h-4 inline mr-1.5" /> : null}
                  {f}
                </button>
              ))}
            </div>

            {/* Categorías */}
            <select
              value={activeCategory}
              onChange={e => setActiveCategory(e.target.value)}
              className="px-4 py-2 bg-muted/50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
        {/* Sección Videos */}
        {(activeFormat === 'Todo' || activeFormat === 'Videos') && videos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Videos recientes</h2>
                <p className="text-sm text-muted-foreground">Tutoriales y capacitaciones en video</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, 3).map(video => (
                <Link
                  key={video.id}
                  to={`/blog/${video.slug}`}
                  className="group block"
                >
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-red-500 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-lg">
                        {video.duration}
                      </div>
                      {/* Category */}
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {video.category}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <img src={video.author.avatar} alt="" className="w-5 h-5 rounded-full" />
                          <span>{video.author.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{video.views?.toLocaleString()}</span>
                          <span>{new Date(video.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sección Artículos */}
        {(activeFormat === 'Todo' || activeFormat === 'Artículos') && articlesList.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Artículos y guías</h2>
                <p className="text-sm text-muted-foreground">Contenido detallado para profundizar</p>
              </div>
            </div>

            <div className="space-y-4">
              {articlesList.map(article => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group block"
                >
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-48 lg:w-64 flex-shrink-0">
                        <div className="aspect-[16/10] sm:aspect-auto sm:h-full overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 lg:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                                {article.category}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(article.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                          </div>
                          <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all hidden sm:block" />
                        </div>

                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                          <img src={article.author.avatar} alt="" className="w-7 h-7 rounded-full" />
                          <span className="text-sm font-medium text-foreground">{article.author.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> 5 min lectura
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No hay contenido</h3>
            <p className="text-muted-foreground mb-6">No encontramos resultados con esos filtros.</p>
            <button
              onClick={() => { setActiveCategory('Todos'); setActiveFormat('Todo'); }}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Ver todo
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
