import DashboardNavbar from './components/DashboardNavbar/DashboardNavbar';
import useApi from '../../hooks/useApi';
import Loading from '../../components/Loading/Loading';
import './Dashboard.css'
import {motion} from 'framer-motion';

const Dashboard = () => {
    const { data: scores, error, loading } = useApi("/concour/all-user-scores/");
    console.log(scores);
    
    return (
        <motion.section 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{delay:0.2}}
        className="dashboard">
            <h1 className="dashboard__title">
                <span className="browse-list__title--first-letter">T</span>ableau de bord</h1>
            {loading && <div><Loading/></div>}

            {!loading && error && <div className="dashboard__error">{error.message}</div>}

            {!loading && !error && scores && scores.length === 0 && (
                <div className="dashboard__empty">
                    <p>Aucune donnée de score disponible pour le moment.</p>
                </div>
            )}
            {!loading && !error && scores && scores.length > 0 
                        && <DashboardNavbar scores={scores} />}
        </motion.section>
    );
}

export default Dashboard;