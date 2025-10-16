import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Register.css';
import blackImage from '../../assets/imgGirl.jpeg';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Loading from "../../components/Loading/Loading"

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
    <div className="register-container">
      <div className="register-form" style={{ position: 'relative' }}>
        <div className="logo-register" style={{ position: 'relative' }}>
          CONCOURS
          {loading && (
            <div style={{
              position: 'absolute',
              top: -80,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // background: 'rgba(255,255,255,0.8)',
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

          <div className="input-group">
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

          <button type="submit" className="register-btn" disabled={loading}>S'inscrire</button>
          <Link to="/login" className="login-btn">Se connecter</Link>
          <p className={`register-msg${msgType ? ' ' + msgType : ''}`}>{msg}</p>
        </form>
      </div>
      <div className="image-register">
        <img src={blackImage} alt="Black" />
      </div>
    </div>
  );
};

export default Register;
