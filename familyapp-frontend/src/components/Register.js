import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        username: '',
        role: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8080/api/users', formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="register-container">
        <form onSubmit={handleSubmit}>
            <label>
                ID:
                <input type="text" name="id" onChange={handleChange} />
            </label>
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
            <input type="submit" value="Register" />
        </form>
        </div>
    );
}

export default Register;
