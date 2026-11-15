import { useEffect, useRef } from 'react';

/** Plays the supplied intro video in full, then reveals the website. */
export default function Preloader({ onReveal, onDone }) {
  const root = useRef(null);
  const introVideo = useRef(null);

  useEffect(() => {
    const el = root.current;
    const video = introVideo.current;
    document.body.classList.add('lock');
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      onReveal();
      try { sessionStorage.setItem('artopia3-intro-v11', '1'); } catch { /* ignore */ }
      onDone();
    };

    if (video) {
      video.currentTime = 0;
      video.addEventListener('ended', finish);
      video.addEventListener('error', finish);
      video.play().catch(() => { /* muted autoplay can be restricted by the browser */ });
    } else {
      finish();
    }

    el.skip = finish;
    const onKey = (event) => { if (event.key === 'Escape') finish(); };
    addEventListener('keydown', onKey);
    el.querySelector('.pl-skip').focus({ preventScroll: true });

    return () => {
      removeEventListener('keydown', onKey);
      if (video) {
        video.removeEventListener('ended', finish);
        video.removeEventListener('error', finish);
        video.pause();
      }
      document.body.classList.remove('lock');
    };
  }, [onDone, onReveal]);

  return (
    <div id="preloader" ref={root} role="status" aria-label="Artopia 3.0 intro">
      <video ref={introVideo} className="intro-eye-footage" src="/videos/artopia-intro.mp4" autoPlay muted playsInline preload="auto" aria-hidden="true" />
      <button className="pl-skip" type="button" onClick={() => root.current?.skip()}>Skip intro</button>
    </div>
  );
}
