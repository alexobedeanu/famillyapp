import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import PostLogin from './components/PostLogin';
import {AuthProvider} from './context/authContext';

function App() {
    return (
        <AuthProvider>
        <Router>
            <NavBar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/postlogin" element={<PostLogin />} />
            </Routes>
        </Router>
        </AuthProvider>

    );
}

export default App;
