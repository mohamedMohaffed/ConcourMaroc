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

    // new: show score or time graph
    const [chartMetric, setChartMetric] = useState('score'); // 'score' | 'time'

    // helper: parse "HH:MM:SS" (or "MM:SS") to seconds
    const parseTimeToSeconds = (hms) => {
        if (!hms) return 0;
        const parts = hms.split(':').map(p => Number(p || 0));
        // parts could be [HH,MM,SS] or [MM,SS]
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            return parts[0];
        }
        return 0;
    };

    const formatSecondsToHMS = (sec) => {
        if (sec == null || Number.isNaN(sec)) return '00:00:00';
        sec = Math.floor(Number(sec));
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    // Filter options for subjects, universities, years, and levels
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

    // Re-added groupedScores (was missing) — groups points with date and time_spent
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

    // Modified chart data preparation to include time_spent per point and support both metrics
    const chartData = useMemo(() => {
        const allDatesSet = new Set();
        const datasets = Object.entries(groupedScores).map(([key, data], index) => {
            const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
            const points = sorted.map(item => {
                const dateStr = new Date(item.date).toLocaleDateString();
                allDatesSet.add(dateStr);
                if (chartMetric === 'score') {
                    return {
                        x: dateStr,
                        y: item.score,
                        time_spent: item.time_spent,
                        score: item.score // keep score present for tooltips too
                    };
                } else {
                    // time metric: y is seconds, keep original time_spent string and score for tooltip
                    return {
                        x: dateStr,
                        y: parseTimeToSeconds(item.time_spent),
                        time_spent: item.time_spent,
                        score: item.score
                    };
                }
            });

            return {
                label: key,
                data: points,
                borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
                backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.5)`,
                tension: 0.1
            };
        });

        const labels = [...allDatesSet].sort((a, b) => new Date(a) - new Date(b));

        return {
            labels,
            datasets
        };
    }, [groupedScores, chartMetric]);

    const chartOptions = useMemo(() => {
        const shownKeys = new Set();
        return {
            responsive: true,
            maintainAspectRatio: false,
            // add extra padding so chart line / grid isn't too close to the date labels
            layout: {
                padding: {
                    top: 10,
                    bottom: 36
                }
            },
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
                    text: chartMetric === 'score' ? 'Progression des scores' : 'Time spent over dates'
                },
                tooltip: {
                    mode: 'nearest',
                    intersect: true,
                    filter: (tooltipItem) => {
                        const ds = tooltipItem.datasetIndex;
                        const x = tooltipItem.label || (tooltipItem.parsed && tooltipItem.parsed.x) || tooltipItem.x || '';
                        const key = `${ds}::${x}`;
                        if (shownKeys.has(key)) return false;
                        shownKeys.add(key);
                        return true;
                    },
                    callbacks: {
                        beforeBody: () => {
                            shownKeys.clear();
                        },
                        title: (items) => {
                            if (!items || !items.length) return '';
                            return items[0].dataset?.label || items[0].label || '';
                        },
                        label: (context) => {
                            const raw = context.raw || {};
                            if (chartMetric === 'score') {
                                const score = raw.y ?? context.parsed?.y ?? context.formattedValue;
                                const time = raw.time_spent ?? '';
                                return time ? `Score: ${score} — Time: ${time}` : `Score: ${score}`;
                            } else {
                                // time chart: show formatted HH:MM:SS and include the score
                                const secs = raw.y ?? context.parsed?.y ?? 0;
                                const timeStr = raw.time_spent ?? formatSecondsToHMS(secs);
                                const score = raw.score ?? '';
                                return score ? `Time: ${timeStr} — Score: ${score}` : `Time: ${timeStr}`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    display: true,
                    // extra space between ticks and chart area/labels
                    ticks: {
                        padding: 12
                    },
                    // avoid drawing grid lines that overlap the tick labels area
                    grid: {
                        drawOnChartArea: true,
                        drawTicks: true,
                        offset: false
                    },
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
                        text: chartMetric === 'score' ? 'Score' : 'Time (seconds)'
                    }
                }
            }
        };
    }, [chartData, chartMetric]);

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
                    <div className="dashboard__graph" style={{ height: '500px' }}>
                        {/* metric toggle */}
                        <div style={{ marginBottom: 8 }}>
                            <button
                                onClick={() => setChartMetric('score')}
                                style={{
                                    marginRight: 8,
                                    padding: '6px 10px',
                                    background: chartMetric === 'score' ? '#2c7be5' : '#eee',
                                    color: chartMetric === 'score' ? '#fff' : '#000',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                Score
                            </button>
                            <button
                                onClick={() => setChartMetric('time')}
                                style={{
                                    padding: '6px 10px',
                                    background: chartMetric === 'time' ? '#2c7be5' : '#eee',
                                    color: chartMetric === 'time' ? '#fff' : '#000',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                Time Spent
                            </button>
                        </div>

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
