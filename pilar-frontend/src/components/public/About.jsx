import { motion } from 'framer-motion';
import './About.css';

const pillars = [
  { icon: '◆', title: 'Notre Vision', text: 'Transformer chaque espace en chef-d\'œuvre architectural durable, reflet du talent africain sur la scène mondiale.' },
  { icon: '◆', title: 'Notre Mission', text: 'Livrer des constructions de qualité supérieure dans les délais convenus, respectant budgets et aspirations clients.' },
  { icon: '◆', title: 'Nos Valeurs', text: 'Intégrité, excellence, innovation et durabilité — les fondations sur lesquelles nous bâtissons chaque projet.' },
];

const VP = { once: true, amount: 0.08 };

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about__bg-text" aria-hidden>PILAR</div>

      <div className="container about__grid">
        {/* Left */}
        <motion.div
          className="about__left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Qui sommes-nous</span>
          <h2 className="section-title">
            Bâtir l'avenir avec<br /><span className="accent">précision</span>
          </h2>
          <p className="about__desc">
            Pilar Construction est une entreprise de référence dans le domaine du bâtiment et de l'architecture.
            Fondée par <strong>Baye Assane Niasse</strong>, elle incarne l'excellence africaine dans chaque projet —
            des fondations à la toiture, chaque détail est maîtrisé avec rigueur et passion.
          </p>

          <div className="about__pillars">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                className="about__pillar"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VP}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <span className="about__pillar-icon">{p.icon}</span>
                <div>
                  <h4 className="about__pillar-title">{p.title}</h4>
                  <p className="about__pillar-text">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#services"
            className="btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '2rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ delay: 0.4 }}
            onClick={e => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior:'smooth' }); }}
          >
            Découvrir nos services
          </motion.a>
        </motion.div>

        {/* Right — visual */}
        <motion.div
          className="about__right"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <div className="about__visual">
            <div className="about__card about__card--big">
              <span className="about__card-icon">🏗️</span>
              <span className="about__card-label">Qualité Certifiée</span>
            </div>
            <div className="about__card about__card--sm about__card--red">
              <span className="about__card-num">15+</span>
              <span className="about__card-label">Ans d'expertise</span>
            </div>
            <div className="about__card about__card--sm">
              <span className="about__card-num">200+</span>
              <span className="about__card-label">Projets livrés</span>
            </div>
            <div className="about__card about__card--wide">
              <div className="about__badge">
                <span>🏆</span>
                <div>
                  <strong>Leader</strong><br />
                  <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>Construction & Architecture</span>
                </div>
              </div>
            </div>
          </div>
          <div className="about__accent-line" />
        </motion.div>
      </div>
    </section>
  );
}
