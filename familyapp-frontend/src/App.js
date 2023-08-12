import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext, useState } from 'react';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import PostLogin from './components/PostLogin';
import { AuthContext } from './context/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { SidebarContext } from "./context/SidebarContext";
import ExpensesPage from "./components/ExpensesPage";
import BudgetsTable from "./components/BudgetsTable";
import ForecastPage from "./components/ForecastPage";
import FamilyUsersPage from "./components/FamilyUsersPage";

function AdminRoutes() {
    return (
        <Routes>
            <Route path="/familyuserspage" element={<FamilyUsersPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/budgets" element={<BudgetsTable />} />
            <Route path="/forecast" element={<ForecastPage />} />
            {/* ... alte rute specifice pentru admini */}
        </Routes>
    );
}

function UserRoutes() {
    return (
        <Routes>
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/budgets" element={<BudgetsTable />} />
            <Route path="/forecast" element={<ForecastPage />} />
            {/* ... alte rute specifice pentru utilizatori */}
        </Routes>
    );
}
function getRoleFromToken(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const payload = JSON.parse(window.atob(base64));
        const rolesArray = payload.role || [];
        if (rolesArray.some(roleObj => roleObj.authority === 'ADMIN')) {
            // print the role object
            console.log(rolesArray.find(roleObj => roleObj.authority === 'ADMIN'));
            return 'ADMIN';
        }
        return 'USER'; // presupunând că toți ceilalți sunt utilizatori
    } catch (e) {
        console.error("Error decoding token:", e);
        return null;
    }
}

function App() {
    const { authState: { token } } = useContext(AuthContext);
    const role = getRoleFromToken(token);
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <SidebarContext.Provider value={{ sidebar, showSidebar }}>
            <Router>
                <ToastContainer />
                <NavBar />
                <div className={sidebar ? 'main-content active' : 'main-content'}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<PostLogin />} />

                        {/* Verifică rolul și decide ce rute să încarce */}
                        {role === 'ADMIN' && <Route path="admin/*" element={<AdminRoutes />} />}
                        {role === 'USER' && <Route path="user/*" element={<UserRoutes />} />}

                    </Routes>
                </div>
            </Router>
        </SidebarContext.Provider>
    );
}

export default App;
