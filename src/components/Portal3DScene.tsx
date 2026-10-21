import React, { useEffect, useRef } from 'react';

interface Portal3DSceneProps {
  active: boolean;
}

/**
 * Serene, soft drifting cloud atmosphere for the post-scroll Cloud Sanctuary sections.
 * Zero 3D wireframes, zero neon glow, zero UI buttons — pure organic cumulus mist.
 */
export const Portal3DScene: React.FC<Portal3DSceneProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateSize);

    // Soft, wide cumulus cloud banks drifting slowly across the sky
    const cloudBanks = Array.from({ length: 18 }, (_, i) => ({
      x: (i / 18) * width * 1.4 - width * 0.2,
      y: (i * 137) % (height * 1.3),
      rx: 260 + (i % 5) * 95,
      ry: 110 + (i % 4) * 45,
      speedX: (i % 2 === 0 ? 1 : -1) * (0.12 + (i % 4) * 0.05),
      parallax: 0.06 + (i % 3) * 0.04,
      opacity: 0.28 + (i % 3) * 0.1
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft daylight sky & warm cloud base gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e6eef6');
      skyGrad.addColorStop(0.38, '#f3eee6');
      skyGrad.addColorStop(0.75, '#f9f6f0');
      skyGrad.addColorStop(1, '#f2ece1');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Drifting soft cloud layers
      for (const cloud of cloudBanks) {
        cloud.x += cloud.speedX;
        if (cloud.x - cloud.rx > width + 200) {
          cloud.x = -cloud.rx - 150;
        } else if (cloud.x + cloud.rx < -200) {
          cloud.x = width + cloud.rx + 150;
        }

        const totalH = height * 1.3;
        const shiftedY = ((cloud.y - scrollY * cloud.parallax) % totalH + totalH) % totalH - height * 0.15;

        ctx.save();
        ctx.translate(cloud.x, shiftedY);
        ctx.scale(1, cloud.ry / cloud.rx);

        const grad = ctx.createRadialGradient(0, 0, cloud.rx * 0.1, 0, 0, cloud.rx);
        grad.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`);
        grad.addColorStop(0.55, `rgba(252, 249, 244, ${cloud.opacity * 0.55})`);
        grad.addColorStop(1, 'rgba(249, 246, 240, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, cloud.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateSize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
