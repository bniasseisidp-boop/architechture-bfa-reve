import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Founder.css';

export default function Founder() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="founder" className="founder" ref={ref}>
      <div className="founder__bg-text" aria-hidden>FONDATEUR</div>

      <div className="container founder__grid">
        {/* Avatar */}
        <motion.div
          className="founder__visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="founder__avatar-wrap">
            <div className="founder__avatar">
              <span className="founder__initials">BN</span>
            </div>
            <div className="founder__avatar-ring" />
            <div className="founder__badge">
              <span>🏆</span> Fondateur
            </div>
          </div>

          <div className="founder__quote-box">
            <span className="founder__quote-mark">"</span>
            <p className="founder__quote-text">
              Chaque bâtiment que nous construisons est un engagement envers l'avenir —
              une promesse de durabilité, de beauté et d'excellence.
            </p>
            <div className="founder__quote-author">
              — Baye Assane Niasse
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="founder__content"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="section-eyebrow" style={{ color: 'var(--red)' }}>Le Fondateur</span>
          <h2 className="section-title" style={{ color: 'var(--black)' }}>
            Baye Assane<br /><span className="accent">Niasse</span>
          </h2>
          <div className="founder__role">Fondateur & PDG — Pilar Construction</div>

          <div className="founder__bio">
            <p>
              Originaire de <strong>Derkle</strong>, Baye Assane Niasse est un visionnaire dont la passion
              pour l'architecture et la construction a façonné une entreprise de référence.
              Avec plus de <strong>15 années d'expérience</strong> dans le secteur du BTP,
              il a su allier tradition et modernité pour créer des espaces qui perdurent.
            </p>
            <p>
              Sous sa direction, Pilar Construction a livré plus de <strong>200 projets</strong> —
              des villas résidentielles aux complexes commerciaux — chacun portant la signature
              d'une excellence sans compromis.
            </p>
            <p>
              Sa philosophie ? <em>"Un bâtiment bien construit est la meilleure carte de visite."</em>
            </p>
          </div>

          <div className="founder__stats">
            <div className="founder__stat">
              <span className="founder__stat-num">15+</span>
              <span className="founder__stat-label">Ans d'expérience</span>
            </div>
            <div className="founder__stat">
              <span className="founder__stat-num">200+</span>
              <span className="founder__stat-label">Projets réalisés</span>
            </div>
            <div className="founder__stat">
              <span className="founder__stat-num">100%</span>
              <span className="founder__stat-label">Engagement qualité</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
