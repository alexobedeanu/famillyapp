import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import './NavBar.css';

function NavBar() {
    const [sidebar, setSidebar] = useState(false);
    const { authState: { user }, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const showSidebar = () => setSidebar(!sidebar);

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <FaTimes onClick={showSidebar} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" onClick={showSidebar}>
                            <button className="nav-button">Register</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" onClick={showSidebar}>
                            <button className="nav-button">Login</button>
                        </Link>
                    </li>
                    {user && <li className="username-display">Logged in as: {user}</li>}
                    {user && <li><button className="nav-button logout-button" onClick={handleLogout}>Logout</button></li>}
                </ul>
            </nav>
        </>
    );
}

export default NavBar;
