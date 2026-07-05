import { useMemo } from 'react';
import { Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

// Allowed SVG tags for sanitization
const SAFE_SVG_TAGS = new Set([
  'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline',
  'polygon', 'text', 'tspan', 'defs', 'linearGradient', 'radialGradient',
  'stop', 'clipPath', 'mask', 'use', 'symbol', 'title', 'desc', 'pattern',
]);

// Allowed SVG attributes
const SAFE_SVG_ATTRS = new Set([
  'xmlns', 'xmlns:xlink', 'viewBox', 'width', 'height', 'fill', 'stroke',
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
  'stroke-dasharray', 'stroke-dashoffset', 'd', 'cx', 'cy', 'r', 'rx', 'ry',
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform', 'opacity',
  'fill-opacity', 'stroke-opacity', 'clip-path', 'clip-rule', 'fill-rule',
  'id', 'class', 'style', 'offset', 'stop-color', 'stop-opacity',
  'gradientUnits', 'gradientTransform', 'spreadMethod', 'cx', 'cy', 'r',
  'fx', 'fy', 'patternUnits', 'patternTransform', 'href', 'xlink:href',
  'preserveAspectRatio', 'text-anchor', 'font-size', 'font-family',
  'font-weight', 'letter-spacing', 'dominant-baseline', 'aria-hidden',
  'role', 'focusable', 'mask', 'maskUnits',
]);

function sanitizeSvg(raw: string): string {
  // Strip script, event handlers, and foreign elements
  let safe = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<use[^>]+href="data:/gi, '');

  // Only keep allowed elements — remove unknown tags but keep their children
  safe = safe.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tag) => {
    const lower = tag.toLowerCase();
    if (!SAFE_SVG_TAGS.has(lower)) return '';

    // For opening tags, strip unsafe attributes
    if (!match.startsWith('</')) {
      return match.replace(/\s([a-zA-Z:_][a-zA-Z0-9:_.-]*)(?:=(?:"[^"]*"|'[^']*'|[^\s>]*))?/g, (attrMatch, attr) => {
        const attrLower = attr.toLowerCase();
        // Block data URIs and event handlers
        if (attrLower.startsWith('on') || attrLower === 'data') return '';
        if (SAFE_SVG_ATTRS.has(attrLower) || attrLower.startsWith('xlink:') || attrLower.startsWith('aria-')) return attrMatch;
        return '';
      });
    }
    return match;
  });

  return safe.trim();
}

type LogoType = 'svg' | 'img' | 'fallback';

function detectLogoType(value: string): LogoType {
  if (!value || !value.trim()) return 'fallback';
  const trimmed = value.trim();
  if (trimmed.toLowerCase().startsWith('<svg')) return 'svg';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) return 'img';
  return 'fallback';
}

interface LogoProps {
  value?: string;
  fallbackText?: string;
  /** Size class applied to icon/img wrapper. Default: 'w-8 h-8' */
  size?: string;
  /** img className override */
  imgClass?: string;
  /** Show text label beside the mark? */
  showText?: boolean;
  textClass?: string;
}

export default function Logo({
  value = '',
  fallbackText = 'MLM 360',
  size = 'w-8 h-8',
  imgClass,
  showText = false,
  textClass = 'text-lg font-bold text-foreground',
}: LogoProps) {
  const type = useMemo(() => detectLogoType(value), [value]);
  const safeSvg = useMemo(() => (type === 'svg' ? sanitizeSvg(value) : ''), [type, value]);

  const mark = (() => {
    if (type === 'svg') {
      return (
        <span
          className={cn(size, 'flex items-center justify-center [&>svg]:w-full [&>svg]:h-full')}
          // sanitized above — no external scripts, no event handlers
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: safeSvg }}
          aria-hidden="true"
        />
      );
    }
    if (type === 'img') {
      return (
        <img
          src={value.trim()}
          alt={fallbackText}
          className={cn(size, 'object-contain rounded', imgClass)}
          onError={(e) => {
            // If image fails to load, hide it — parent will show fallback text
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    }
    // Fallback: icon mark
    return (
      <div className={cn(size, 'rounded-lg bg-primary flex items-center justify-center flex-shrink-0')}>
        <Boxes className="w-[55%] h-[55%] text-primary-foreground" />
      </div>
    );
  })();

  if (!showText) return <>{mark}</>;

  return (
    <span className="flex items-center gap-2.5 min-w-0">
      <span className="flex-shrink-0">{mark}</span>
      {type === 'fallback' && (
        <span className={textClass}>{fallbackText}</span>
      )}
    </span>
  );
}
