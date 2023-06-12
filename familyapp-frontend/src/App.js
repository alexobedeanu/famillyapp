// App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import PostLogin from './components/PostLogin';
import { AuthProvider } from './context/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import {SidebarContext} from "./context/SidebarContext";
import React, { useState } from 'react';
import ExpensesTable from "./components/ExpensesTable";
import ExpensesPage from "./components/ExpensesPage";
import BudgetsTable from "./components/BudgetsTable";
import ForecastPage from "./components/ForecastPage";

function App() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
    return (
        <SidebarContext.Provider value={{sidebar, showSidebar}}>
            <AuthProvider>
                <Router>
                    <ToastContainer />
                    <NavBar />
                    <div className={sidebar ? 'main-content active' : 'main-content'}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/home" element={<PostLogin />} />
                            <Route path="/expenses" element={<ExpensesPage />} />
                            <Route path="/budgets" element={<BudgetsTable />} />
                            <Route path="/forecast" element={<ForecastPage />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </SidebarContext.Provider>
    );
}

export default App;
