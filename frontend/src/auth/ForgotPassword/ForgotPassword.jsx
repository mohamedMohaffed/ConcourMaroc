import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/connexion">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              width="28"
              height="28">
              <path fill="#1CB0F6" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
          </svg>
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
          <Link to="/connexion" className="forgot-password__register-btn">Retour à la connexion</Link>
        </form>
      </div>
      <div className="forgot-password__image">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default ForgotPassword;
