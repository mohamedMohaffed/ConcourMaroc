import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const HistoryTable = ({ rows = [], currentPage = 0, setCurrentPage, totalPages = 1, onRequestDelete }) => {
    return (
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
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
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
                                    onClick={() => onRequestDelete(idx)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>Previous</button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage >= totalPages - 1}>Next</button>
            </div>
        </div>
    );
};

export default HistoryTable;
