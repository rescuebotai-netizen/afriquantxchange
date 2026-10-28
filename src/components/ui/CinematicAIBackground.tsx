import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface CinematicAIBackgroundProps {
  variant?: 'dark' | 'light' | 'emerald';
  className?: string;
  showParticles?: boolean;
  showGrid?: boolean;
}

export function CinematicAIBackground({
  variant = 'dark',
  className = '',
  showParticles = true,
  showGrid = true
}: CinematicAIBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!showParticles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for subtle floating neural network connections
    const nodeCount = Math.min(Math.floor(width / 35), 45);
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseSpeed: number;
    }> = [];

    const isLight = variant === 'light';
    const primaryColor = isLight ? '0, 200, 5' : '213, 255, 47';
    const secondaryColor = isLight ? '16, 185, 129' : '0, 200, 5';

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.02;

      // Draw subtle connecting neural lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${secondaryColor}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulsing glow
        const currentAlpha = node.alpha + Math.sin(tick * node.pulseSpeed * 10) * 0.15;

        // Outer Glow Ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor}, ${Math.max(0, currentAlpha * 0.15)})`;
        ctx.fill();

        // Node Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor}, ${Math.max(0, currentAlpha)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, showParticles]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      
      {/* 1. Subtle Digital Grid Lines Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, ${variant === 'dark' ? '#FFFFFF' : '#000000'} 1px, transparent 1px), linear-gradient(to bottom, ${variant === 'dark' ? '#FFFFFF' : '#000000'} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      )}

      {/* 2. Cinematic Flowing Light Waves & Spotlights */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-[#00C805]/15 via-[#D5FF2F]/10 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />

      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[400px] bg-gradient-to-bl from-emerald-500/10 via-[#00C805]/5 to-transparent rounded-full blur-[120px]" />

      {/* 3. Floating Neural Stream Canvas */}
      {showParticles && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full opacity-80" 
        />
      )}
    </div>
  );
}
