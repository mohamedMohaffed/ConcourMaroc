import useApi from '../../hooks/useApi';
import {useParams } from 'react-router-dom';
import MarkdownWithMath from '../../components/MarkdownWithMath/MarkdownWithMath'
import { Link } from 'react-router-dom';
import './Correction.css';
import useQuizActions from '../../pages/Quiz/hooks/useQuizActions';
import React,{useState} from 'react';
import LatexRenderer from '../../pages/Quiz/components/LatexRenderer/LatexRenderer';
import Loading from '../../components/Loading/Loading';

const CorrectionNavigation = ({index,setIndex,totalQuestions})=>{
    const { goToPrevious, goToNext } = useQuizActions(index, setIndex, totalQuestions);

    return(
        <div className="correction__navigation">
        <button
            className="correction__btn"
            disabled={index === 0}
            onClick={goToPrevious}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 640 640" >
                    <path fill="#ffffffff" d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"/>
            </svg>
            <span className="correction__nav-text">Précédent</span>
        </button>

        <button
        className="correction__btn" 
        disabled={index === totalQuestions - 1}
        onClick={goToNext}>
            <span className="correction__nav-text">Suivant   </span>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="22" width="22">
                <path fill="#ffffff" d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
            </svg>
        </button>
        </div>
    )
}

const CorrectionCircles = ({ currentIndex, setIndex, totalQuestions }) => (
    <div className="correction__circles-nav" >
        {Array.from({ length: totalQuestions }).map((_, i) => (
            <dicv
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
            </dicv>
        ))}
    </div>
);

const Correction = () => {
    const [index, setIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const { universite_slug, year_slug, subject_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/Bac/${universite_slug}/${year_slug}/${subject_slug}/concour/`);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '62vh',
                overflow: "hidden",
            }}>
                <Loading />
            </div>
        );
    }

    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }

    if (!Array.isArray(data) || !data[0] || !data[0].questions || !data[0].questions.length) {
        return <div className="error">Aucune donnée trouvée.</div>;
    }

    const question = data[0].questions[index];
    const breadcrumbs = data[0].subject ? [
        { text: "Bac", link: "" },
        { 
            text: data[0].subject.year.university.slug, 
            link: `/concours/Bac/universites` 
        },
        { 
            text: data[0].subject.year.slug, 
            link: `/concours/Bac/${data[0].subject.year.university.slug}/year` 
        },
        { 
            text: data[0].subject.slug, 
            link: `/concours/Bac/${data[0].subject.year.university.slug}/${data[0].subject.year.slug}/matieres` 
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
                        <svg className="house__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" 
                        width="26" height="26">
                            <path fill="#777777" d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
                        </svg>
                    </Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span className="breadcrumbs" key={i}>
                            <svg className="chevronRight__icon" xmlns="http://www.w3.org/2000/svg" 
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

            <div className="correction__content">
                <CorrectionCircles currentIndex={index} setIndex={setIndex} totalQuestions={data[0].questions.length} />

                <div className="correction__question_and_choices">
                    <div className="correction__question__copy">
                        <h2 className="correction__question">
                            {<LatexRenderer latex={question.question}/>}
                        </h2>
                        <button
                            className={`correction__copy-btn${copied ? ' copied' : ''}`}
                            onClick={handleCopy}
                            title={copied ? "Copié !" : "Copier la question"}
                        >
                            {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="22" height="22">
                                    <path fill="currentColor" d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="22" height="22">
                                    <path fill="#777777" d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z"/>
                                </svg>
                            )}
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