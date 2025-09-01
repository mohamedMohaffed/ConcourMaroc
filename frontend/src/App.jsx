import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import LevelsList from './pages/LevelsList/LevelsList';
import Login from './auth/Login';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/concours/niveaux" element={<LevelsList />} />
                </Route>
                <Route path="/login" element={<Login />} />

            </Routes>
        </BrowserRouter>
    );
};

export default App;
