import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import api from '../../api/axios';
import './Realizations.css';

const CATEGORIES = ['Tous', 'Résidentiel', 'Commercial', 'Rénovation', 'Institutionnel'];

const PLACEHOLDER_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#1b1b2f',
  '#2c2c54', '#192a56', '#273c75', '#2c3e50',
];

function RealCard({ item, index, inView }) {
  const [hovered, setHovered] = useState(false);
  const bg = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <motion.div
      className="real-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className="real-card__img" style={{ background: bg }}>
        {item.image_url
          ? <img src={item.image_url} alt={item.title} loading="lazy" />
          : (
            <div className="real-card__placeholder">
              <span className="real-card__placeholder-icon">🏛️</span>
              <span className="real-card__year">{item.year}</span>
            </div>
          )
        }

        <AnimatePresence>
          {hovered && (
            <motion.div
              className="real-card__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="real-card__overlay-content">
                <span className="real-card__cat">{item.category}</span>
                <h3 className="real-card__title-overlay">{item.title}</h3>
                <p className="real-card__desc-overlay">{item.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="real-card__info">
        <span className="real-card__tag">{item.category}</span>
        <h3 className="real-card__title">{item.title}</h3>
        <span className="real-card__year-badge">{item.year}</span>
      </div>
    </motion.div>
  );
}

export default function Realizations() {
  const [items, setItems]   = useState([]);
  const [filter, setFilter] = useState('Tous');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    api.get('/realizations').then(r => setItems(r.data)).catch(() => {});
  }, []);

  const filtered = filter === 'Tous'
    ? items
    : items.filter(i => i.category === filter);

  return (
    <section id="realizations" className="realizations" ref={ref}>
      <div className="container">
        <motion.div
          className="realizations__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Portfolio</span>
          <h2 className="section-title">
            Nos <span className="accent">Réalisations</span>
          </h2>
          <p className="realizations__sub">
            Chaque projet est une histoire — découvrez nos réalisations les plus marquantes.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="realizations__filters"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`real-filter ${filter === cat ? 'real-filter--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
              {filter === cat && <motion.span className="real-filter__dot" layoutId="filter-dot" />}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div className="realizations__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <RealCard key={item.id} item={item} index={i} inView={inView} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
