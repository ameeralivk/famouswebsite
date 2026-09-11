import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Frames live in public/frames/, named ezgif-frame-001.jpg ... ezgif-frame-120.jpg.
const FRAME_COUNT = 120;
const frameSrc = (i) => `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

// Edit these to match what the footage actually shows — captions fade in/out at fixed points
// along the pinned scroll (see the timeline below).
const STEPS = [
  {
    eyebrow: '01 / Sourced Right',
    title: 'Genuine Brands, Verified Quality',
    body: 'Every tool and fitting on our shelves is sourced from trusted manufacturers — no compromises on what goes into your home.',
    align: 'left'
  },
  {
    eyebrow: '02 / Built to Last',
    title: 'Tested Before It Reaches You',
    body: 'From bolts to breakers, each piece is checked for quality so it holds up on the job, not just in the box.',
    align: 'right'
  },
  {
    eyebrow: '03 / Always in Stock',
    title: 'Ready on Our Shelves',
    body: 'Hardware, sanitary, and lighting — stocked and ready in Kodinhi, so you never have to wait on what you need.',
    align: 'left'
  }
];

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const scrollTriggerRef = useRef(null);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Preload all frames, but only wait on the first one before revealing the canvas — showing
  // one slow/broken frame among 120 shouldn't leave the whole animation stuck invisible.
  useEffect(() => {
    let cancelled = false;
    const images = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = frameSrc(i);
      return img;
    });
    imagesRef.current = images;

    images[0].onload = () => {
      if (!cancelled) setFirstFrameReady(true);
    };

    return () => {
      cancelled = true;
    };
  }, []);

  // Wire the canvas + captions up to scroll once the first frame is ready. Pinned: the Hero
  // holds in place while the animation scrubs through and the captions step through, then
  // releases scroll once it finishes. GSAP is loaded on demand rather than imported at the top
  // of the file, so it doesn't add to the main bundle every route pays for.
  useEffect(() => {
    if (!firstFrameReady) return;
    let ctxGsap;
    let cancelled = false;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    const images = imagesRef.current;
    const sequence = { frame: 0 };
    const render = () => {
      const img = images[sequence.frame];
      if (img?.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };
    render();

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctxGsap = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=3500',
            scrub: 0.5,
            pin: true
          }
        });

        tl.to(sequence, { frame: FRAME_COUNT - 1, snap: 'frame', ease: 'none', onUpdate: render }, 0);

        tl.fromTo('.hw-step-1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.08)
          .to('.hw-step-1', { opacity: 0, y: -20, duration: 0.1 }, 0.28);

        tl.fromTo('.hw-step-2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.38)
          .to('.hw-step-2', { opacity: 0, y: -20, duration: 0.1 }, 0.58);

        tl.fromTo('.hw-step-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.68)
          .to('.hw-step-3', { opacity: 0, y: -20, duration: 0.1 }, 0.86);

        tl.fromTo('.hw-step-cta', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.9);

        scrollTriggerRef.current = tl.scrollTrigger;
      }, containerRef);
    });

    return () => {
      cancelled = true;
      scrollTriggerRef.current = null;
      ctxGsap?.revert();
    };
  }, [firstFrameReady]);

  // ScrollTrigger's pin wraps this section in a spacer and mutates the DOM directly, outside
  // React's tracking. If we navigate away (via the CTA below) before that's torn down, the
  // pinned overlay can linger on top of the next page until a full reload cleans the slate —
  // so kill it explicitly the instant the link is clicked, before React Router navigates.
  const handleExploreClick = () => {
    scrollTriggerRef.current?.kill();
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-hero-gradient h-screen">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          firstFrameReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 pointer-events-none">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className={`hw-step-${i + 1} absolute top-1/2 -translate-y-1/2 max-w-md opacity-0 bg-ink-900/70 backdrop-blur-md border border-brand-500/25 shadow-card-hover p-6 rounded-2xl ${
              step.align === 'left' ? 'left-0' : 'right-0 text-left'
            }`}
          >
            <p className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">{step.eyebrow}</p>
            <h3 className="text-2xl md:text-3xl font-display text-white mb-2">{step.title}</h3>
            <p className="text-ink-200 text-sm leading-relaxed">{step.body}</p>
          </div>
        ))}

        <div className="hw-step-cta absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 pointer-events-auto flex justify-center">
          <div className="bg-ink-900/70 backdrop-blur-md border border-brand-500/25 shadow-card-hover p-8 rounded-3xl max-w-lg mx-4 text-center">
            <h3 className="text-3xl md:text-5xl font-display text-brand-300 mb-3">Everything, Under One Roof</h3>
            <p className="text-ink-200 text-sm mb-6">Hardware, sanitary, and lighting — ready when you are.</p>
            <Link
              to="/shop"
              onClick={handleExploreClick}
              className="inline-block px-8 py-3 bg-brand-gradient hover:opacity-90 text-white font-semibold text-sm rounded-full tracking-wide shadow-card transition-all transform hover:scale-105"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
