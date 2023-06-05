import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Register() {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        username: '',
        role: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null); // New state for handling error
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirm password must match.');
            return;
        }

        axios
            .post('http://localhost:8080/api/users', formData)
            .then((response) => {
                console.log(response.data);
                toast.success('Registration successful!')
                navigate('/login'); // Navigate to login page on successful registration
            })
            .catch((error) => {
                console.error('There was an error!', error);
                if (error.response.data.message.includes('users_username_key')) {
                    setError('This username is already in use. Please use a different username.');
                } else if (error.response.data.message.includes('users_email_key')) {
                    setError('This email is already in use. Please use a different email.');
                } else {
                    setError(error.response.data.message);
                }
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" name="email" onChange={handleChange} />
                </label>
                <label>
                    Username:
                    <input type="text" name="username" onChange={handleChange} />
                </label>
                <label>
                    Role:
                    <input type="text" name="role" onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" onChange={handleChange} />
                </label>
                <label>
                    Confirm Password:
                    <input type="password" name="confirmPassword" onChange={handleChange} />
                </label>
                {error && <p>{error}</p>}
                <input type="submit" value="Register" />
            </form>
        </div>
    );
}

export default Register;
