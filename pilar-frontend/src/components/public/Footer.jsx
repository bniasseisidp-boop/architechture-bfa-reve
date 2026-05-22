import { motion } from 'framer-motion';
import logo from '../../assets/logo.jpeg';
import './Footer.css';

const year = new Date().getFullYear();

const nav = [
  { label: 'Accueil',       href: '#hero' },
  { label: 'Services',      href: '#services' },
  { label: 'Réalisations',  href: '#realizations' },
  { label: 'Notre Équipe',  href: '#team' },
  { label: 'Devis',         href: '#devis' },
  { label: 'Contact',       href: '#contact' },
];

export default function Footer() {
  const goTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <img src={logo} alt="Pilar Construction" className="footer__logo" />
            <p className="footer__tagline">
              Bâtisseurs d'excellence depuis plus de 15 ans — de Derkle au monde entier.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="Facebook">f</a>
              <a href="#" className="footer__social" aria-label="Instagram">in</a>
              <a href="#" className="footer__social" aria-label="LinkedIn">li</a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul className="footer__links">
              {nav.map(l => (
                <li key={l.href}>
                  <button onClick={() => goTo(l.href)} className="footer__link">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4 className="footer__col-title">Nos Services</h4>
            <ul className="footer__links">
              {['Construction Résidentielle', 'Construction Commerciale', 'Rénovation', 'Architecture & Design', 'Gestion de Projets', 'Construction Durable']
                .map(s => <li key={s}><span className="footer__link">{s}</span></li>)}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <div className="footer__contact-list">
              <a href="tel:+22178456789" className="footer__contact-item">
                <span>📞</span> +221 78 456 78 93
              </a>
              <a href="mailto:multibrain@multibrain.cloud" className="footer__contact-item">
                <span>📧</span> multibrain@multibrain.cloud
              </a>
              <div className="footer__contact-item">
                <span>📍</span> Derkle, Dakar — Sénégal
              </div>
            </div>
            <a href="#devis" className="btn-primary footer__cta"
              onClick={e => { e.preventDefault(); goTo('#devis'); }}>
              Demander un devis
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {year} Pilar Construction. Tous droits réservés.</span>
          <motion.span
            className="footer__credit"
            whileHover={{ scale: 1.05 }}
          >
            Conçu & développé par{' '}
            <strong>MULTI BRAIN TECH</strong>
          </motion.span>
        </div>
      </div>
    </footer>
  );
}
