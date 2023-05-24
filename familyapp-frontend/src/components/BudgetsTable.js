import React, { useEffect, useState, useContext } from 'react';
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
import './BudgetsTable.css';

const BudgetsTable = () => {
    const pageSize = 2;
    const [budgets, setBudgets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { authState } = useContext(AuthContext);
    const { token } = authState;
    const [searchId, setSearchId] = useState('');
    const [filteredBudget, setFilteredBudget] = useState(null);
    const [addBudgetForm, setAddBudgetForm] = useState({
        id: '',
        amount: '',
        familyId: '',
        categoryId: '',
    });
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/budgets', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data) {
                    setBudgets(response.data);
                    setTotalPages(Math.ceil(response.data.length / pageSize));
                } else {
                    console.log('Server response:', response);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchBudgets();
    }, [token, pageSize]);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/budgets/${searchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFilteredBudget(response.data);
        } catch (error) {
            console.log(error);
            setFilteredBudget(null);
        }
    };

    const handleSearchChange = (event) => {
        setSearchId(event.target.value);
    };

    const addBudget = async (budget) => {
        try {
            const response = await axios.post('http://localhost:8080/api/budgets', budget, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                setBudgets([...budgets, response.data]);
            } else {
                console.log('Server response:', response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateBudget = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/budgets/${selectedBudget.id}`,
                selectedBudget,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                setBudgets((prevBudgets) =>
                    prevBudgets.map((budget) =>
                        budget.id === selectedBudget.id ? response.data : budget
                    )
                );
                setSelectedBudget(response.data);
            } else {
                console.log('Server response:', response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/budgets/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBudgets(budgets.filter((budget) => budget.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = () => {
        setAddBudgetForm({
            id: '',
            amount: '',
            familyId: '',
            categoryId: '',
        });
    };

    const handleAddBudgetChange = (event) => {
        setAddBudgetForm({
            ...addBudgetForm,
            [event.target.name]: event.target.value,
        });
    };

    const handleAddBudget = (event) => {
        event.preventDefault();
        addBudget(addBudgetForm);
        handleReset();
    };

    const handleBudgetClick = (budget) => {
        setSelectedBudget(budget);
    };

    const handlePaginationClick = (page) => {
        setCurrentPage(page);
    };

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };

    return (
        <Paper className="budgets-table">
            <Typography variant="h5">Detalii buget</Typography>
            <TextField className="search-input" label="Caută după ID" value={searchId} onChange={handleSearchChange} />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Caută
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setFilteredBudget(null)}>
                Resetează
            </Button>
            <form onSubmit={handleAddBudget}>
                <TextField name="id" label="ID" value={addBudgetForm.id} onChange={handleAddBudgetChange} />
                <TextField name="amount" label="Amount" value={addBudgetForm.amount} onChange={handleAddBudgetChange} />
                <TextField name="familyId" label="Family ID" value={addBudgetForm.familyId} onChange={handleAddBudgetChange} />
                <TextField name="categoryId" label="Category ID" value={addBudgetForm.categoryId} onChange={handleAddBudgetChange} />
                <Button type="submit" variant="contained" color="primary">
                    Add
                </Button>
            </form>
            <table>
                <tbody>
                {budgets &&
                    budgets
                        .filter((budget) => budget.id.toString().includes(searchId))
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((budget) => (
                            <tr
                                key={budget.id}
                                className={`budget-row ${selectedBudget && selectedBudget.id === budget.id ? 'selected' : ''}`}
                                onClick={() => handleBudgetClick(budget)}
                            >
                                <td>ID:</td>
                                <td>
                                    <span>{budget.id}</span>
                                </td>
                                <td>Amount:</td>
                                <td>
                                    <span>{budget.amount}</span>
                                </td>
                                <td>
                                    <Button variant="contained" color="primary" onClick={handleOpenUpdateModal}>
                                        Update
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="contained" color="secondary" onClick={() => deleteBudget(budget.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={index + 1 === currentPage ? 'active' : ''}
                        onClick={() => handlePaginationClick(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            {selectedBudget && (
                <div className="selected-budget">
                    <Typography variant="h6">Detalii buget selectat</Typography>
                    <div>ID: {selectedBudget.id}</div>
                    <div>Amount: {selectedBudget.amount}</div>
                    <div>Family ID: {selectedBudget.familyId}</div>
                    <div>Category ID: {selectedBudget.categoryId}</div>
                    {/* Add the modal dialog for updating budget here */}
                </div>
            )}
            <Dialog open={openUpdateModal} onClose={handleCloseUpdateModal}>
                <DialogTitle>Update Budget</DialogTitle>
                <DialogContent>
                    <form onSubmit={updateBudget}>
                        <TextField
                            name="amount"
                            label="Amount"
                            value={selectedBudget && selectedBudget.amount}
                            onChange={(event) =>
                                setSelectedBudget({ ...selectedBudget, amount: event.target.value })
                            }
                        />
                        <TextField
                            name="familyId"
                            label="Family ID"
                            value={selectedBudget && selectedBudget.familyId}
                            onChange={(event) =>
                                setSelectedBudget({ ...selectedBudget, familyId: event.target.value })
                            }
                        />
                        <TextField
                            name="categoryId"
                            label="Category ID"
                            value={selectedBudget && selectedBudget.categoryId}
                            onChange={(event) =>
                                setSelectedBudget({ ...selectedBudget, categoryId: event.target.value })
                            }
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={updateBudget} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default BudgetsTable;
