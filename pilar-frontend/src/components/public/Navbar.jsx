import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.jpeg';
import './Navbar.css';

const links = [
  { label: 'Accueil',      href: '#hero' },
  { label: 'Services',     href: '#services' },
  { label: 'Réalisations', href: '#realizations' },
  { label: 'Notre Équipe', href: '#team' },
  { label: 'Devis',        href: '#devis' },
  { label: 'Contact',      href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNav = (href) => {
    setActive(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="navbar__inner">
          {/* Logo */}
          <a href="#hero" className="navbar__logo" onClick={() => handleNav('#hero')}>
            <img src={logo} alt="Pilar Construction" />
          </a>

          {/* Desktop links */}
          <ul className="navbar__links">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  className={`navbar__link ${active === l.href ? 'navbar__link--active' : ''}`}
                  onClick={() => handleNav(l.href)}
                >
                  {l.label}
                  {active === l.href && (
                    <motion.span className="navbar__underline" layoutId="nav-underline" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a href="#devis" className="btn-primary navbar__cta" onClick={() => handleNav('#devis')}>
            Devis Gratuit
          </a>

          {/* Hamburger */}
          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                className="navbar__mobile-link"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(l.href)}
              >
                {l.label}
              </motion.button>
            ))}
            <a href="#devis" className="btn-primary" onClick={() => handleNav('#devis')} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
              Devis Gratuit
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
