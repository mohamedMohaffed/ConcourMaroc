import DashboardNavbar from './components/DashboardNavbar/DashboardNavbar';
import useApi from '../../hooks/useApi';

const Dashboard = () => {
    const { data: scores, error, loading } = useApi("/concour/all-user-scores/");
    
    return (
        <div className="dashboard">
            <DashboardNavbar scores={scores} />
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
        </div>
    );
}

export default Dashboard;