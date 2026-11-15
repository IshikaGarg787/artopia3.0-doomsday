import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Lightweight full-screen doomsday title reveal. */
export default function Preloader({ onReveal, onDone }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    document.body.classList.add('lock');
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onReveal();
      try { sessionStorage.setItem('artopia3-intro-v13', '1'); } catch { /* ignore */ }
      onDone();
    };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo('.intro-haze', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1.05, duration: 2.4, ease: 'sine.out' }, 0)
        .fromTo('.intro-ring', { opacity: 0, scale: 0.18 }, { opacity: 1, scale: 1, duration: 1.45, stagger: 0.16, ease: 'power3.out' }, 0.16)
        .fromTo('.intro-core', { opacity: 0, scale: 0.25 }, { opacity: 0.9, scale: 1, duration: 1.25, ease: 'back.out(1.5)' }, 0.72)
        .fromTo('.intro-eyebrow', { opacity: 0, y: 12 }, { opacity: 0.92, y: 0, duration: 0.55, ease: 'power2.out' }, 0.35)
        .fromTo('.intro-title', { opacity: 0, y: 34, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 1.72)
        .fromTo('.intro-rule,.intro-edition', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' }, 1.88)
        .to(el, { opacity: 0, duration: 0.35, ease: 'power1.out' }, 3.05);
    }, el);

    el.skip = finish;
    const onKey = (event) => { if (event.key === 'Escape') finish(); };
    addEventListener('keydown', onKey);
    el.querySelector('.pl-skip').focus({ preventScroll: true });
    const failsafe = setTimeout(finish, 5000);
    return () => {
      clearTimeout(failsafe);
      removeEventListener('keydown', onKey);
      document.body.classList.remove('lock');
      ctx.revert();
    };
  }, [onDone, onReveal]);

  return (
    <div id="preloader" ref={root} role="status" aria-label="Artopia 3.0 — Doomsday Edition">
      <div className="intro-haze" aria-hidden="true" />
      <div className="intro-universe" aria-hidden="true">
        <i className="intro-core" />
        <i className="intro-ring ring-one" />
        <i className="intro-ring ring-two" />
        <i className="intro-ring ring-three" />
        <i className="intro-ring ring-four" />
      </div>
      <div className="intro-copy">
        <p className="intro-eyebrow">KALEIDOS · FINE ARTS CLUB PRESENTS</p>
        <h1 className="intro-title">ARTOPIA <span>3.0</span></h1>
        <div className="intro-rule" />
        <p className="intro-edition">DOOMSDAY EDITION</p>
      </div>
      <button className="pl-skip" type="button" onClick={() => root.current?.skip()}>Skip intro</button>
    </div>
  );
}
