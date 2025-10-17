import DashboardNavbar from './components/DashboardNavbar/DashboardNavbar';
import useApi from '../../hooks/useApi';
import Loading from '../../components/Loading/Loading';

const Dashboard = () => {
    const { data: scores, error, loading } = useApi("/concour/all-user-scores/");
    
    return (
        <div className="dashboard">
            <h1 className="dashboard__title"><span className="browse-list__title--first-letter">T</span>ableau de bord</h1>
            {loading && <div><Loading/></div>}
            {!loading && !error && scores && <DashboardNavbar scores={scores} />}
        </div>
    );
}

export default Dashboard;