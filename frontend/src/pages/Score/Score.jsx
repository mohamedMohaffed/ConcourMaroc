import useApi from '../../hooks/useApi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Score.css';
import axiosInstance from '../../utils/axiosInstance';
import { motion } from 'framer-motion';

import { useState} from 'react';
//
import HeaderScore from './components/HeaderScore/HeaderScore';
import SubNavbar from './components/SubNavbar/SubNavbar';
import InfoScore from './components/InfoScore/InfoScore';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import Loading from '../../components/Loading/Loading';
//

const Score = () => {
    const { concour_id } = useParams();
    const { data, error, loading } = useApi(`/concour/last-score/${concour_id}`);
    const navigate = useNavigate();
    console.log(data);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (loading) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading/></p>;
    }
    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }
    if (!data || !data.score) {
        return null;
    }

    // Add breadcrumbs logic here
    const breadcrumbs = [
        { text: data.score.slug_level, link: "" },
        { text: data.score.slug_university, link: `/concours/${data.score.slug_level}/universites` },
        { text: data.score.slug_year, link: `/concours/${data.score.slug_level}/${data.score.slug_university}/year` },
        { text: data.score.slug_subject, link: `/concours/${data.score.slug_level}/${data.score.slug_university}/${data.score.slug_year}/matieres` }
    ];

    const handlleDeleteLastScore = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/concour/delete-last-score/${concour_id}/`);
            setShowDeleteModal(false);
            navigate("/concours/Bac/universites");
        } catch (err) {
            alert("Erreur lors de la suppression du score.");
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <section className="score">
            <HeaderScore breadcrumbs={breadcrumbs}/>

            <InfoScore data={data} handlleDeleteLastScore={handlleDeleteLastScore} 
            scoreNum={data.score.score} 
            score_time_spent={data.score.time_spent}
            lenght_question={data.score.lenght_question}/>
           
            <SubNavbar  data={data} concour_id={concour_id}
                dataScore={data.score}
                user_answers={data.user_answers}
            />

            <DeleteModal
                visible={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Voulez-vous vraiment supprimer ce score ?"
            />
        </section>
    );
};
export default Score;