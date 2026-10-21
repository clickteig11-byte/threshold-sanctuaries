import React, { useEffect, useRef, useCallback } from 'react';
import { TOTAL_FRAMES } from '../data/framesManifest';
import { useFramePreloader } from '../hooks/useFramePreloader';

interface CinematicViewportProps {
  onUnlockChange: (unlocked: boolean) => void;
}

export const CinematicViewport: React.FC<CinematicViewportProps> = ({
  onUnlockChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const statusTextRef = useRef<HTMLSpanElement | null>(null);
  const stage1Ref = useRef<HTMLDivElement | null>(null);
  const stage2Ref = useRef<HTMLDivElement | null>(null);
  const stage3Ref = useRef<HTMLDivElement | null>(null);

  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const needsRedrawRef = useRef<boolean>(true);
  const isUnlockedRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const onUnlockChangeRef = useRef(onUnlockChange);
  onUnlockChangeRef.current = onUnlockChange;

  const drawCanvas = useCallback((frameToDraw: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastDrawnFrameRef.current = -1;
    }

    const { img, index: loadedIdx } = getLoadedImageRef.current(frameToDraw);
    if (!img || img.naturalWidth === 0) return;

    if (lastDrawnFrameRef.current === loadedIdx) return;
    lastDrawnFrameRef.current = loadedIdx;

    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;

    const scale = Math.max(targetWidth / srcW, targetHeight / srcH);
    const drawW = Math.round(srcW * scale);
    const drawH = Math.round(srcH * scale);

    const focalX = 0.5;
    const focalY = frameToDraw <= 120
      ? 0.46
      : 0.46 - ((frameToDraw - 120) / 120) * 0.04;

    const dx = Math.round(targetWidth * 0.5 - drawW * focalX);
    const dy = Math.round(targetHeight * 0.5 - drawH * focalY);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }, []);

  const handleFrameLoaded = useCallback((loadedIndex: number) => {
    const desired = currentFrameRef.current;
    const currentDist = Math.abs(lastDrawnFrameRef.current - desired);
    const newDist = Math.abs(loadedIndex - desired);
    if (lastDrawnFrameRef.current === -1 || newDist <= currentDist) {
      needsRedrawRef.current = true;
    }
  }, []);

  const { setPriorityFrame, getLoadedImage } = useFramePreloader(handleFrameLoaded);
  const getLoadedImageRef = useRef(getLoadedImage);
  getLoadedImageRef.current = getLoadedImage;

  useEffect(() => {
    const setUnlockedState = (unlocked: boolean) => {
      if (isUnlockedRef.current !== unlocked) {
        isUnlockedRef.current = unlocked;
        onUnlockChangeRef.current(unlocked);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // If page is currently unlocked and user is scrolled down into the page content:
      if (isUnlockedRef.current && window.scrollY > 4) {
        return; // Allow normal scrolling in the lower page
      }

      // We are at the top of the page (window.scrollY <= 4)
      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (!isUnlockedRef.current) {
          e.preventDefault();
          const step = Math.min(0.055, Math.max(0.010, Math.abs(e.deltaY) * 0.00065));
          targetProgressRef.current = Math.min(1, targetProgressRef.current + step);
          return;
        }
        // If isUnlockedRef.current is true and e.deltaY > 0, allow native scroll down into the page!
        return;
      }

      if (e.deltaY < 0) {
        // Scrolling UP at the top of the page: re-lock page and rewind video!
        if (smoothProgressRef.current > 0.001 || targetProgressRef.current > 0) {
          e.preventDefault();
          if (isUnlockedRef.current) {
            window.scrollTo(0, 0);
            setUnlockedState(false);
          }
          const step = Math.min(0.055, Math.max(0.010, Math.abs(e.deltaY) * 0.00065));
          targetProgressRef.current = Math.max(0, targetProgressRef.current - step);
          return;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      if (isUnlockedRef.current && window.scrollY > 4) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;

      if (deltaY > 0 && !isUnlockedRef.current) {
        e.preventDefault();
        const step = deltaY * 0.0038;
        targetProgressRef.current = Math.min(1, targetProgressRef.current + step);
        touchStartYRef.current = currentY;
      } else if (deltaY < 0 && (smoothProgressRef.current > 0.001 || targetProgressRef.current > 0)) {
        e.preventDefault();
        if (isUnlockedRef.current) {
          window.scrollTo(0, 0);
          setUnlockedState(false);
        }
        const step = Math.abs(deltaY) * 0.0038;
        targetProgressRef.current = Math.max(0, targetProgressRef.current - step);
        touchStartYRef.current = currentY;
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlockedRef.current && window.scrollY > 4) return;

      if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && !isUnlockedRef.current) {
        e.preventDefault();
        targetProgressRef.current = Math.min(1, targetProgressRef.current + 0.08);
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && targetProgressRef.current > 0) {
        e.preventDefault();
        if (isUnlockedRef.current) {
          window.scrollTo(0, 0);
          setUnlockedState(false);
        }
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.08);
      }
    };

    const handleResize = () => {
      lastDrawnFrameRef.current = -1;
      needsRedrawRef.current = true;
    };

    let animId: number;

    const loop = () => {
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        // Fast, responsive glide through the 240-frame sequence
        const maxStepPerTick = 0.032; // up to ~7.5 frames per 60fps tick
        const rawStep = diff * 0.28;
        const step = Math.sign(rawStep) * Math.min(Math.abs(rawStep), maxStepPerTick);
        smoothProgressRef.current = Math.max(0, Math.min(1, current + step));
      } else {
        smoothProgressRef.current = target;
      }

      const p = smoothProgressRef.current;
      const desiredFrame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(1 + p * (TOTAL_FRAMES - 1)))
      );

      if (desiredFrame !== currentFrameRef.current) {
        currentFrameRef.current = desiredFrame;
        setPriorityFrame(desiredFrame);
        needsRedrawRef.current = true;
      }

      if (needsRedrawRef.current) {
        drawCanvas(currentFrameRef.current);
        needsRedrawRef.current = false;
      }

      // Only unlock downward page scrolling once Frame 240 has actually been reached
      if (desiredFrame >= TOTAL_FRAMES && p >= 0.992 && target >= 0.995) {
        setUnlockedState(true);
      } else if (p < 0.985) {
        setUnlockedState(false);
      }

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${p})`;
      }

      if (statusTextRef.current) {
        statusTextRef.current.textContent = isUnlockedRef.current
          ? 'SCROLL DOWN INTO THE CLOUDS ↓'
          : `CROSSING — ${Math.round(p * 100)}%`;
      }

      // Stage 1: 0.00 -> 0.22
      if (stage1Ref.current) {
        const op1 = p < 0.16 ? 1 : Math.max(0, 1 - (p - 0.16) / 0.07);
        stage1Ref.current.style.opacity = String(op1);
        stage1Ref.current.style.transform = `translate3d(0, ${-p * 120}px, 0)`;
        stage1Ref.current.style.visibility = op1 <= 0.01 ? 'hidden' : 'visible';
      }

      // Stage 2: 0.34 -> 0.58
      if (stage2Ref.current) {
        let op2 = 0;
        if (p >= 0.34 && p <= 0.42) {
          op2 = (p - 0.34) / 0.08;
        } else if (p > 0.42 && p <= 0.52) {
          op2 = 1;
        } else if (p > 0.52 && p <= 0.60) {
          op2 = 1 - (p - 0.52) / 0.08;
        }
        stage2Ref.current.style.opacity = String(Math.max(0, Math.min(1, op2)));
        stage2Ref.current.style.visibility = op2 <= 0.01 ? 'hidden' : 'visible';
      }

      // Stage 3: 0.78 -> 1.00
      if (stage3Ref.current) {
        const op3 = p < 0.78 ? 0 : Math.min(1, (p - 0.78) / 0.10);
        stage3Ref.current.style.opacity = String(op3);
        stage3Ref.current.style.visibility = op3 <= 0.01 ? 'hidden' : 'visible';
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawCanvas, setPriorityFrame]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0c0c0e',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* High-Resolution Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

      {/* Subtle Bottom Gradient Vignette for Typography Contrast */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 35%)',
        pointerEvents: 'none'
      }} />

      {/* Stage 1 Overlay: Opening Statement */}
      <div
        ref={stage1Ref}
        style={{
          position: 'absolute',
          left: '40px',
          right: '40px',
          bottom: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
          pointerEvents: 'none',
          zIndex: 10,
          willChange: 'opacity, transform'
        }}
      >
        <div>
          <div className="font-mono" style={{
            fontSize: '11px',
            letterSpacing: '0.24em',
            color: 'rgba(255, 255, 255, 0.72)',
            marginBottom: '14px'
          }}>
            THRESHOLD SANCTUARIES
          </div>
          <h1 className="font-display" style={{
            fontSize: 'clamp(3.2rem, 8vw, 8.2rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0
          }}>
            STEP OUT OF<br />THE DARK.
          </h1>
        </div>

        <div style={{
          maxWidth: '340px',
          paddingBottom: '8px'
        }}>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.88)',
            margin: '0 0 18px 0',
            fontWeight: 400
          }}>
            Quiet architectural cloud-rooms and open-sky pavilions built for stillness, warm daylight, and clear air.
          </p>
          <div className="font-mono" style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>SCROLL TO CROSS</span>
            <span>↓</span>
          </div>
        </div>
      </div>

      {/* Stage 2 Overlay: Entering the Clouds */}
      <div
        ref={stage2Ref}
        style={{
          position: 'absolute',
          left: '40px',
          right: '40px',
          bottom: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0,
          visibility: 'hidden',
          willChange: 'opacity'
        }}
      >
        <div>
          <div className="font-mono" style={{
            fontSize: '11px',
            letterSpacing: '0.24em',
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '12px'
          }}>
            THE CLOUD PASSAGE
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(2.8rem, 6.8vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0
          }}>
            INTO OPEN<br />CLOUDS.
          </h2>
        </div>

        <p style={{
          maxWidth: '340px',
          fontSize: '15px',
          lineHeight: 1.6,
          color: '#ffffff',
          margin: 0,
          paddingBottom: '6px'
        }}>
          Leave the weight of the street behind and pass through warm, sunlit cumulus mist into open altitude.
        </p>
      </div>

      {/* Stage 3 Overlay: Emerging into the Sunlit Valley */}
      <div
        ref={stage3Ref}
        style={{
          position: 'absolute',
          left: '40px',
          right: '40px',
          bottom: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0,
          visibility: 'hidden',
          willChange: 'opacity'
        }}
      >
        <div>
          <div className="font-mono" style={{
            fontSize: '11px',
            letterSpacing: '0.24em',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '12px'
          }}>
            ABOVE THE WEATHER
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(2.8rem, 6.8vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0
          }}>
            BREATHE<br />AGAIN.
          </h2>
        </div>

        <div style={{
          maxWidth: '360px',
          paddingBottom: '6px'
        }}>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#ffffff',
            margin: '0 0 14px 0'
          }}>
            An unhurried sanctuary of warm sky, high-altitude air, and quiet horizon light.
          </p>
          <div className="font-mono" style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: '#ffffff'
          }}>
            <span ref={statusTextRef}>CROSSING — 0%</span>
          </div>
        </div>
      </div>

      {/* Bottom Edge Progress Line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        zIndex: 25,
        pointerEvents: 'none'
      }}>
        <div
          ref={progressFillRef}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#ffffff',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            willChange: 'transform'
          }}
        />
      </div>
    </div>
  );
};
