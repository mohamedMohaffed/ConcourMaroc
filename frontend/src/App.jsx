import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import LevelsList from './pages/LevelsList/LevelsList';
import Login from './auth/Login';
import Logout from './auth/Logout';
import UniversityList from './pages/UniversityList/UniversityList';
import YearsList from './pages/YearsList/YearsList';
import SubjectsList from './pages/SubjectsList/SubjectsList';
import Quiz from './pages/Quiz/Quiz';
import Score from './pages/Score/Score';
import Dashboard from './pages/DashBoard/DashBoard';
import Correction from './pages/Correction/Correction';
import PracticeList from './pages/PracticeList/PracticeList';
import PracticeQuiz from './pages/PracticeQuiz/PracticeQuiz';
import LearnQuiz from './pages/LearnQuiz/LearnQuiz';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {/* <Route path="/concours/niveaux" element={<LevelsList />} /> */}
                    <Route path="/concours/:niveau_slug/universites" element={<UniversityList />} />
                    <Route path="/concours/:niveau_slug/:universite_slug/year" element={<YearsList />} />
                    <Route path="/concours/:niveau_slug/:universite_slug/:year_slug/matieres" 
                    element={<SubjectsList/>} />

                    <Route path="/concours/:niveau_slug/:universite_slug/:year_slug/:subject_slug/correction-concour/" 
                    element={<Correction/>} />
                    <Route path="/concours/resultat/:concour_id/"  element={<Score/>}/>
                    <Route path="/tableau-de-bord" element={<Dashboard />} />
                    <Route path="/pratique" element={<PracticeList />} /> 

                </Route>
                {/* rr */}
                
                <Route path="/concours/:niveau_slug/:universite_slug/:year_slug/:subject_slug/concour/" element={<LearnQuiz />} />
                <Route path="/pratique/:concours_slug" element={<PracticeQuiz />} />

                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />

            </Routes>
        </BrowserRouter>
    );
};

export default App;
