import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Bienvenue !');
      navigate('/admin/dashboard');
    } catch (e) {
      const msg = e.response?.data?.message || 'Identifiants incorrects.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__particles" />
      <motion.div
        className="admin-login__card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <img src={logo} alt="Pilar Construction" className="admin-login__logo" />
        <h1 className="admin-login__title">Espace Admin</h1>
        <p className="admin-login__sub">Connectez-vous pour gérer votre site</p>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-login__form" noValidate>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="moussasene@pilarconstruction.com"
              className={errors.email ? 'error' : ''}
              {...register('email', { required: 'Requis' })} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input type="password" placeholder="••••••••"
              className={errors.password ? 'error' : ''}
              {...register('password', { required: 'Requis' })} />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>
          <motion.button
            type="submit"
            className="btn-primary admin-login__btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <span className="devis__spinner" /> : 'Se connecter'}
          </motion.button>
        </form>

        <a href="/" className="admin-login__back">← Retour au site</a>
      </motion.div>
    </div>
  );
}
