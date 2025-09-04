import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import LevelsList from './pages/LevelsList/LevelsList';
import Login from './auth/Login';
import Logout from './auth/Logout';
import UniversityList from './pages/UniversityList/UniversityList';
import YearsList from './pages/YearsList/YearsList';
import SubjectsList from './pages/SubjectsList/SubjectsList';
import Quiz from './pages/Quiz/Quiz';
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/concours/niveaux" element={<LevelsList />} />
                    <Route path="/concours/:niveau_slug/universites" element={<UniversityList />} />
                    <Route path="/concours/:niveau_slug/:universite_slug/year" element={<YearsList />} />
                    <Route path="/concours/:niveau_slug/:universite_slug/:year_slug/matieres" element={<SubjectsList/>} />

                </Route>
                {/* rr */}
                
                <Route path="/concours/:niveau_slug/:universite_slug/:year_slug/:subject_slug/concour/" element={<Quiz />} />

                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />

            </Routes>
        </BrowserRouter>
    );
};

export default App;
