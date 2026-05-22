import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import './Devis.css';

const PROJECT_TYPES = [
  'Construction Résidentielle',
  'Construction Commerciale',
  'Rénovation',
  'Architecture & Design',
  'Gestion de Projet',
  'Autre',
];

const BUDGETS = [
  'Moins de 5 000 000 FCFA',
  '5 000 000 – 20 000 000 FCFA',
  '20 000 000 – 50 000 000 FCFA',
  '50 000 000 – 100 000 000 FCFA',
  'Plus de 100 000 000 FCFA',
  'À définir',
];

const VP = { once: true, amount: 0.06 };

export default function Devis() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/devis', data);
      setSent(true);
      reset();
      toast.success('Votre demande a été envoyée !');
    } catch (e) {
      const msg = e.response?.data?.message || 'Erreur lors de l\'envoi. Réessayez.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="devis" className="devis">
      <div className="devis__bg-text" aria-hidden>DEVIS</div>

      <div className="container devis__grid">
        {/* Left info */}
        <motion.div
          className="devis__info"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Demande de Devis</span>
          <h2 className="section-title">
            Votre projet,<br /><span className="accent">notre priorité</span>
          </h2>
          <p className="devis__sub">
            Décrivez-nous votre projet et nous vous répondons sous <strong>48 heures</strong> avec une estimation personnalisée.
          </p>

          <div className="devis__features">
            {[
              { icon: '⚡', title: 'Réponse rapide', text: 'Sous 48h ouvrées' },
              { icon: '🎯', title: 'Devis précis',   text: 'Estimations détaillées' },
              { icon: '🔒', title: 'Confidentiel',   text: 'Données protégées' },
              { icon: '✅', title: 'Sans engagement', text: 'Consultation gratuite' },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="devis__feature"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <span className="devis__feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="devis__form-wrap"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {sent ? (
            <div className="devis__success">
              <span className="devis__success-icon">✅</span>
              <h3>Demande envoyée !</h3>
              <p>Nous vous contacterons dans les 48 heures avec votre devis personnalisé.</p>
              <button className="btn-primary" onClick={() => setSent(false)}>
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form className="devis__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="devis__form-row">
                <div className="field">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className={errors.full_name ? 'error' : ''}
                    {...register('full_name', { required: 'Requis' })}
                  />
                  {errors.full_name && <span className="field-error">{errors.full_name.message}</span>}
                </div>
                <div className="field">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    placeholder="Ex: 784567893"
                    className={errors.phone ? 'error' : ''}
                    {...register('phone', { required: 'Requis' })}
                  />
                  {errors.phone && <span className="field-error">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="field">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className={errors.email ? 'error' : ''}
                  {...register('email', { required: 'Requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                />
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </div>

              <div className="devis__form-row">
                <div className="field">
                  <label>Type de projet</label>
                  <select {...register('project_type')}>
                    <option value="">Sélectionner…</option>
                    {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Budget estimé</label>
                  <select {...register('budget')}>
                    <option value="">Sélectionner…</option>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Décrivez votre projet *</label>
                <textarea
                  rows={5}
                  placeholder="Décrivez votre projet en détail : localisation, superficie, délais souhaités…"
                  className={errors.message ? 'error' : ''}
                  {...register('message', { required: 'Requis', minLength: { value: 20, message: 'Min 20 caractères' } })}
                />
                {errors.message && <span className="field-error">{errors.message.message}</span>}
              </div>

              <motion.button
                type="submit"
                className="btn-primary devis__submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="devis__spinner" />
                ) : 'Envoyer ma demande →'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
