import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { AuthContext } from '../context/authContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import './ForecastPage.css';
import * as XLSX from 'xlsx';

const ForecastPage = () => {
    const { authState } = useContext(AuthContext);
    const { token } = authState;
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
    const [forecastResult, setForecastResult] = useState([]);
    const [viewType, setViewType] = useState('lineChart'); // 'lineChart', 'table', 'barChart'

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
    const exportToExcel = () => {
        // Calcularea cheltuielilor totale și a mediei
        const totalExpense = forecastResult.reduce((acc, curr) => acc + curr.predicted_expense, 0);
        const averageExpense = totalExpense / forecastResult.length;

        // Crearea unui array nou care include și totalul și media
        const dataWithTotalAndAverage = [
            ...forecastResult,
            { date: 'Total', predicted_expense: totalExpense },
            { date: 'Media zilnică', predicted_expense: averageExpense }
        ];

        // Crearea worksheet-ului și workbook-ului
        const ws = XLSX.utils.json_to_sheet(dataWithTotalAndAverage);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Forecast");

        // Salvarea ca fișier .xlsx
        XLSX.writeFile(wb, "forecast.xlsx");
    };

    const handleChangeDate = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleChangeFamily = (event) => {
        setSelectedFamily(event.target.value);
    };

    const handleChangeViewType = (event) => {
        setViewType(event.target.value);
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

    const renderLineChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastResult}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={entry => entry.predicted_expense} name="Cheltuială prezisă" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );

    const renderTable = () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell align="right">Cheltuială prezisă</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {forecastResult.map((row) => (
                    <TableRow key={row.date}>
                        <TableCell component="th" scope="row">
                            {row.date}
                        </TableCell>
                        <TableCell align="right">{row.predicted_expense}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={forecastResult}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={entry => entry.predicted_expense} name="Cheltuială prezisă" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
    const renderAreaChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastResult}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey={entry => entry.predicted_expense} name="Cheltuială prezisă" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    );


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
            <Select value={viewType} onChange={handleChangeViewType}>
                <MenuItem value="lineChart">Grafic de Linie</MenuItem>
                <MenuItem value="table">Tabel</MenuItem>
                <MenuItem value="barChart">Grafic cu Bare</MenuItem>
                <MenuItem value="areaChart">Grafic cu Arie</MenuItem>
            </Select>
            {viewType === 'lineChart' && renderLineChart()}
            {viewType === 'table' && renderTable()}
            {viewType === 'barChart' && renderBarChart()}
            {viewType === 'areaChart' && renderAreaChart()}
            <Button variant="contained" color="secondary" onClick={exportToExcel}>
                Export to Excel
            </Button>
        </Paper>
    );
};

export default ForecastPage;
