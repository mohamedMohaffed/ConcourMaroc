import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Login.css';
// import blackImage from '../../assets/blackimage.png';
import blackImage from '../../assets/imgGirl.jpeg';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Loading from "../../components/Loading/Loading"
const Login = () => {
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
      await axiosInstance.post('accounts/api/token/', { username, password });
      setMsg('Connecté!');
      setMsgType('success');
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
    <div className="login-container">
      <div className="login-form" style={{ position: 'relative' }}>
        <div className="logo-login" style={{ position: 'relative' }}>
          CONCOURS
          {loading && (
            <div style={{
              position: 'absolute',
              top: -100,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.8)',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <Loading />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
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

          <div className="input-group">
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

          <p>Vous avez oublié votre mot de passe?</p>
          <button type="submit" className="login-btn" disabled={loading}>Se connecter</button>
          <Link to="/register" className="register-btn">S'inscrire</Link>
          <p className={`login-msg${msgType ? ' ' + msgType : ''}`}>{msg}</p>
        </form>
      </div>
      <div className="image-login">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default Login;
