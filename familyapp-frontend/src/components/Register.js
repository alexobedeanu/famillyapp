import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        username: '',
        role: 'USER',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({ text: "", class: "" });
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");

        if (strongRegex.test(password)) {
            strength = 100;
        } else if (mediumRegex.test(password)) {
            strength = 66;
        } else {
            strength = 33;
        }

        setProgress(strength);
    };



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'password') {
            evaluatePasswordStrength(e.target.value);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
            toast.error('All fields must be filled out.', {position: "top-center", type: "error"});
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password and confirm password must match.', {position: "top-center", type: "error"});
            return;
        }

        axios
            .post('http://localhost:8080/api/users', formData)
            .then((response) => {
                console.log(response.data);
                toast.success('Registration successful!', {position: "top-center"});
                navigate('/login');
            })
            .catch((error) => {
                console.error('There was an error!', error);
                if (error.response.data.message.includes('Username already in use')) {
                    toast.error('This username is already in use. Please use a different username.', {position: "top-center", type: "warning"});
                } else if (error.response.data.message.includes('E-mail already in use')) {
                    toast.error('This email is already in use. Please use a different email.', {position: "top-center", type: "warning"});
                } else {
                    toast.error(error.response.data.message, {position: "top-center"});
                }
            });
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
                    Password:
                    <input type="password" name="password" onChange={handleChange} />
                    <span className={passwordStrength.class}>{passwordStrength.text}</span>
                </label>
                <div className="progress-bar">
                    <div className={`progress-bar-fill ${progress === 100 ? 'strong' : progress === 66 ? 'medium' : 'weak'}`} style={{width: `${progress}%`}}></div>
                </div>
                <label>
                    Confirm Password:
                    <input type="password" name="confirmPassword" onChange={handleChange} />
                </label>
                <input type="submit" value="Register" />
            </form>
            <ToastContainer position="top-center"/>

        </div>
    );
}

export default Register;
