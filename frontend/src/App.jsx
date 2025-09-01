import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import LevelsList from './pages/LevelsList/LevelsList';
import Login from './auth/Login';
import UniversityList from './pages/UniversityList/UniversityList';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/concours/niveaux" element={<LevelsList />} />
                    <Route path="/concours/:niveau_slug/universites" element={<UniversityList />} />

                </Route>
                <Route path="/login" element={<Login />} />

            </Routes>
        </BrowserRouter>
    );
};

export default App;
