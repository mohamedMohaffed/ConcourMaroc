import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../components/Loading/Loading'
import './SubjectsList.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const SubjectsList = () => {
    const { universite_slug, year_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/Bac/${universite_slug}/${year_slug}/subject/`);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(true);

    // Set isInitialRender to false after the first render
    useEffect(() => {
        if (data && isInitialRender) {
            setIsInitialRender(false);
        }
    }, [data]);

    const breadcrumbs = data && data.length > 0 ? [
        { text: "Bac", link: "" },
        { text: data[0].year.university.name, link: `/concours/Bac/universites` },
        { text: data[0].year.year, link: `/concours/Bac/${data[0].year.university.slug}/year` },
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
        <section className="subjects-list">
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
                        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" 
                            width="26" height="26">
                            <path fill="#777777" d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
                        </svg>
                    </Link>
                    {breadcrumbs && breadcrumbs.map((crumb, index) => (
                        <span key={index} className="breadcrumbs">
                            <svg  xmlns="http://www.w3.org/2000/svg" 
                                height="26" width="26" viewBox="0 0 640 640">
                                <path fill="#777777" d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
                            </svg>  
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                width="26"
                                height="26"
                                className="subjects-list__close-icon"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubjectClick(item.id);
                                }}
                            >
                                <path fill="#777777" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
                            </svg>
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
                                <Link to={`/concours/Bac/${universite_slug}/${year_slug}/${selectedSubject.slug}/concour`}>
                                <h1 className="subjects-list__type--quiz">Passer un Quiz</h1></Link>

                                <Link to={`/concours/Bac/${universite_slug}/${year_slug}/${selectedSubject.slug}/correction-concour/`}>
                                <h1 className="subjects-list__type--corr">Voir la Correction</h1></Link>
                            </motion.div> 
                        )}
        </section>
    );
};

export default SubjectsList;