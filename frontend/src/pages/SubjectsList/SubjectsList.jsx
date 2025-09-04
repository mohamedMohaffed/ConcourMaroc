import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse, faTimes } from '@fortawesome/free-solid-svg-icons';
import './SubjectsList.css';
import {motion } from 'framer-motion';
import { useState } from 'react';

const SubjectsList = () => {
    const { niveau_slug, universite_slug, year_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/subject/`);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    const breadcrumbs = data && data.length > 0 ? [
        { text: data[0].year.university.level.name, link: "/concours/niveaux" },
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

 

    return (
        <motion.section 
         initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay:0.2}}
        className="subjects-list">
            <div className="subjects-list__header">
                <h1 className="subjects-list__title">
                    <span className="subjects-list__title--first-letter">C</span>
                    hoisir votre matière d'entrée
                </h1>
                <div className="subjects-list__path">
                    <Link to="/concours/niveaux">
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "pointer" }} />
                    </Link>
                    {breadcrumbs && breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            <FontAwesomeIcon icon={faChevronRight} />
                            {crumb.link ? (
                                <Link to={crumb.link}>
                                    <span style={{ cursor: "pointer" }}>{crumb.text}</span>
                                </Link>
                            ) : (
                                <span>{crumb.text}</span>
                            )}
                        </span>
                    ))}
                </div>
           
            </div>

            <div className="subjects-list__items">
                {loading && <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</p>}
                {error && <p className="error">Error: {error.message}</p>}
                {data && data
                    .filter(item => selectedSubjectId === null || item.id === selectedSubjectId)
                    .map((item) => (
                    <motion.div
                        layout
                        key={item.id} 
                        className="subjects-list-item"
                        onClick={() => handleSubjectClick(item.id)}
                        style={{ cursor: 'pointer', position: 'relative',
                                display: "flex", justifyContent: "center",
                                alignItems: "center" }}>
                                    
                        <h2>{item.name}</h2>
                        {selectedSubjectId === item.id && (
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubjectClick(item.id);
                                }}
                                style={{ 
                                    position: 'absolute', 
                                    top: '1.125rem', 
                                    left: '15rem', 
                                    cursor: 'pointer',
                                    fontSize: '1.125rem'
                                }}
                            /> 
                          
                        )}


                      
                       
                    </motion.div>
                ))}

            
            </div>
              {selectedSubjectId && (
                            <motion.div 
                              initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay:0.3}}
                            
                            className="subjects-list__type">
                                <h1 className="subjects-list__type--quiz">Passer un Quiz</h1>
                                <h1 className="subjects-list__type--corr">Voir la Correction</h1>
                            </motion.div> 
                        )}
        </motion.section>
    );
};

export default SubjectsList;