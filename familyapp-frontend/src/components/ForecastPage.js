import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Typography, Select, MenuItem } from '@material-ui/core';
import { AuthContext } from '../context/authContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ForecastPage = () => {
    const { authState } = useContext(AuthContext);
    const { token } = authState;
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
    const [forecastResult, setForecastResult] = useState([]);

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/families',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setFamilies(response.data);
                setSelectedFamily(response.data[0]?.name);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFamilies();
    }, [token]);

    const handleChangeDate = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleChangeFamily = (event) => {
        setSelectedFamily(event.target.value);
    };

    const handleForecast = async () => {
        const familyId = families.find(family => family.name === selectedFamily)?.id;

        if (familyId) {
            try {
                const response = await axios.post(
                    `http://localhost:8080/api/families/${familyId}/forecast`,
                    { targetDate: selectedDate },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data) {
                    setForecastResult(response.data.map(entry => ({
                        date: entry.date.slice(0, 10),
                        predicted_expense: parseFloat(entry.predicted_expense.toFixed(2))
                    })));
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Paper className="ForecastPage">
            <Select
                value={selectedFamily}
                onChange={handleChangeFamily}
            >
                {families.map((family) => (
                    <MenuItem key={family.id} value={family.name}>
                        {family.name}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                label="Target Date"
                value={selectedDate}
                onChange={handleChangeDate}
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button variant="contained" color="primary" onClick={handleForecast}>
                Forecast
            </Button>
            {forecastResult.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={forecastResult}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="predicted_expense" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
};

export default ForecastPage;
