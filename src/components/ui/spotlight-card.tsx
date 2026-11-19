import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  tiltLevel?: 'high' | 'low' | 'none';
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  tiltLevel = 'none'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    // Skip global pointer listener on touch devices to ensure ultra-smooth 60fps scrolling
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let rafId: number | null = null;
    let pendingEvent: PointerEvent | null = null;

    const updateProperties = () => {
      if (pendingEvent && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = pendingEvent.clientX - rect.left;
        const y = pendingEvent.clientY - rect.top;
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (pendingEvent.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (pendingEvent.clientY / window.innerHeight).toFixed(2));
        cardRef.current.style.setProperty('--bg-spot-opacity', '0.15');
        cardRef.current.style.setProperty('--border-spot-opacity', '1');
        cardRef.current.style.setProperty('--border-light-opacity', '1');
      }
      rafId = null;
    };

    const syncPointer = (e: PointerEvent) => {
      pendingEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(updateProperties);
      }
    };

    document.addEventListener('pointermove', syncPointer, { passive: true });
    return () => {
      document.removeEventListener('pointermove', syncPointer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  // --- 3D Tilt Animation Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
    const rotateX = useTransform(springY, [-0.5, 0.5], tiltLevel === 'high' ? ["18deg", "-18deg"] : tiltLevel === 'low' ? ["4deg", "-4deg"] : ["0deg", "0deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], tiltLevel === 'high' ? ["-18deg", "18deg"] : tiltLevel === 'low' ? ["-4deg", "4deg"] : ["0deg", "0deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const xPct = (e.clientX - left) / width - 0.5;
    const yPct = (e.clientY - top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '3',
      '--backdrop': 'hsl(0 0% 60% / 0.12)',
      /* removed --backup-border */
      '--size': '200',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
            '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      '--bg-spot-opacity': '0',
      '--border-spot-opacity': '0',
      '--border-light-opacity': '0',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        rgba(255, 255, 255, var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      /* removed fixed attachment */
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative' as const,
      touchAction: 'none' as const,
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    
    [data-glow] {
      --backup-border: var(--backdrop);
      transition: --backup-border 0.3s, box-shadow 0.3s;
    }
    
    [data-glow]::before,

    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      /* removed fixed attachment */
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        rgba(255, 255, 255, var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(2);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        rgba(255, 255, 255, var(--border-light-opacity, 1)), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }

    .group:hover > [data-glow] {
      --backup-border: rgba(255, 255, 255, 0.3) !important;
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.1) !important;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-glow
        style={{ 
          ...getInlineStyles(), 
          ...(tiltLevel !== 'none' ? { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 } : {}) 
        }}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl 
          relative 
          grid 
          grid-rows-[1fr_auto] 
          shadow-[0_1rem_2rem_-1rem_black] 
          p-4 
          gap-4 
          backdrop-blur-[5px]
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </motion.div>
    </>
  );
};

export { GlowCard };
