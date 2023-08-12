import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import './NavBar.css';
import { SidebarContext } from "../context/SidebarContext";

function getRoleFromToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        return decodedValue && decodedValue.role && decodedValue.role[0] && decodedValue.role[0].authority;
    } catch (error) {
        console.error("Error decoding token", error);
        return null;
    }
}

function NavBar() {
    const [sidebar, setSidebar] = useState(false);
    const { authState: { user, token }, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { setSidebarExpanded } = useContext(SidebarContext);
    const role = getRoleFromToken(token);

    const showSidebar = () => {
        setSidebar(prevState => !prevState);
        if (setSidebarExpanded) {
            setSidebarExpanded(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <div className={sidebar ? 'sidebar-overlay active' : 'sidebar-overlay'} onClick={showSidebar}></div>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                {user && <div className="user-info">Logged in as: {user}</div>}
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <FaTimes onClick={showSidebar} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/home" onClick={showSidebar}>
                            <button className="nav-button">Home</button>
                        </Link>
                        <Link to="/register" onClick={showSidebar}>
                            <button className="nav-button">Register</button>
                        </Link>
                        <Link to="/login" onClick={showSidebar}>
                            <button className="nav-button">Login</button>
                        </Link>
                    </li>

                    {role === 'ADMIN' && <li>
                        <Link to="/admin/familyuserspage" onClick={showSidebar}>
                            <button className="nav-button">Family Users</button>
                        </Link>
                        <Link to="/admin/expenses" onClick={showSidebar}>
                            <button className="nav-button">Expenses</button>
                        </Link>
                        <Link to="/admin/budgets" onClick={showSidebar}>
                            <button className="nav-button">Budgets</button>
                        </Link>
                        <Link to="/admin/forecast" onClick={showSidebar}>
                            <button className="nav-button">Forecast</button>
                        </Link>
                        {/* Poți adăuga și alte rute specifice pentru admini aici */}
                    </li>}

                    {role === 'USER' && <li>
                        <Link to="/user/expenses" onClick={showSidebar}>
                            <button className="nav-button">Expenses</button>
                        </Link>
                        <Link to="/user/budgets" onClick={showSidebar}>
                            <button className="nav-button">Budgets</button>
                        </Link>
                        <Link to="/user/forecast" onClick={showSidebar}>
                            <button className="nav-button">Forecast</button>
                        </Link>
                    </li>}

                    {user && <li><button className="nav-button logout-button" onClick={handleLogout}>Logout</button></li>}
                </ul>
            </nav>
        </>
    );
}

export default NavBar;
