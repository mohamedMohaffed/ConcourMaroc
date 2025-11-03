import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { parseTimeToSeconds, formatSecondsToHMS } from '../timeUtils';
import './GraphPanel.css'

const GraphPanel = ({ groupedScores = {}, chartMetric, setChartMetric }) => {
    const chartData = useMemo(() => {
        const allDatesSet = new Set();
        const datasets = Object.entries(groupedScores).map(([key, data], index) => {
            const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
            const points = sorted.map(item => {
                const dateStr = new Date(item.date).toLocaleDateString();
                allDatesSet.add(dateStr);
                if (chartMetric === 'score') {
                    return { x: dateStr, y: item.score, time_spent: item.time_spent, score: item.score };
                } else {
                    return { x: dateStr, y: parseTimeToSeconds(item.time_spent), time_spent: item.time_spent, score: item.score };
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
        return { labels, datasets };
    }, [groupedScores, chartMetric]);

    const chartOptions = useMemo(() => {
        const shownKeys = new Set();
        return {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 10, bottom: 36 } },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true } },
                title: { display: true, text: chartMetric === 'score' ? 'Progression des scores' : 'Time spent over dates' },
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
                        beforeBody: () => shownKeys.clear(),
                        title: (items) => (items && items.length ? (items[0].dataset?.label || items[0].label || '') : ''),
                        label: (context) => {
                            const raw = context.raw || {};
                            if (chartMetric === 'score') {
                                const score = raw.y ?? context.parsed?.y ?? context.formattedValue;
                                const time = raw.time_spent ?? '';
                                return time ? `Score: ${score} — Time: ${time}` : `Score: ${score}`;
                            } else {
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
                x: { type: 'category', display: true, ticks: { padding: 12 }, grid: { drawOnChartArea: true, drawTicks: true, offset: false }, title: { display: true, text: 'Date' } },
                y: { beginAtZero: true, display: true, title: { display: true, text: chartMetric === 'score' ? 'Score' : 'Time (seconds)' } }
            }
        };
    }, [chartMetric]);

    return (
        <div className="dashboard__graph">
            <div className="dashboard__graph-buttons">
                <button
                    onClick={() => setChartMetric('score')}
                    className={`dashboard__graph-button${chartMetric === 'score' ? ' active' : ''}`}
                >
                    Score
                </button>
                <button
                    onClick={() => setChartMetric('time')}
                    className={`dashboard__graph-button${chartMetric === 'time' ? ' active' : ''}`}
                >
                    Time Spent
                </button>
            </div>

            <div className="dashboard__graph-chart">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default GraphPanel;
