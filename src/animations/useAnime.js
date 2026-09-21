import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Hook to trigger a staggered entrance animation on a container's children
 * Useful for Hero sections, headings, cards.
 *
 * @param {string|string[]} childSelector - CSS selector for child elements to animate
 * @param {Object} [options] - Custom animation overrides
 */
export function useHeroEntrance(childSelector = '.anime-hero-item', options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const targets = containerRef.current.querySelectorAll(childSelector);
    if (!targets || targets.length === 0) return;

    try {
      animate(targets, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 900,
        ease: 'outExpo',
        delay: stagger(120, { start: 100 }),
        ...options
      });
    } catch (err) {
      console.warn('AnimeJS hero animation fallback:', err);
    }
  }, [childSelector]);

  return containerRef;
}

/**
 * Hook to reveal elements when scrolled into the viewport using IntersectionObserver
 *
 * @param {string} childSelector - CSS selector of elements inside ref to stagger
 * @param {Object} [options] - AnimeJS parameters
 */
export function useScrollReveal(childSelector = '.anime-reveal-item', options = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = el.querySelectorAll(childSelector);
            const targetsToAnimate = targets.length > 0 ? targets : el;

            try {
              animate(targetsToAnimate, {
                opacity: [0, 1],
                translateY: [24, 0],
                duration: 800,
                ease: 'outCubic',
                delay: stagger(100, { start: 50 }),
                ...options
              });
            } catch (err) {
              console.warn('AnimeJS scroll reveal fallback:', err);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [childSelector]);

  return elementRef;
}

/**
 * Hook to animate a numeric count-up value when element enters the viewport
 *
 * @param {number} targetValue - The numeric value to count up to
 * @param {Object} [options] - { duration: number, prefix: string, suffix: string }
 */
export function useCountUp(targetValue, options = {}) {
  const numberRef = useRef(null);
  const { duration = 2000, prefix = '', suffix = '' } = options;

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counterObj = { val: 0 };
            try {
              animate(counterObj, {
                val: targetValue,
                duration,
                ease: 'outExpo',
                onUpdate: () => {
                  if (el) {
                    el.textContent = `${prefix}${Math.round(counterObj.val).toLocaleString()}${suffix}`;
                  }
                }
              });
            } catch (err) {
              // Fallback
              el.textContent = `${prefix}${targetValue.toLocaleString()}${suffix}`;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [targetValue, duration, prefix, suffix]);

  return numberRef;
}

/**
 * Standalone direct anime wrapper
 */
export { animate, stagger };
