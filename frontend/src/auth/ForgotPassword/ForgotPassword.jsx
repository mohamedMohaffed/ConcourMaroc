import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import Loading from "../../components/Loading/Loading";
import blackImage from '../../assets/imgGirl.jpeg';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('accounts/api/password-reset/', { email });
      setMsg('Un email de réinitialisation a été envoyé.');
      setMsgType('success');
    } catch (error) {
      setMsg('Erreur lors de l\'envoi de l\'email.');
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password__icon">
        <Link to="/login">
          <FontAwesomeIcon icon={faTimes} />
        </Link>
      </div>
      <div className="forgot-password__form">
        <div className="forgot-password__logo">
          CONCOURS
          {loading && (
            <div className="forgot-password__loading-overlay">
              <Loading />
            </div>
          )}
        </div>
        <p className={`forgot-password__msg${msgType ? ' forgot-password__msg--' + msgType : ''}`}>{msg}</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="forgot-password__input-group">
            <input
              type="email"
              value={email}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.label
              initial={{ top: '14px', fontSize: '16px', color: '#777777' }}
              animate={
                emailFocused || email
                  ? { top: '-10px', fontSize: '12px', color: '#1CB0F6' }
                  : { top: '14px', fontSize: '16px', color: '#777777' }
              }
              transition={{ duration: 0.3 }}
            >
              Email
            </motion.label>
          </div>
          <button type="submit" className="forgot-password__btn" disabled={loading}>
            Envoyer le lien
          </button>
          <Link to="/login" className="forgot-password__register-btn">Retour à la connexion</Link>
        </form>
      </div>
      <div className="forgot-password__image">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default ForgotPassword;
