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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import './Graph.css';

const Graph=({allScores,chartData,chartTimeData,chartOptions,chartTimeOptions})=>{
    // Responsive size for graph containers
    const isPhone = window.innerWidth <= 768;
    const graphStyle = isPhone
        ? { width: "80vw", height: "80vw", minHeight: "220px" }
        : { width: "800px", height: "400px" };

    return(
         <div>
            {/* Graphiques content */}
            <h2 className="graph__title">Historique des scores</h2>
            {allScores.length === 0 ? (
                <p>Aucun score disponible pour ce concours.</p>
            ) : (
                <div className="score__graph">
                    <div className="score__graph__score" style={graphStyle}>
                        <Line data={chartData} options={chartOptions} 
                        height={isPhone ? 300 : 400}  
                         width={isPhone ? 300 : 800}   />
                    </div>
                    <div className="score__graph__time" style={graphStyle}>
                        <Line data={chartTimeData} options={chartTimeOptions}
                         height={isPhone ? 300 : 400}  
                         width={isPhone ? 300 : 800}  />
                    </div>
                </div>
            )}
        </div>
    )
}
export default Graph;