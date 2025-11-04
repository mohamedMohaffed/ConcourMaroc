import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Login.css';
import blackImage from '../../assets/imgGirl.webp';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Loading from "../../components/Loading/Loading"
import { submitPendingQuizAnswers } from '../../utils/submitPendingQuizAnswers';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('redirect')) {
      setMsg("Vous devez être connecté pour accéder à cette page.");
      setMsgType("error");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('accounts/api/token/', { username, password });
      setMsg('Connecté!');
      setMsgType('success');
      // Use utility function for pending quiz answers
      const handled = await submitPendingQuizAnswers(navigate);
      if (handled) return;
      navigate('/concours/Bac/universites');
    } catch (error) {
      setMsg('Identifiants invalides');
      setMsgType('error');
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__icon">
        <Link to="/concours/Bac/universites">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            width="28"
            height="28">
            <path fill="#1CB0F6" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
        </svg>
        </Link>
      </div>
      <div className="login__form">
        <div className="login__logo">
          CONCOURS
          {loading && (
            <div className="login__loading-overlay">
              <Loading />
            </div>
          )}
        </div>
        <p className={`login__msg${msgType ? ' login__msg--' + msgType : ''}`}>{msg}</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="login__input-group">
            <input
              type="text"
              name="user_login"
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

          <div className="login__input-group">
            <input
              type="password"
              name="user_pass"
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

          <Link to="/mot-de-passe-oublie" >
            <p className="login__forgot-password" >Vous avez oublié votre mot de passe?</p>
          </Link>
          
          <button type="submit" className="login__btn" disabled={loading}>Se connecter</button>
          <Link to="/inscription" className="login__register-btn">S'inscrire</Link>
        </form>
      </div>
      <div className="login__image">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default Login;
