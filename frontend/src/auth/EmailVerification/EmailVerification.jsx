import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Loading from '../../components/Loading/Loading';
import './EmailVerification.css';
import { submitPendingQuizAnswers } from '../../utils/submitPendingQuizAnswers';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axiosInstance.post('/accounts/api/verify-email/', { uid, token });
        setStatus('success');

        // Add delay before redirection
        setTimeout(async () => {
          navigate('/login');
        }, 3000); // 3 seconds delay
      } catch (error) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  return (
    <div className="email-verification">
      {status === 'verifying' && (
        <div className="verification-loading">
          <Loading />
          <p>Vérification de votre email...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="verification-success">
          <h2>Email vérifié avec succès!</h2>
          <p>Redirection vers la page de connexion...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="verification-error">
          <h2>Échec de la vérification</h2>
          <p>Le lien est invalide ou a expiré.</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
