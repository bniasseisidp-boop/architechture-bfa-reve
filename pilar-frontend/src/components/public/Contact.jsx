import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import api from '../../api/axios';
import './Contact.css';

const INFO = [
  { Icon: FiPhone, label: 'Téléphone',    value: '+221 78 456 78 93', href: 'tel:+22178456789' },
  { Icon: FiMail,  label: 'Email',        value: 'multibrain@multibrain.cloud', href: 'mailto:multibrain@multibrain.cloud' },
  { Icon: FiMapPin,label: 'Adresse',      value: 'Derkle, Dakar — Sénégal', href: null },
];

const VP = { once: true, amount: 0.06 };

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contact', data);
      toast.success('Message envoyé ! Nous vous répondons très vite.');
      reset();
    } catch {
      toast.error('Erreur d\'envoi. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.div
          className="contact__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title">
            Parlons de votre <span className="accent">projet</span>
          </h2>
        </motion.div>

        <div className="contact__grid">
          {/* Info cards */}
          <motion.div
            className="contact__infos"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {INFO.map(({ Icon, label, value, href }, i) => (
              <div key={i} className="contact__info-card">
                <div className="contact__info-icon"><Icon size={22} /></div>
                <div>
                  <span className="contact__info-label">{label}</span>
                  {href
                    ? <a href={href} className="contact__info-value">{value}</a>
                    : <span className="contact__info-value">{value}</span>
                  }
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="contact__map">
              <div className="contact__map-inner">
                <FiMapPin size={32} color="var(--red)" />
                <p>Derkle, Dakar<br />Sénégal</p>
                <span className="contact__map-label">Pilar Construction</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            className="contact__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="devis__form-row">
              <div className="field">
                <label>Nom *</label>
                <input type="text" placeholder="Votre nom" className={errors.name ? 'error' : ''}
                  {...register('name', { required: 'Requis' })} />
                {errors.name && <span className="field-error">{errors.name.message}</span>}
              </div>
              <div className="field">
                <label>Téléphone</label>
                <input type="tel" placeholder="Optionnel" {...register('phone')} />
              </div>
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" placeholder="votre@email.com" className={errors.email ? 'error' : ''}
                {...register('email', { required: 'Requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })} />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>
            <div className="field">
              <label>Message *</label>
              <textarea rows={6} placeholder="Votre message…" className={errors.message ? 'error' : ''}
                {...register('message', { required: 'Requis' })} />
              {errors.message && <span className="field-error">{errors.message.message}</span>}
            </div>
            <motion.button type="submit" className="btn-primary contact__submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? <span className="devis__spinner" /> : <><FiSend size={16} /> Envoyer le message</>}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
