import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import api from '../../api/axios';
import './Services.css';

function ServiceCard({ service, index, inView }) {
  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 + 0.1, duration: 0.55 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
      <div className="service-card__icon">{service.icon}</div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__desc">{service.description}</p>
      <div className="service-card__arrow">→</div>
    </motion.div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <section id="services" className="services" ref={ref}>
      <div className="services__bg-stripe" aria-hidden />

      <div className="container">
        <motion.div
          className="services__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow text-white">Ce que nous faisons</span>
          <h2 className="section-title text-white">
            Nos <span className="accent">Services</span>
          </h2>
          <p className="services__sub">
            De la conception à la livraison — une gamme complète de services pour tous vos projets de construction et d'architecture.
          </p>
        </motion.div>

        <div className="services__grid">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} inView={inView} />
          ))}
        </div>

        <motion.div
          className="services__cta"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a href="#devis" className="btn-primary"
            onClick={e => { e.preventDefault(); document.querySelector('#devis')?.scrollIntoView({ behavior:'smooth' }); }}>
            Démarrer votre projet
          </a>
        </motion.div>
      </div>
    </section>
  );
}
