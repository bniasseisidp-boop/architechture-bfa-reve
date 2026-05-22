import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './Hero.css';

/* ── Canvas Particle System ─────────────────────── */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    const mouse = { x: null, y: null };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.vx   = (Math.random() - 0.5) * 0.4;
        this.vy   = (Math.random() - 0.5) * 0.4;
        this.r    = Math.random() * 1.8 + 0.6;
        this.life = Math.random();
        this.isRed = Math.random() < 0.06;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
        // mouse repulsion
        if (mouse.x !== null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            this.x += dx / dist * 1.5;
            this.y += dy / dist * 1.5;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.isRed ? 'rgba(209,43,43,0.85)' : 'rgba(30,30,30,0.28)';
        ctx.fill();
      }
    }

    const init = () => {
      const count = Math.min(Math.floor(canvas.width * canvas.height / 9000), 160);
      particles = Array.from({ length: count }, () => new Particle());
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - d / 130) * 0.18;
            ctx.strokeStyle = `rgba(30,30,30,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = () => { mouse.x = null; mouse.y = null; };

    resize();
    animate();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [canvasRef]);
}

/* ── Typewriter ─────────────────────────────────── */
const phrases = [
  'Construire l\'excellence.',
  'Bâtir vos rêves.',
  'Transformer l\'espace.',
  'Dépasser les limites.',
];

function useTypewriter(phrases) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[idx % phrases.length];
    const speed  = isDeleting ? 40 : 80;
    const pause  = isDeleting ? 0 : (text === phrase ? 1800 : 0);

    const t = setTimeout(() => {
      if (!isDeleting && text === phrase)      { setIsDeleting(true); return; }
      if (isDeleting  && text === '')          { setIsDeleting(false); setIdx(i => i + 1); return; }
      setText(isDeleting ? text.slice(0, -1) : phrase.slice(0, text.length + 1));
    }, pause || speed);

    return () => clearTimeout(t);
  }, [text, idx, isDeleting, phrases]);

  return text;
}

/* ── Stats ──────────────────────────────────────── */
const stats = [
  { value: 15, suffix: '+', label: 'Années\nd\'expérience' },
  { value: 200, suffix: '+', label: 'Projets\nréalisés' },
  { value: 150, suffix: '+', label: 'Clients\nsatisfaits' },
  { value: 50, suffix: '+', label: 'Experts\nen BTP' },
];

export default function Hero() {
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  const typeText = useTypewriter(phrases);
  const { ref: statsRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero__canvas" />

      {/* Dark overlay + diagonal cut */}
      <div className="hero__overlay" />

      <div className="hero__content container">
        <motion.span
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Excellence · Innovation · Qualité
        </motion.span>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          PILAR<br />
          <span className="hero__title-accent">CONSTRUCTION</span>
        </motion.h1>

        <motion.div
          className="hero__typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span>{typeText}</span><span className="hero__cursor">|</span>
        </motion.div>

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          Pilar Construction transforme vos visions architecturales en réalités<br />
          durables et exceptionnelles — de Derkle au monde entier.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <a href="#realizations" className="btn-primary hero__btn-main"
            onClick={e => { e.preventDefault(); document.querySelector('#realizations')?.scrollIntoView({ behavior:'smooth' }); }}>
            Voir nos réalisations ↓
          </a>
          <a href="#devis" className="hero__btn-secondary"
            onClick={e => { e.preventDefault(); document.querySelector('#devis')?.scrollIntoView({ behavior:'smooth' }); }}>
            Devis gratuit
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span className="hero__scroll-dot" />
          <span className="hero__scroll-label">Défiler</span>
        </motion.div>
      </div>

      {/* Stats band */}
      <div ref={statsRef} className="hero__stats">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="hero__stat"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.1 + 0.1, duration: 0.6 }}
          >
            <div className="hero__stat-number">
              {inView ? <CountUp end={s.value} duration={2.5} /> : '0'}{s.suffix}
            </div>
            <div className="hero__stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Geometric accents */}
      <div className="hero__geo hero__geo--1" />
      <div className="hero__geo hero__geo--2" />
    </section>
  );
}
