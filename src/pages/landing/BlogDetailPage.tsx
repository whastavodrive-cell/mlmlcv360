import { Link, useParams } from '@/lib/router';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Clock, Eye, ChevronRight, Calendar, Share2, Bookmark, ThumbsUp, Facebook, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Datos de ejemplo - En producción vendría de la BD
const articles: Record<string, any> = {
  'estrategias-duplicar-red-90-dias': {
    id: '1',
    title: 'Estrategias para duplicar tu red en 90 días',
    excerpt: 'Técnicas probadas por los líderes Diamante para acelerar el crecimiento exponencial de tu red.',
    type: 'video',
    category: 'Estrategia',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:45',
    views: 3420,
    date: '2024-06-15',
    author: {
      name: 'Gustavo Ortiz',
      role: 'CEO & Fundador',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    content: `
      <p>En este artículo te compartiremos las 5 estrategias más efectivas que nuestros afiliados Diamante han utilizado para duplicar sus redes en menos de 3 meses.</p>

      <h2>1. El poder del seguimiento sistemático</h2>
      <p>El seguimiento es donde la mayoría falla. Tener un sistema de seguimiento automatizado más el toque personal marca la diferencia entre un afiliado activo y uno que abandona.</p>

      <h2>2. Eventos semanales de presentación</h2>
      <p>Los líderes Diamante realizan mínimo 2 presentaciones semanales presenciales o virtuales. La consistencia genera momentum y el momentum atrae nuevos afiliados.</p>

      <h2>3. Mentoría uno a uno</h2>
      <p>Dedicar tiempo a los afiliados con mayor potencial multiplica resultados. Identifica al 20% que puede generar el 80% de tus resultados.</p>

      <h2>4. Uso inteligente de redes sociales</h2>
      <p>No se trata de spam, sino de construir una marca personal que atraiga naturalmente. Comparte tu historia, no solo el producto.</p>

      <h2>5. Duplicación de procesos</h2>
      <p>Documenta todo lo que funcione y enséñalo a tu equipo. El éxito duplicable es la clave del crecimiento exponencial.</p>
    `,
    relatedPosts: [
      { slug: 'como-alcanzar-rango-diamante', title: 'Guía para alcanzar el rango Diamante', image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { slug: 'maximizar-comisiones-binarias', title: 'Maximiza tus comisiones binarias', image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
  },
  'como-alcanzar-rango-diamante': {
    id: '2',
    title: 'Guía completa para alcanzar el rango Diamante',
    excerpt: 'Todo lo que necesitas saber sobre requisitos, estrategias y mentalidad para el máximo rango.',
    type: 'article',
    category: 'Rangos',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    date: '2024-06-10',
    author: {
      name: 'María González',
      role: 'Directora Comercial',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    content: `
      <p>El rango Diamante representa la cúspide del sistema MLM 360. En esta guía detallada, exploraremos cada requisito y las estrategias probadas para alcanzarlo.</p>

      <h2>Requisitos del rango Diamante</h2>
      <p>Para alcanzar Diamante necesitas: 500+ afiliados directos e indirectos, volumen mensual de S/ 50,000+ en tu red, y mantener rangos anteriores por 3 meses consecutivos.</p>

      <h2>La mentalidad correcta</h2>
      <p>Diamante no es solo sobre números, es sobre liderazgo. Debes estar dispuesto a invertir tiempo en formar líderes, no solo reclutar afiliados.</p>

      <h2>Estrategia de retención</h2>
      <p>El secreto no es solo traer gente nueva, sino mantener activos a los existentes. Un afiliado activo vale 10 veces más que uno nuevo.</p>
    `,
    relatedPosts: [
      { slug: 'estrategias-duplicar-red-90-dias', title: 'Duplica tu red en 90 días', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { slug: 'retener-afiliados-activos', title: 'El arte de retener afiliados', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
  },
};

// Fallback para article not found
const defaultArticle = {
  id: '0',
  title: 'Artículo no encontrado',
  excerpt: 'El artículo que buscas no existe o ha sido eliminado.',
  type: 'article',
  category: 'General',
  image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
  date: new Date().toISOString(),
  author: { name: 'MLM 360', role: 'Equipo', avatar: '' },
  content: '<p>El artículo que buscas no existe.</p>',
  relatedPosts: [],
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const article = articles[slug || ''] || defaultArticle;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blog" className="hover:text-foreground transition-colors">Novedades</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium truncate max-w-[200px]">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-full',
              article.type === 'video' ? 'bg-red-500 text-white' : 'bg-primary/10 text-primary'
            )}>
              {article.type === 'video' ? 'Video' : 'Artículo'}
            </span>
            <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
              {article.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={article.author.avatar} alt={article.author.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="text-sm font-semibold text-foreground">{article.author.name}</div>
                <div className="text-xs text-muted-foreground">{article.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(article.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {article.type === 'video' && (
                <>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.duration}</span>
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{article.views?.toLocaleString()} vistas</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                liked ? 'bg-primary/10 text-primary' : 'bg-muted hover:bg-muted/70 text-foreground'
              )}
            >
              <ThumbsUp className={cn('w-4 h-4', liked && 'fill-current')} />
              Me gusta
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                saved ? 'bg-amber-500/10 text-amber-600' : 'bg-muted hover:bg-muted/70 text-foreground'
              )}
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
              Guardar
            </button>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs text-muted-foreground mr-2">Compartir:</span>
              <button className="w-9 h-9 rounded-lg bg-muted hover:bg-blue-500/10 hover:text-blue-500 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-muted hover:bg-sky-500/10 hover:text-sky-500 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-muted hover:bg-blue-600/10 hover:text-blue-600 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video o Imagen principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
          <div className="rounded-2xl overflow-hidden bg-card border border-border">
            {article.type === 'video' && article.videoUrl ? (
              <div className="aspect-video">
                <iframe
                  src={article.videoUrl}
                  title={article.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={article.image}
                alt={article.title}
                className="w-full aspect-video object-cover"
              />
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <article
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Artículos relacionados */}
        {article.relatedPosts && article.relatedPosts.length > 0 && (
          <div className="bg-muted/30 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Contenido relacionado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.relatedPosts.map((post: any) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
