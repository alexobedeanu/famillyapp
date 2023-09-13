import React, { useEffect, useState, useContext } from 'react';
import './IncomesTable.css';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import './IncomesTable.css';

const IncomesTable = () => {
    const [incomes, setIncomes] = useState([]);
    const { authState } = useContext(AuthContext);
    const { token } = authState;
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [addIncomeForm, setAddIncomeForm] = useState({
        description: '',
        amount: '',
        date: '',
        userId: '',
        categoryId: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5; // Numărul de elemente pe o pagină
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/incomes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIncomes(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        setTotalPages(Math.ceil(incomes.length / itemsPerPage));
        fetchIncomes();
    }, [token]);
    useEffect(() => {
        setTotalPages(Math.ceil(incomes.length / itemsPerPage));
    }, [incomes]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
        fetchCategories();
    }, [token]);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleIncomeClick = (income) => {
        setSelectedIncome(income);
    };
    const addIncome = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/incomes', addIncomeForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIncomes([...incomes, response.data]);
            setAddIncomeForm({ description: '', amount: '', date: '', userId: '', categoryId: '' }); // resetează formularul
        } catch (error) {
            console.error(error);
        }
    };
    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };

    const updateIncome = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/incomes/${selectedIncome.id}`,
                selectedIncome,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIncomes((prevIncomes) =>
                prevIncomes.map((income) =>
                    income.id === selectedIncome.id ? response.data : income
                )
            );
            setSelectedIncome(null);
            setOpenUpdateModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/incomes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIncomes(incomes.filter((income) => income.id !== id));
        } catch (error) {
            console.error(error);
        }
    };
    const currentItems = incomes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Paper className="incomes-table">
            <div className="add-income-form">
                <TextField
                    name="description"
                    label="Description"
                    value={addIncomeForm.description}
                    onChange={(e) => setAddIncomeForm({ ...addIncomeForm, description: e.target.value })}
                />
                <TextField
                    name="amount"
                    label="Amount"
                    value={addIncomeForm.amount}
                    onChange={(e) => setAddIncomeForm({ ...addIncomeForm, amount: e.target.value })}
                />
                <TextField
                    name="userId"
                    label="User Id"
                    value={addIncomeForm.userId}
                    onChange={(e) => setAddIncomeForm({ ...addIncomeForm, userId: e.target.value })}
                />
                <TextField
                    name="categoryId"
                    label="Category Id"
                    value={addIncomeForm.categoryId}
                    onChange={(e) => setAddIncomeForm({ ...addIncomeForm, categoryId: e.target.value })}
                />
                <Button variant="contained" color="primary" onClick={addIncome}>
                    Add Income
                </Button>
            </div>
            <Typography variant="h5">Incomes</Typography>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>Category</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {currentItems.map((income) => (
                    <tr
                        key={income.id}
                        className={`income-row ${selectedIncome && selectedIncome.id === income.id ? 'selected' : ''}`}
                        onClick={() => handleIncomeClick(income)}
                    >
                        <td>{income.description}</td>
                        <td>{income.amount}</td>
                        <td>{income.date}</td>
                        <td>{users.find(user => user.id === income.userId)?.username || 'N/A'}</td> {/* Numele utilizatorului */}
                        <td>{categories.find(category => category.id === income.categoryId)?.name || 'N/A'}</td> {/* Numele categoriei */}
                        <td>
                            <Button variant="contained" color="primary" onClick={handleOpenUpdateModal}>
                                Update
                            </Button>
                        </td>
                        <td>
                            <Button variant="contained" color="secondary" onClick={() => deleteIncome(income.id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <Button variant="contained" disabled={currentPage === 1} onClick={handlePrevPage}>
                    Previous
                </Button>
                <span>{`${currentPage} of ${totalPages}`}</span>
                <Button variant="contained" disabled={currentPage === totalPages} onClick={handleNextPage}>
                    Next
                </Button>
            </div>
            {selectedIncome && (
                <Dialog open={openUpdateModal} onClose={handleCloseUpdateModal}>
                    <DialogTitle>Update Income</DialogTitle>
                    <DialogContent>
                        <form onSubmit={updateIncome}>
                            <TextField
                                name="description"
                                label="Description"
                                value={selectedIncome && selectedIncome.description}
                                onChange={(event) =>
                                    setSelectedIncome({ ...selectedIncome, description: event.target.value })
                                }
                            />
                            <TextField
                                name="amount"
                                label="Amount"
                                value={selectedIncome && selectedIncome.amount}
                                onChange={(event) =>
                                    setSelectedIncome({ ...selectedIncome, amount: event.target.value })
                                }
                            />
                            <TextField
                                name="date"
                                label="Date"
                                value={selectedIncome && selectedIncome.date}
                                onChange={(event) =>
                                    setSelectedIncome({ ...selectedIncome, date: event.target.value })
                                }
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUpdateModal} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={updateIncome} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Paper>
    );
};

export default IncomesTable;
