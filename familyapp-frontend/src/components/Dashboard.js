import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';  // Puteți folosi această bibliotecă pentru a decodifica tokenul JWT
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
    const { authState } = useContext(AuthContext);
    const { token } = authState;

    const [dashboardData, setDashboardData] = useState({
        totalIncome: 0,
        totalExpense: 0,
        familyBudget: 0
    });

    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            try {
                // Decodarea tokenului JWT pentru a obține username-ul
                const decodedToken = jwt_decode(token);
                const currentUsername = decodedToken.sub;

                const response = await axios.get(`http://localhost:8080/api/users`, { headers });
                const currentUser = response.data.find(user => user.username === currentUsername);
                setCurrentUserId(currentUser.id);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCurrentUser();
    }, [token]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUserId) return; // Dacă nu avem un ID de user, nu continuăm

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            try {
                const response = await axios.get(`http://localhost:8080/api/dashboard/${currentUserId}`, { headers });
                setDashboardData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDashboardData();
    }, [token, currentUserId]);

    return (
        <div>
            <h1>Dashboard</h1>
            <p><strong>Income:</strong> ${dashboardData.totalIncome.toFixed(2)}</p>
            <p><strong>Expenses:</strong> ${dashboardData.totalExpense.toFixed(2)}</p>
            <p><strong>Family Budget:</strong> ${dashboardData.familyBudget.toFixed(2)}</p>
        </div>
    );
};

export default Dashboard;
