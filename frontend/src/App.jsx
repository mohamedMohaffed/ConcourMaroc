import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading/Loading";

import Layout from './Layout/Layout'; 
import UniversityList from './pages/UniversityList/UniversityList';
import YearsList from './pages/YearsList/YearsList';
import SubjectsList from './pages/SubjectsList/SubjectsList';
const Login = lazy(() => import('./auth/Login/Login'));
const Register = lazy(() => import('./auth/Register/Register'));
const Logout = lazy(() => import('./auth/Logout/Logout'));
const Score = lazy(() => import('./pages/Score/Score'));
const Dashboard = lazy(() => import('./pages/DashBoard/DashBoard'));
const Correction = lazy(() => import('./pages/Correction/Correction'));
const PracticeList = lazy(() => import('./pages/PracticeList/PracticeList'));
const PracticeQuiz = lazy(() => import('./pages/PracticeQuiz/PracticeQuiz'));
const LearnQuiz = lazy(() => import('./pages/LearnQuiz/LearnQuiz'));
const EmailVerification = lazy(() => import('./auth/EmailVerification/EmailVerification'));
const ForgotPassword = lazy(() => import('./auth/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./auth/ResetPassword/ResetPassword'));

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/concours/Bac/universites" element={<UniversityList />} />
                    <Route path="/concours/Bac/:universite_slug/year" element={<YearsList />} />
                    <Route path="/concours/Bac/:universite_slug/:year_slug/matieres" element={<SubjectsList/>} />
                </Route>
            </Routes>
            <Suspense
                fallback={null}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/concours/Bac/:universite_slug/:year_slug/:subject_slug/correction-concour/" 
                            element={<Correction/>} />
                        <Route path="/concours/resultat/:concour_id/"  element={<Score/>}/>
                        <Route path="/tableau-de-bord" element={<Dashboard />} />
                        <Route path="/pratique" element={<PracticeList />} /> 
                    </Route>
                    {/* rr */}
                    <Route path="/concours/Bac/:universite_slug/:year_slug/:subject_slug/concour/" element={<LearnQuiz />} />
                    <Route path="/pratique/:concours_slug" element={<PracticeQuiz />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register/>}/>
                    <Route path="/deconnexion" element={<Logout />} />
                    <Route path="/verifier-email/:uid/:token" element={<EmailVerification />} />
                    <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                    <Route path="/reinitialiser-mot-de-passe/:uid/:token" element={<ResetPassword />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
