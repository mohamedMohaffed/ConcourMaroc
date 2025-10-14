import useApi from '../../hooks/useApi';
import './PracticeList.css';
import { Link } from 'react-router-dom';
import {motion } from 'framer-motion';
import Loading from '../../components/Loading/Loading';

const PracticeList = () => {
    const { data, error, loading } = useApi("concour/list-mauvaises-reponses/");

    return (
        <motion.section
         initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{delay:0.2}}
        className="practice-list">
            <div className="practice-list__header">
                <h1 className="practice-list__title">
                    <span className="practice-list__title--first-letter">P</span>
                    ractice List
                </h1>
            </div>
            <div className="practice-list__items">
                {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading/></div>}
                {error && <div>Error: {error.message}</div>}
                {data && data.map((item, index) => (
                    <Link 
                        to={`/pratique/${item.concours_slug}`} 
                        key={index} 
                        className="practice-list-item"
                    >
                        {`${item.level}-${item.university}-${item.year}-${item.subject}`}
                    </Link>
                ))}
            </div>
        </motion.section>
    );
}

export default PracticeList;