'use client';

import { useEffect, useRef } from 'react';

export const UniverseGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, name: 'Norte Fit', size: 12, color: '#00FF87', baseColor: '#00FF87' },
      { x: canvas.width * 0.5, y: canvas.height * 0.2, name: 'Norte College', size: 15, color: '#00F2FF', baseColor: '#00F2FF' },
      { x: canvas.width * 0.8, y: canvas.height * 0.4, name: 'Norte Agency', size: 10, color: '#7000FF', baseColor: '#7000FF' },
      { x: canvas.width * 0.3, y: canvas.height * 0.7, name: 'Norte Clinic', size: 9, color: '#FF0055', baseColor: '#FF0055' },
      { x: canvas.width * 0.7, y: canvas.height * 0.7, name: 'Norte Auto', size: 9, color: '#FFAA00', baseColor: '#FFAA00' },
    ];

    // Partículas Astrais (Poeira Cósmica)
    const particles: any[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: gba(, , 255, )
      });
    }

    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fundo Psicodélico (Nebulosa Fluida)
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.cos(angle) * 100, 
        canvas.height / 2 + Math.sin(angle) * 100, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width
      );
      gradient.addColorStop(0, '#050014');
      gradient.addColorStop(0.5, '#050505');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mover e Desenhar Poeira Cósmica
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Linhas de Constelação Psicodélicas (Mudam de cor)
      ctx.beginPath();
      ctx.strokeStyle = hsla(, 100%, 50%, 0.15);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
        }
      }
      ctx.stroke();

      // Desenhar Estrelas com Efeito de Pulso e Aura
      stars.forEach(star => {
        const pulse = Math.sin(angle * 3 + stars.indexOf(star)) * 3;
        
        // Aura Externa
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + 15 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = gba(, , , 0.05);
        ctx.fill();

        // Núcleo da Estrela
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + pulse/2, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 30;
        ctx.shadowColor = star.color;
        ctx.fill();

        // Label Astral
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.letterSpacing = '4px';
        ctx.textAlign = 'center';
        ctx.fillText(star.name.toUpperCase(), star.x, star.y + star.size + 30);
        
        // Sub-label psicodélica
        ctx.fillStyle = gba(0, 242, 255, 0.4);
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.fillText('NÚCLEO ATIVO', star.x, star.y + star.size + 42);
      });

      angle += 0.01;
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#000000_100%)] opacity-80" />
    </div>
  );
};
