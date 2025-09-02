import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await axios.post('http://localhost:8000/accounts/api/logout/', {}, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                // Redirect to login page after successful logout
                navigate('/login');
            } catch (error) {
                console.error('Logout error:', error);
                // Even if logout fails, redirect to login
                navigate('/login');
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Logging out...</h2>
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Logout;
