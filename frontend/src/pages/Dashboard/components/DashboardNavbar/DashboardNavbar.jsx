import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './DashboardNavbar.css';
import axiosInstance from '../../../../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal'; // Add import

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
    
    // Modified filter options
    const filterOptions = useMemo(() => {
        const options = {
            level: new Set(),
            university: new Set(),
            year: new Set(),
            subject: new Set()
        };
        
        scores?.forEach(score => {
            const subject = score.concours?.subject;
            const year = subject?.year;
            const university = year?.university;
            const level = university?.level;

            if (level?.name) options.level.add(level.name);
            if (university?.name) options.university.add(university.name);
            if (year?.year) options.year.add(Number(year.year)); // Convert to number
            if (subject?.name) options.subject.add(subject.name);
        });

        return {
            level: [...options.level],
            university: [...options.university],
            year: [...options.year].sort((a, b) => b - a), // Sort years in descending order
            subject: [...options.subject]
        };
    }, [scores]);

    // Modified groupedScores
    const groupedScores = useMemo(() => {
        const filtered = scores?.filter(score => {
            const subject = score.concours?.subject;
            const year = subject?.year;
            const university = year?.university;
            const level = university?.level;

            return (!filters.level || level?.name === filters.level) &&
                   (!filters.university || university?.name === filters.university) &&
                   (!filters.year || Number(year?.year) === Number(filters.year)) && // Compare as numbers
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
                date: new Date(score.created_at)
            });
        });

        return groups;
    }, [scores, filters]);

    // Modified chart data preparation
    const chartData = {
        labels: Object.entries(groupedScores).flatMap(([_, data]) => 
            data.map(item => new Date(item.date).toLocaleDateString())
        ).sort((a, b) => new Date(a) - new Date(b)),
        datasets: Object.entries(groupedScores).map(([key, data], index) => ({
            label: key,
            data: [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => item.score),
            borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.5)`,
            tension: 0.1
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
                labels: {
                    boxWidth: 10,
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: 'Progression des scores'
            }
        },
        scales: {
            x: {
                type: 'category',
                display: true,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                display: true,
                title: {
                    display: true,
                    text: 'Score'
                }
            }
        }
    };

    const pageSize = 5;

    const rows = scores?.map((score, idx) => ({
        id: score.id || score.pk || idx, // Ensure each row has a unique id
        subject: score.concours?.subject?.name,
        university: score.concours?.subject?.year?.university?.name,
        year: score.concours?.subject?.year?.year,
        score: score.score,
        time_spent: score.time_spent?.split('.')[0] || '',
        created_at: new Date(score.created_at).toLocaleString()
    })) || [];

    const totalPages = Math.ceil((rows?.length || 0) / pageSize);
    const paginatedRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    // Delete score from backend and update UI
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
            {/* Filters */}
            <div className="dashboard__filters">
                {Object.entries(filterOptions).map(([key, options]) => (
                    <select
                        key={key}
                        value={filters[key]}
                        onChange={(e) => setFilters(prev => ({
                            ...prev, 
                            [key]: key === 'year' ? Number(e.target.value) : e.target.value
                        }))}
                    >
                        <option value="">All {key}s</option>
                        {options.map(option => (
                            <option key={option} value={option}>
                                {key === 'year' ? option : option}
                            </option>
                        ))}
                    </select>
                ))}
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
                    <div className="dashboard__graph" style={{ height: '400px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                )}
                {activeTab === "history" && (
                    <div className="table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>University</th>
                                    <th>Year</th>
                                    <th>Score</th>
                                    <th>Time Spent</th>
                                    <th>Date</th>
                                    <th>Delete</th> {/* New column */}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRows.map((row, idx) => (
                                    <tr key={row.id}>
                                        <td>{row.subject}</td>
                                        <td>{row.university}</td>
                                        <td>{row.year}</td>
                                        <td>{row.score}</td>
                                        <td>{row.time_spent}</td>
                                        <td>{row.created_at}</td>
                                        <td>
                                            <button
                                                className="delete-score-btn"
                                                title="Delete score"
                                                onClick={() => {
                                                    setDeleteRowIdx(idx);
                                                    setShowDeleteModal(true);
                                                }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer',
                                                     fontSize: '1.2em' }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button 
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                Next
                            </button>
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
                )}
            </div>
        </div>
    );
}

export default DashboardNavbar;
