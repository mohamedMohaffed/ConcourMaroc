import { useState, useEffect } from 'react';

import axiosInstance from '../../../../utils/axiosInstance';
import renderQuizSummary from './renderQuizSummary/renderQuizSummary';
import Graph from "./components/Graph/Graph";
import './SubNavbar.css';


const SubNavbar=({data,concour_id})=>{
    const [activeTab, setActiveTab] = useState("useranser"); 
    const [allScores, setAllScores] = useState([]);

    const [quizData, setQuizData] = useState(null);

    // Fetch quiz data using slugs from score
    useEffect(() => {
        if (data && data.score) {
            const { slug_level, slug_university, slug_year, slug_subject } = data.score;
            if (slug_level && slug_university && slug_year && slug_subject) {
                const url = `/concour/${slug_level}/${slug_university}/${slug_year}/${slug_subject}/concour/`;
                axiosInstance.get(url).then(res => {
                    setQuizData(res.data);
                });
            }
        }
    }, [data]);

    useEffect(() => {
        if (concour_id) {
            axiosInstance.get(`/concour/all-scores/${concour_id}/`).then(res => {
                setAllScores(res.data);
            });
        }
    }, [concour_id]);
    // Helper: Render quiz summary
  

    // Prepare chart data (format dates for x-axis labels)
    const chartLabels = allScores.map(s => {
        const d = new Date(s.created_at);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    const scoreData = allScores.map(s => s.score);
    const timeData = allScores.map(s => {
        if (typeof s.time_spent === "string" && s.time_spent.includes(":")) {
            const parts = s.time_spent.split(":").map(Number);
            // Convert to total seconds
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return Number(s.time_spent);
    });

    // Highlight last point and make it bigger
    const scorePointColors = scoreData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 'orange' : 'rgb(75, 192, 192)'
    );
    const timePointColors = timeData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 'orange' : 'rgb(255, 99, 132)'
    );
    const scorePointRadius = scoreData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 6 : 5
    );
    const scorePointHoverRadius = scoreData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 8 : 7
    );
    const timePointRadius = timeData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 6 : 5
    );
    const timePointHoverRadius = timeData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 8 : 7
    );
    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Score',
                data: scoreData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointBackgroundColor: scorePointColors,
                pointRadius: scorePointRadius,
                pointHoverRadius: scorePointHoverRadius,
            },
        ],
    };

    const chartTimeData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Temps Passé (secondes)',
                data: timeData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                pointBackgroundColor: timePointColors,
                pointRadius: timePointRadius,
                pointHoverRadius: timePointHoverRadius,
            },
        ],
    };

     const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: { mode: 'index', intersect: false },
            title: {
                display: true,
                text: 'Suivi du score',
                font: { size: 18 }
            }
        },
        scales: {
            x: {
                type: 'category',
                title: { display: true, text: 'Date' },
            },
            y: {
                title: { display: true, text: 'Score' },
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
        },
    };

    // Options for time spent chart
    const chartTimeOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: 'Temps passé',
                font: { size: 18 }
            },
            tooltip: {
                ...chartOptions.plugins.tooltip,
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        return `Temps Passé : ${formatSecondsToHMS(value)}`;
                    }
                }
            }
        },
        scales: {
            ...chartOptions.scales,
            y: {
                title: { display: true, text: 'Temps Passé (hh:mm:ss)' },
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatSecondsToHMS(value);
                    }
                },
            },
        },
    };

    // Helper to format seconds to hh:mm:ss
function formatSecondsToHMS(seconds) {
    seconds = Math.round(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}
    
    return(

         <div>
            <h1 className="score__detail__title">Voir les détails</h1>
            <div className="score__tabs-navbar">
                
                <button
                    className={activeTab === "useranser" ? "score__tab--active" : "score__tab"}
                    onClick={() => setActiveTab("useranser")}
                >
                    Mes Choix
                </button>
             
                <button
                    className={activeTab === "graph" ? "score__tab--active" : "score__tab"}
                    onClick={() => setActiveTab("graph")}
                >
                    Graphiques
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="score__tab-content">
                {activeTab === "useranser" && (
                    <div>
                        {renderQuizSummary({quizData,data})}
                    </div>
                )}
                
                {activeTab === "graph" && (
                   <Graph allScores={allScores} chartData={chartData} chartTimeData={chartTimeData} 
                   chartOptions={chartOptions} chartTimeOptions={chartTimeOptions}/>
                )}
            </div>
            </div>
    )

}
export default SubNavbar;