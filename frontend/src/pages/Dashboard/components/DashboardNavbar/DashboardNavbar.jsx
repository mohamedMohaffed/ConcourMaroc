import { useState, useMemo } from 'react';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import './DashboardNavbar.css';
import axiosInstance from '../../../../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal'; // Add import
import Filters from '../../components/Filters';
import GraphPanel from '../../components/GraphPanel';
import HistoryTable from '../../components/HistoryTable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardNavbar = ({ scores: initialScores }) => {
    const [activeTab, setActiveTab] = useState("graph");
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState({
        level: '',
        university: '',
        year: '',
        subject: ''
    });
    const [scores, setScores] = useState(initialScores);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRowIdx, setDeleteRowIdx] = useState(null);
    const [chartMetric, setChartMetric] = useState('score'); 

    const filterOptions = useMemo(() => {
        const subjects = new Set();
        const universities = new Set();
        const years = new Set();
        const levels = new Set();

        scores.forEach(score => {
            const subject = score.concours?.subject;
            const year = subject?.year;
            const university = year?.university;
            const level = university?.level;

            if (subject?.name) subjects.add(subject.name);
            if (university?.name) universities.add(university.name);
            if (year?.year) years.add(year.year);
            if (level?.name) levels.add(level.name);
        });

        return {
            subject: [...subjects],
            university: [...universities],
            year: [...years].sort((a, b) => b - a),
            level: [...levels]
        };
    }, [scores]);

    const groupedScores = useMemo(() => {
        const filtered = scores?.filter(score => {
            const subject = score.concours?.subject;
            const year = subject?.year;
            const university = year?.university;
            const level = university?.level;

            return (!filters.level || level?.name === filters.level) &&
                   (!filters.university || university?.name === filters.university) &&
                   (!filters.year || Number(year?.year) === Number(filters.year)) &&
                   (!filters.subject || subject?.name === filters.subject);
        });

        const groups = {};
        filtered?.forEach(score => {
            const key = `${score.concours?.subject?.year?.university?.level?.name}-${score.concours?.subject?.year?.university?.name}-${score.concours?.subject?.name}-${score.concours?.subject?.year?.year}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push({
                score: score.score,
                date: new Date(score.created_at),
                time_spent: score.time_spent?.split?.('.') ? score.time_spent.split('.')[0] : (score.time_spent || '')
            });
        });

        return groups;
    }, [scores, filters]);

    const pageSize = 5;

    const rows = scores?.map((score, idx) => ({
        id: score.id || score.pk || idx, 
        subject: score.concours?.subject?.name,
        university: score.concours?.subject?.year?.university?.name,
        year: score.concours?.subject?.year?.year,
        score: score.score,
        time_spent: score.time_spent?.split('.')[0] || '',
        created_at: new Date(score.created_at).toLocaleString()
    })) || [];

    const totalPages = Math.ceil((rows?.length || 0) / pageSize);
    const paginatedRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handleDeleteScore = async () => {
        const scoreId = paginatedRows[deleteRowIdx].id;
        try {
            await axiosInstance.delete(`concour/score/${scoreId}/`);
            setScores(prev => prev.filter(s => (s.id || s.pk) !== scoreId));
        } catch (err) {
            alert("Failed to delete score.");
        } finally {
            setShowDeleteModal(false);
            setDeleteRowIdx(null);
        }
    };

    return (
        <div>
            <div className="dashboard__filters">
                <Filters
                    filterOptions={filterOptions}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            <div className="dashboard__tabs-navbar">
                <div className={activeTab === "graph" ? "dashboard__tab--active" : "dashboard__tab"}
                    onClick={() => setActiveTab("graph")}
                >
                    Vue d'ensemble
                </div>
                <div
                    className={activeTab === "history" ? "dashboard__tab--active" : "dashboard__tab"}
                    onClick={() => setActiveTab("history")}
                >
                    History
                </div>
            </div>

            <div className="dashboard__tab-content">
                {activeTab === "graph" && (
                    <GraphPanel
                        groupedScores={groupedScores}
                        chartMetric={chartMetric}
                        setChartMetric={setChartMetric}
                    />
                )}
                {activeTab === "history" && (
                    <HistoryTable
                        rows={paginatedRows}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        onRequestDelete={(idx) => {
                            setDeleteRowIdx(idx);
                            setShowDeleteModal(true);
                        }}
                    />
                )}
            </div>

            <DeleteModal
                visible={showDeleteModal}
                onConfirm={handleDeleteScore}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setDeleteRowIdx(null);
                }}
                message="Are you sure you want to delete this score?"
                buttonColor="#e74c3c"
                confirmText="Delete"
            />
        </div>
    );
}

export default DashboardNavbar;
