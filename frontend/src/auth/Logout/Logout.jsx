import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Loading from '../../components/Loading/Loading';
import './Logout.css';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await axiosInstance.post('/accounts/api/logout/', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                // Redirect to login page after successful logout
                navigate('/connexion');
            } catch (error) {
                console.error('Logout error:', error);
                // Even if logout fails, redirect to login
                navigate('/connexion');
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="center-loading">
            <Loading />
        </div>
    );
};

export default Logout;
