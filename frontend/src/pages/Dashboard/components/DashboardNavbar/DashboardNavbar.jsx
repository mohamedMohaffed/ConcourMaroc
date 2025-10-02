import { useState } from 'react';
import './DashboardNavbar.css';

const DashboardNavbar = ({ scores }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    const rows = scores?.map(score => ({
        subject: score.concours?.subject?.name,
        university: score.concours?.subject?.year?.university?.name,
        year: score.concours?.subject?.year?.year,
        score: score.score,
        time_spent: score.time_spent?.split('.')[0] || '',
        created_at: new Date(score.created_at).toLocaleString()
    })) || [];

    const totalPages = Math.ceil((rows?.length || 0) / pageSize);
    const paginatedRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    return (
        <div>
            <h1 className="dashboard__title">Tableau de bord</h1>
            <div className="dashboard__tabs-navbar">
                <button
                    className={activeTab === "overview" ? "dashboard__tab--active" : "dashboard__tab"}
                    onClick={() => setActiveTab("overview")}
                >
                    Vue d'ensemble
                </button>
                <button
                    className={activeTab === "history" ? "dashboard__tab--active" : "dashboard__tab"}
                    onClick={() => setActiveTab("history")}
                >
                    History
                </button>
            </div>

            <div className="dashboard__tab-content">
                {activeTab === "overview" && (
                    <div>Vue d'ensemble du tableau de bord</div>
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
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRows.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.subject}</td>
                                        <td>{row.university}</td>
                                        <td>{row.year}</td>
                                        <td>{row.score}</td>
                                        <td>{row.time_spent}</td>
                                        <td>{row.created_at}</td>
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
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardNavbar;
