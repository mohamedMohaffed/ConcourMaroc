import useApi from '../../hooks/useApi';
import {useParams } from 'react-router-dom';
import MarkdownWithMath from '../../components/MarkdownWithMath/MarkdownWithMath'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse,faArrowLeft,faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Correction.css';
import useQuizActions from '../../pages/Quiz/hooks/useQuizActions';
import React,{useState} from 'react';
import LatexRenderer from '../../pages/Quiz/components/LatexRenderer/LatexRenderer';

const CorrectionNavigation = ({index,setIndex,totalQuestions})=>{
    const { goToPrevious, goToNext } = useQuizActions(index, setIndex, totalQuestions);

    return(
        <div className="correction__navigation">
        <button 
            disabled={index === 0}
            onClick={goToPrevious}>
            <FontAwesomeIcon icon={faArrowLeft} /> 
            <span className="correction__nav-text">Précédent</span>
        </button>

        <button 
        disabled={index === totalQuestions - 1}
        onClick={goToNext}>
            <span className="correction__nav-text">Suivant</span>
            <FontAwesomeIcon icon={faArrowRight} />
        </button>
        </div>
    )
}

const Correction = () => {
    const [index, setIndex] = useState(0);
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`);

    if (loading || !data) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data[0] || !data[0].questions || !data[0].questions[index]) return <div>No data found.</div>;

    const question = data[0].questions[index];
    const breadcrumbs = data && data[0] && data[0].subject ? [
        { text: data[0].subject.year.university.level.slug, link: "/concours/niveaux" },
        { text: data[0].subject.year.university.slug , link: `/concours/${data[0].subject.year?.niveau?.slug}/universites` },
        { text: data[0].subject.year?.year, link: `/concours/${data[0].subject.year?.niveau?.slug}/${data[0].subject.year?.universite?.slug}/year` },
        { text: data[0].subject?.slug, link: `/concours/${data[0].subject.year?.niveau?.slug}/${data[0].subject.year?.universite?.slug}/${data[0].subject.year?.year}/matieres` }
    ] : [];

    return (
        <section>
            <div className="correction__header">
                <h1 className="correction__title desktop-title">
                    <span className="correction__title--first-letter">C</span>
                   orrigé du concours
                </h1>
                <h1 className="correction__title mobile-title">
                    <span className="correction__title--first-letter">R</span>
                   ésultats
                </h1>
                <div className="correction__path">
                    <Link to="/concours/niveaux">
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "pointer" }} />
                    </Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i}>
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

            <div className="correction__content">
                <h2 className="correction__question">{<LatexRenderer latex={question.question}/>} </h2>
                <ul className="correction__choices">
                    {question.choices.map((choice) => (
                        <li
                            key={choice.id}
                            className={`correction__choice ${choice.is_correct ? 'correct' : ''}`}
                        >
                            {<LatexRenderer latex={choice.text} />}

                        </li>
                    ))}
                </ul>
                {question.explanation && (
                    <div className="correction__explanation">
                        <MarkdownWithMath content={question.explanation} />
                    </div>
                )}
            </div>
            
            <CorrectionNavigation index={index} setIndex={setIndex} totalQuestions={data[0].questions.length} />
        </section>
    );
}
export default Correction;