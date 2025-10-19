import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import Loading from "../../components/Loading/Loading";
import blackImage from '../../assets/imgGirl.jpeg';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg('Les mots de passe ne correspondent pas');
      setMsgType('error');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('accounts/api/password-reset/confirm/', {
        uid,
        token,
        new_password: newPassword
      });
      setMsg('Mot de passe réinitialisé avec succès');
      setMsgType('success');
      setTimeout(() => navigate('/connexion'), 2000);
    } catch (error) {
      setMsg('Erreur lors de la réinitialisation du mot de passe');
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password__icon">
        <Link to="/connexion">
          <FontAwesomeIcon icon={faTimes} />
        </Link>
      </div>
      <div className="reset-password__form">
        <div className="reset-password__logo">
          CONCOURS
          {loading && (
            <div className="reset-password__loading-overlay">
              <Loading />
            </div>
          )}
        </div>
        <p className={`reset-password__msg${msgType ? ' reset-password__msg--' + msgType : ''}`}>{msg}</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="reset-password__input-group">
            <input
              type="password"
              value={newPassword}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <motion.label
              initial={{ top: '14px', fontSize: '16px', color: '#777777' }}
              animate={
                newPasswordFocused || newPassword
                  ? { top: '-10px', fontSize: '12px', color: '#1CB0F6' }
                  : { top: '14px', fontSize: '16px', color: '#777777' }
              }
              transition={{ duration: 0.3 }}
            >
              Nouveau mot de passe
            </motion.label>
          </div>
          <div className="reset-password__input-group">
            <input
              type="password"
              value={confirmPassword}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <motion.label
              initial={{ top: '14px', fontSize: '16px', color: '#777777' }}
              animate={
                confirmPasswordFocused || confirmPassword
                  ? { top: '-10px', fontSize: '12px', color: '#1CB0F6' }
                  : { top: '14px', fontSize: '16px', color: '#777777' }
              }
              transition={{ duration: 0.3 }}
            >
              Confirmer le mot de passe
            </motion.label>
          </div>
          <button type="submit" className="reset-password__btn" disabled={loading}>
            Réinitialiser
          </button>
          <Link to="/connexion" className="reset-password__register-btn">Retour à la connexion</Link>
        </form>
      </div>
      <div className="reset-password__image">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default ResetPassword;
