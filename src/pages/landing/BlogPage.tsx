import { Link } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Calendar, Clock, ArrowRight, Tag, Sparkles, Bookmark, Share2, Play, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Categorías con iconos y colores
const categories = [
  { id: 'all', label: 'Todo', icon: Sparkles, color: 'bg-primary text-white' },
  { id: 'estrategias', label: 'Estrategias', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'rangos', label: 'Rangos', icon: Bookmark, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { id: 'comisiones', label: 'Comisiones', icon: TrendingUp, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { id: 'marketing', label: 'Marketing', icon: Share2, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { id: 'videos', label: 'Videos', icon: Play, color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
];

// Posts de ejemplo con más datos
const posts = [
  {
    id: '1',
    title: '5 estrategias para duplicar tu red de afiliados en 90 días',
    excerpt: 'Descubre las técnicas probadas que usan los líderes Diamante para acelerar el crecimiento de su red y multiplicar sus ingresos de forma sostenible.',
    category: 'estrategias',
    author: 'Gustavo Ortiz',
    authorRole: 'CEO & Fundador',
    authorImg: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '15 Jun 2024',
    readTime: '5 min',
    img: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    video: false,
  },
  {
    id: '2',
    title: 'Cómo alcanzar el rango Diamante: Guía completa 2024',
    excerpt: 'Todo lo que necesitas saber sobre los requisitos, estrategias y mentalidad para llegar al rango Diamante en MLM 360.',
    category: 'rangos',
    author: 'María González',
    authorRole: 'Directora Comercial',
    authorImg: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '10 Jun 2024',
    readTime: '8 min',
    img: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    video: false,
  },
  {
    id: '3',
    title: 'Maximiza tus comisiones binarias: Tips de expertos',
    excerpt: 'Aprende a optimizar el balance de tu red binaria para maximizar el cobro de comisiones cada quincena.',
    category: 'comisiones',
    author: 'Carlos Torres',
    authorRole: 'CTO',
    authorImg: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '5 Jun 2024',
    readTime: '6 min',
    img: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    video: false,
  },
  {
    id: '4',
    title: 'Marketing digital para MLM: Construye tu marca personal',
    excerpt: 'Las redes sociales y el marketing de contenido son tus aliados. Aprende a usarlos para atraer afiliados de calidad.',
    category: 'marketing',
    author: 'Ana Ríos',
    authorRole: 'Directora de Operaciones',
    authorImg: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '1 Jun 2024',
    readTime: '7 min',
    img: 'https://images.pexels.com/photos/3194523/pexels-photo-3194523.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    video: false,
  },
  {
    id: '5',
    title: 'Tutorial: Configura tu árbol genealógico en 5 minutos',
    excerpt: 'Video paso a paso para dominar la visualización de tu red, usar filtros y encontrar afiliados rápidamente.',
    category: 'videos',
    author: 'Carlos Torres',
    authorRole: 'CTO',
    authorImg: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '28 May 2024',
    readTime: '5 min',
    img: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    video: true,
  },
  {
    id: '6',
    title: 'El poder del seguimiento: Cómo retener afiliados activos',
    excerpt: 'Un afiliado activo vale más que diez nuevos. Descubre las mejores técnicas de seguimiento y mentoring.',
    category: 'estrategias',
    author: 'Gustavo Ortiz',
    authorRole: 'CEO & Fundador',
    authorImg: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '22 May 2024',
    readTime: '4 min',
    img: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    video: false,
  },
];

const categoryColors: Record<string, string> = {
  estrategias: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  rangos: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  comisiones: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  marketing: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  videos: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <span className="text-foreground font-medium">Novedades</span>
          </nav>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Centro de Conocimiento
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight leading-tight">
              Novedades y <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Recursos</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Estrategias, tutoriales, videos y noticias para hacer crecer tu negocio MLM.
              Contenido nuevo cada semana.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            {/* Search input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar artículos, videos y tutoriales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category filters - scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Grid */}
      {featuredPosts.length > 0 && (
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post, idx) => (
                <article
                  key={post.id}
                  className={cn(
                    'group relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500',
                    idx === 0 && 'lg:row-span-2'
                  )}
                >
                  {/* Image */}
                  <div className={cn(
                    'relative overflow-hidden',
                    idx === 0 ? 'h-72 lg:h-full lg:min-h-[400px]' : 'h-56'
                  )}>
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Video badge */}
                    {post.video && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Video
                      </div>
                    )}

                    {/* Category */}
                    <span className={cn(
                      'absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                      categoryColors[post.category] || 'bg-muted text-muted-foreground'
                    )}>
                      <Tag className="w-3 h-3" />
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className={cn(
                        'font-bold text-white mb-3 group-hover:text-primary transition-colors',
                        idx === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                      )}>
                        {post.title}
                      </h2>
                      <p className="text-white/80 text-sm mb-4 line-clamp-2 hidden sm:block">{post.excerpt}</p>

                      {/* Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={post.authorImg} alt={post.author} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                          <div>
                            <div className="text-white text-sm font-medium">{post.author}</div>
                            <div className="text-white/60 text-xs">{post.authorRole}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/70 text-xs">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="py-8 lg:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regularPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-foreground">
                  {activeCategory === 'all' ? 'Artículos recientes' : `Artículos de ${categories.find(c => c.id === activeCategory)?.label}`}
                </h2>
                <span className="text-sm text-muted-foreground">{regularPosts.length} artículos</span>
              </div>

              {/* Bento grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.video && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                          </div>
                        </div>
                      )}
                      <span className={cn(
                        'absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
                        categoryColors[post.category] || 'bg-muted text-muted-foreground'
                      )}>
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>

                      {/* Author */}
                      <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <img src={post.authorImg} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{post.author}</div>
                          <div className="text-xs text-muted-foreground truncate">{post.authorRole}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No hay artículos en esta categoría</h3>
              <p className="text-muted-foreground mb-6">Prueba con otra categoría o limpia la búsqueda.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Ver todos los artículos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Newsletter
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  Recibe contenido exclusivo cada semana
                </h2>
                <p className="text-muted-foreground">
                  Únete a más de 5,000 afiliados que reciben estrategias, tutoriales y noticias directamente en su correo.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-5 py-3.5 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button className="px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                  Suscribirme
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
