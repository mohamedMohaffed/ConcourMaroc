import useApi from '../../hooks/useApi';
import {useParams } from 'react-router-dom';
import MarkdownWithMath from '../../components/MarkdownWithMath/MarkdownWithMath'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse,faArrowLeft,faArrowRight, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
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
            className="correction__btn"
            disabled={index === 0}
            onClick={goToPrevious}>
            <FontAwesomeIcon icon={faArrowLeft} /> 
            <span className="correction__nav-text">Précédent</span>
        </button>

        <button
        className="correction__btn" 
        disabled={index === totalQuestions - 1}
        onClick={goToNext}>
            <span className="correction__nav-text">Suivant</span>
            <FontAwesomeIcon icon={faArrowRight} />
        </button>
        </div>
    )
}

const CorrectionCircles = ({ currentIndex, setIndex, totalQuestions }) => (
    <div className="correction__circles-nav" style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '1rem 0' }}>
        {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
                key={i}
                className={`correction__circle${currentIndex === i ? ' selected' : ''}`}
                style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '50%',
                    background: currentIndex === i ? '#3b82f6' : '#f1f5f9',
                    color: currentIndex === i ? '#fff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.2s',
                }}
                onClick={() => setIndex(i)}
            >
                {i + 1}
            </div>
        ))}
    </div>
);

const Correction = () => {
    const [index, setIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`);

    console.log("im",data)
    if (loading || !data) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data[0] || !data[0].questions || !data[0].questions[index]) return <div>No data found.</div>;

    const question = data[0].questions[index];
    const breadcrumbs = data && data[0] && data[0].subject ? [
        { text: data[0].subject.year.university.level.slug, link: "" },
        { 
            text: data[0].subject.year.university.slug, 
            link: `/concours/${data[0].subject.year.university.level.slug}/universites` 
        },
        { 
            text: data[0].subject.year.slug, 
            link: `/concours/${data[0].subject.year.university.level.slug}/${data[0].subject.year.university.slug}/year` 
        },
        { 
            text: data[0].subject.slug, 
            link: `/concours/${data[0].subject.year.university.level.slug}/${data[0].subject.year.university.slug}/${data[0].subject.year.slug}/matieres` 
        }
    ] : [];

    // Copy question and choices to clipboard
    const handleCopy = () => {
        if (!question) return;
        const questionText = typeof question.question === 'string' ? question.question : '';
        const choicesText = question.choices.map((choice, idx) => {
            // Mark correct choice with *
            return `${String.fromCharCode(65 + idx)}) ${choice.text}${choice.is_correct ? ' *' : ''}`;
        }).join('\n');
        const toCopy = `${questionText}\n\n${choicesText}`;
        navigator.clipboard.writeText(toCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        });
    };

    return (
        <section className="correction">
            <div className="correction__header">
                <h1 className="correction__title desktop-title">
                    <span className="correction__title--first-letter">C</span>
                   orrigé du concours
                </h1>
                <h1 className="correction__title mobile-title">
                    <span className="correction__title--first-letter">C</span>
                   orrigé
                </h1>
                <div className="correction__path">
                    <Link to="">
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "not-allowed" }} />
                    </Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i}>
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

            <div className="correction__content">
                <CorrectionCircles currentIndex={index} setIndex={setIndex} totalQuestions={data[0].questions.length} />

                <div className="correction__question_and_choices">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 className="correction__question">
                            {<LatexRenderer latex={question.question}/>}
                        </h2>
                        <button
                            className={`correction__copy-btn${copied ? ' copied' : ''}`}
                            onClick={handleCopy}
                            title={copied ? "Copié !" : "Copier la question"}
                        >
                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                        </button>
                    </div>
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
                </div>
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