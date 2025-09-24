import { Outlet} from "react-router-dom";
import Navbar from '../components/Navbar/Navbar';
import './Layout.css';

const Layout =()=>{

    return(
        <div className="layout">

        <aside className="layout__navbar">
            <div style={{ position: "fixed", top: 0, left: 0 }}>
             <Navbar />
            </div>

        </aside>
        <main className="layout__main">
            <Outlet />
        </main>
        <aside className="layout_ads">
                <p>ads here</p>
        </aside>

        </div>
    )
}

export default Layout;