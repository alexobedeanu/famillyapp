import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                username,
                password,
            });

            if (response.data) {
                const token = response.data;
                login(token); // Stocați token-ul în contextul de autentificare
                navigate('/home'); // Navigați către pagina principală
            }
        } catch (error) {
            console.error('Failed to login:', error);
            if (error.response && error.response.data && error.response.data.message === 'Bad credentials') {
                toast.error('Bad credentials, please try again');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username/Email:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default Login;
