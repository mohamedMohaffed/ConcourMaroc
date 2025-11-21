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
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
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
                    {/* Lazy routes inside Suspense */}
                    <Route
                        path="/concours/Bac/:universite_slug/:year_slug/:subject_slug/correction-concour/"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Correction />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/concours/resultat/:concour_id/"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Score />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/tableau-de-bord"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Dashboard />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/pratique"
                        element={
                            <Suspense fallback={<Loading />}>
                                <PracticeList />
                            </Suspense>
                        }
                    />
                </Route>
                {/* Lazy routes outside Layout */}
                <Route
                    path="/concours/Bac/:universite_slug/:year_slug/:subject_slug/concour/"
                    element={
                        <Suspense fallback={<Loading />}>
                            <LearnQuiz />
                        </Suspense>
                    }
                />
                <Route
                    path="/pratique/:concours_slug"
                    element={
                        <Suspense fallback={<Loading />}>
                            <PracticeQuiz />
                        </Suspense>
                    }
                />
                <Route
                    path="/connexion"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Login />
                        </Suspense>
                    }
                />
                <Route
                    path="/inscription"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Register />
                        </Suspense>
                    }
                />
                <Route
                    path="/deconnexion"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Logout />
                        </Suspense>
                    }
                />
                <Route
                    path="/verifier-email/:uid/:token"
                    element={
                        <Suspense fallback={<Loading />}>
                            <EmailVerification />
                        </Suspense>
                    }
                />
                <Route
                    path="/mot-de-passe-oublie"
                    element={
                        <Suspense fallback={<Loading />}>
                            <ForgotPassword />
                        </Suspense>
                    }
                />
                <Route
                    path="/reinitialiser-mot-de-passe/:uid/:token"
                    element={
                        <Suspense fallback={<Loading />}>
                            <ResetPassword />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
