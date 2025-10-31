import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse, faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/Loading/Loading'
import './SubjectsList.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const SubjectsList = () => {
    const { niveau_slug, universite_slug, year_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/subject/`);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(true);

    // Set isInitialRender to false after the first render
    useEffect(() => {
        if (data && isInitialRender) {
            setIsInitialRender(false);
        }
    }, [data]);

    const breadcrumbs = data && data.length > 0 ? [
        { text: data[0].year.university.level.name, link: "" },
        { text: data[0].year.university.name, link: `/concours/${data[0].year.university.level.slug}/universites` },
        { text: data[0].year.year, link: `/concours/${data[0].year.university.level.slug}/${data[0].year.university.slug}/year` },
    ] : [];

    const handleSubjectClick = (subjectId) => {
        if (selectedSubjectId === subjectId) {
            setSelectedSubjectId(null);
        } else {
            setSelectedSubjectId(subjectId);
        }
    };

    const selectedSubject = data && data.find(item => item.id === selectedSubjectId);

    return (
        <section 
   
        className="subjects-list">
            <div className="subjects-list__header">
                <h1 className="subjects-list__title desktop-title">
                    <span className="subjects-list__title--first-letter">C</span>
                    hoisir votre matière d'entrée
                </h1>
                <h1 className="subjects-list__title mobile-title">
                    <span className="subjects-list__title--first-letter">C</span>
                    hoisir Matière
                </h1>
                <div className="subjects-list__path">
                    <Link to="">
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "not-allowed" }} />
                    </Link>
                    {breadcrumbs && breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            <FontAwesomeIcon icon={faChevronRight} />
                            {crumb.link ? (
                                <Link to={crumb.link}>
                                    <span style={{ cursor: "pointer" }}>{crumb.text}</span>
                                </Link>
                            ) : (
                                <span style={{ cursor: "not-allowed" }}>{crumb.text}</span>
                            )}
                        </span>
                    ))}
                </div>
           
            </div>

            <div className="subjects-list__items">
                {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading/></div>}
                {error && <p className="error">Error: {error.message}</p>}
                <AnimatePresence mode="popLayout">
                    {data && data
                        .filter(item => selectedSubjectId === null || item.id === selectedSubjectId)
                        .map((item) => (
                        <motion.div
                            layout
                            layoutId={`subject-${item.id}`}
                            key={item.id} 
                            className="subjects-list-item"
                            onClick={() => handleSubjectClick(item.id)}
                            initial={isInitialRender ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 30,
                                mass: 1
                            }}
                        >
                                    
                        <h2>{item.name}</h2>
                        {selectedSubjectId === item.id && (
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubjectClick(item.id);
                                }}
                                className="subjects-list__close-icon"
                                
                            /> 
                          
                        )}
                    </motion.div>
                ))}
                </AnimatePresence>
            
            </div>
              {selectedSubject && (
                            <motion.div 
                              initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay:0.3}}
                            
                            className="subjects-list__type">
                                <Link to={`/concours/${niveau_slug}/${universite_slug}/${year_slug}/${selectedSubject.slug}/concour`}>
                                <h1 className="subjects-list__type--quiz">Passer un Quiz</h1></Link>

                                <Link to={`/concours/${niveau_slug}/${universite_slug}/${year_slug}/${selectedSubject.slug}/correction-concour/`}>
                                <h1 className="subjects-list__type--corr">Voir la Correction</h1></Link>
                            </motion.div> 
                        )}
        </section>
    );
};

export default SubjectsList;