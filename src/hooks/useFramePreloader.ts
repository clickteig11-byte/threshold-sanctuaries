import { useEffect, useRef, useCallback, useState } from 'react';
import { TOTAL_FRAMES, getFrameUrl } from '../data/framesManifest';

export function useFramePreloader(onFrameLoaded?: (frameIndex: number) => void) {
  const [initialReady, setInitialReady] = useState(false);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inFlightRef = useRef<Set<number>>(new Set());
  const priorityFrameRef = useRef<number>(1);
  const onFrameLoadedRef = useRef(onFrameLoaded);

  onFrameLoadedRef.current = onFrameLoaded;

  const setPriorityFrame = useCallback((frameIndex: number) => {
    priorityFrameRef.current = frameIndex;
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const CONCURRENCY = 8;

    // Build an initial smart load order:
    // 1. Frame 1 first
    // 2. Every 8th frame across 1..240 so the entire timeline has keyframes within ~250ms
    // 3. Every 2nd frame
    // 4. All remaining frames
    const smartOrder: number[] = [1];
    const seen = new Set<number>([1]);

    for (const step of [8, 4, 2, 1]) {
      for (let i = 1; i <= TOTAL_FRAMES; i += step) {
        if (!seen.has(i)) {
          seen.add(i);
          smartOrder.push(i);
        }
      }
    }

    const pickNextFrame = (): number | null => {
      const target = priorityFrameRef.current;

      // First check a tight window around the user's current scroll position [target - 3 .. target + 16]
      for (let offset = 0; offset <= 16; offset++) {
        const fwd = target + offset;
        if (fwd >= 1 && fwd <= TOTAL_FRAMES && !cacheRef.current.has(fwd) && !inFlightRef.current.has(fwd)) {
          return fwd;
        }
        if (offset <= 3) {
          const bwd = target - offset;
          if (bwd >= 1 && bwd <= TOTAL_FRAMES && !cacheRef.current.has(bwd) && !inFlightRef.current.has(bwd)) {
            return bwd;
          }
        }
      }

      // Otherwise pick the next frame from our progressive keyframe order
      for (const candidate of smartOrder) {
        if (!cacheRef.current.has(candidate) && !inFlightRef.current.has(candidate)) {
          return candidate;
        }
      }

      return null;
    };

    const loadSingleFrame = (frameIndex: number): Promise<void> => {
      inFlightRef.current.add(frameIndex);

      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(frameIndex);

        img.onload = () => {
          inFlightRef.current.delete(frameIndex);
          if (!isCancelled) {
            cacheRef.current.set(frameIndex, img);
            if (frameIndex === 1) {
              setInitialReady(true);
            }
            onFrameLoadedRef.current?.(frameIndex);
          }
          resolve();
        };

        img.onerror = () => {
          inFlightRef.current.delete(frameIndex);
          resolve();
        };
      });
    };

    const runWorker = async () => {
      while (!isCancelled) {
        const next = pickNextFrame();
        if (next === null) break;
        await loadSingleFrame(next);
      }
    };

    for (let w = 0; w < CONCURRENCY; w++) {
      runWorker();
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  const getLoadedImage = useCallback((targetIndex: number): { img: HTMLImageElement | null; index: number } => {
    if (cacheRef.current.has(targetIndex)) {
      return { img: cacheRef.current.get(targetIndex)!, index: targetIndex };
    }

    let bestDist = Infinity;
    let fallback: HTMLImageElement | null = null;
    let fallbackIdx = -1;

    for (const [idx, img] of cacheRef.current.entries()) {
      const dist = Math.abs(idx - targetIndex);
      if (dist < bestDist) {
        bestDist = dist;
        fallback = img;
        fallbackIdx = idx;
      }
    }

    return { img: fallback, index: fallbackIdx };
  }, []);

  return {
    initialReady,
    setPriorityFrame,
    getLoadedImage
  };
}
