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
        <motion.section 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay:0.2}}
            className="score"
        >
            <HeaderScore data={data}/>

            <InfoScore data={data} handlleDeleteLastScore={handlleDeleteLastScore} />

            {/* NAVBAR TABS */}
           
            <SubNavbar  data={data} concour_id={concour_id}/>

            <DeleteModal
                visible={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Voulez-vous vraiment supprimer ce score ?"
            />
        </motion.section>
    );
};

export default Score;