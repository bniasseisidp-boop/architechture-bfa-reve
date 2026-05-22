import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import './Team.css';

const VP = { once: true, amount: 0.06 };

function TeamCard({ member, index }) {
  return (
    <motion.div
      className={`team-card ${member.is_founder ? 'team-card--founder' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ delay: index * 0.1, duration: 0.55 }}
    >
      <div className="team-card__avatar">
        {member.photo_url
          ? <img src={member.photo_url} alt={member.name} />
          : <span className="team-card__initials">
              {member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </span>
        }
        {member.is_founder && <div className="team-card__founder-badge">Fondateur</div>}
      </div>
      <div className="team-card__body">
        <h3 className="team-card__name">{member.name}</h3>
        <span className="team-card__role">{member.role}</span>
        <p className="team-card__desc">{member.description}</p>
      </div>
      <div className="team-card__accent" />
    </motion.div>
  );
}

export default function Team() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    api.get('/team').then(r => setMembers(r.data)).catch(() => {});
  }, []);

  return (
    <section id="team" className="team">
      <div className="container">
        <motion.div
          className="team__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Notre Équipe</span>
          <h2 className="section-title">
            Les Experts <span className="accent">Pilar</span>
          </h2>
          <p className="team__sub">
            Une équipe de professionnels passionnés, unis par la même vision d'excellence.
          </p>
        </motion.div>

        <div className="team__grid">
          {members.map((m, i) => (
            <TeamCard key={m.id} member={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
