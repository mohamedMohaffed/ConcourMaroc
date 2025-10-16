import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Register.css';
import blackImage from '../../assets/imgGirl.jpeg';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Loading from "../../components/Loading/Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/accounts/api/register/', { username, password });
      setMsg("Inscription réussie ! Veuillez vous connecter.");
      setMsgType("success");
      setTimeout(() => navigate('/login'), 1500); 
    } catch (error) {
      setMsg("Échec de l'inscription !");
      setMsgType("error");
      console.error("Erreur d'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__icon">
        <Link to="/concours/Bac/universites"><FontAwesomeIcon icon={faTimes} /></Link>
      </div>
      <div className="register__form">
        <div className="register__logo">
          CONCOURS
          {loading && (
            <div className="register__loading-overlay">
              <Loading />
            </div>
          )}
        </div>
        <p className={`register__msg${msgType ? ' register__msg--' + msgType : ''}`}>{msg}</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="register__input-group">
            <input
              type="text"
              name="username"
              autoComplete="off"
              value={username}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <motion.label
              initial={{ top: '14px', fontSize: '16px', color: '#777777' }}
              animate={
                usernameFocused || username
                  ? { top: '-10px', fontSize: '12px', color: '#1CB0F6' }
                  : { top: '14px', fontSize: '16px', color: '#777777' }
              }
              transition={{ duration: 0.3 }}
            >
              Nom d'utilisateur
            </motion.label>
          </div>

          <div className="register__input-group">
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <motion.label
              initial={{ top: '14px', fontSize: '16px', color: '#777777' }}
              animate={
                passwordFocused || password
                  ? { top: '-10px', fontSize: '12px', color: '#1CB0F6' }
                  : { top: '14px', fontSize: '16px', color: '#777777' }
              }
              transition={{ duration: 0.3 }}
            >
              Mot de passe
            </motion.label>
          </div>

          <button type="submit" className="register__btn" disabled={loading}>S'inscrire</button>
          <Link to="/login" className="register__login-btn">Se connecter</Link>
        </form>
      </div>
      <div className="register__image">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default Register;
