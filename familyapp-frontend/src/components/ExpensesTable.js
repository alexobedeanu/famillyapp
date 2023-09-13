import React, { useEffect, useState, useContext } from 'react';
import { Paper, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import './ExpensesTable.css';

const ExpensesTable = () => {
    const pageSize = 5; // Setați numărul de elemente pe pagină aici
    const [expenses, setExpenses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchId, setSearchId] = useState('');
    const [filteredExpense, setFilteredExpense] = useState(null);
    const { authState } = useContext(AuthContext);
    const { token } = authState; // Accesați token-ul din contextul de autentificare
    const [addExpenseForm, setAddExpenseForm] = useState({
        id: '',
        date: '',
        description: '',
        amount: '',
        userId: '',
        category_id: '',
        familyId: '',
    });
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [expenseToUpdate, setExpenseToUpdate] = useState(null);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [families, setFamilies] = useState([]);
    useEffect(() => {
        console.log('token: ', token);

        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/expenses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data) {
                    setExpenses(response.data);
                    setTotalPages(Math.ceil(response.data.length / pageSize));
                } else {
                    console.log('Server response:', response);
                }
            } catch (error) {
                console.error(error);
            }
        };
        // Obțineți utilizatorii
        const fetchUsers = async () => {
            const response = await axios.get('http://localhost:8080/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        };

        // Obțineți categoriile
        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:8080/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        };

        // Obțineți familiile
        const fetchFamilies = async () => {
            const response = await axios.get('http://localhost:8080/api/families', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFamilies(response.data);
        };

        fetchExpenses();
        fetchUsers();
        fetchCategories();
        fetchFamilies();
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
            const response = await axios.get(`http://localhost:8080/api/v1/expenses/${searchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFilteredExpense(response.data);
        } catch (error) {
            console.log(error);
            setFilteredExpense(null);
        }
    };

    const addExpense = async (expense) => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/expenses', expense, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                setExpenses([...expenses, response.data]);
            } else {
                console.log('Server response:', response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateExpense = async (id, updatedExpense) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/expenses/${id}`, updatedExpense, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                setExpenses(expenses.map((expense) => (expense.id === id ? response.data : expense)));
            } else {
                console.log('Server response:', response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/expenses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setExpenses(expenses.filter((expense) => expense.id !== id));
            setFilteredExpense(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = () => {
        setFilteredExpense(null);
    };

    const handleSearchChange = (event) => {
        setSearchId(event.target.value);
    };

    const handleAddExpenseChange = (event) => {
        setAddExpenseForm({
            ...addExpenseForm,
            [event.target.name]: event.target.value,
        });
    };

    const handleUpdateExpenseChange = (event) => {
        setExpenseToUpdate({
            ...expenseToUpdate,
            [event.target.name]: event.target.value,
        });
    };

    const handleAddExpense = (event) => {
        event.preventDefault();
        setOpenAddModal(false);
        addExpense(addExpenseForm);
        setAddExpenseForm({
            id: '',
            date: '',
            description: '',
            amount: '',
            userId: '',
            category_id: '',
            familyId: '',
        });
    };

    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleOpenUpdateModal = (expense) => {
        setExpenseToUpdate(expense);
        setOpenUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };

    const handleUpdateExpense = (event) => {
        event.preventDefault();
        setOpenUpdateModal(false);
        updateExpense(expenseToUpdate.id, expenseToUpdate);
    };

    const handlePaginationClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <Paper className="expenses-table">
            <Typography variant="h5">Detalii cheltuială</Typography>
            <TextField className="search-input" label="Caută după ID" value={searchId} onChange={handleSearchChange} />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Caută
            </Button>
            <Button variant="contained" color="secondary" onClick={handleReset}>
                Resetează
            </Button>
            <Button onClick={handleOpenAddModal} variant="contained" color="primary">
                Adaugă cheltuială
            </Button>
            {/*<form onSubmit={handleAddExpense}>*/}
            {/*    <TextField name="id" label="ID" value={addExpenseForm.id} onChange={handleAddExpenseChange} />*/}
            {/*    <TextField name="date" label="Date" value={addExpenseForm.date} onChange={handleAddExpenseChange} />*/}
            {/*    <TextField name="description" label="Description" value={addExpenseForm.description} onChange={handleAddExpenseChange} />*/}
            {/*    <TextField name="amount" label="Amount" value={addExpenseForm.amount} onChange={handleAddExpenseChange} />*/}
            {/*    <TextField name="userId" label="User ID" value={addExpenseForm.userId} onChange={handleAddExpenseChange} />*/}
            {/*    <TextField name="category_id" label="Category ID" value={addExpenseForm.category_id} onChange={handleAddExpenseChange} />*/}
            {/*    <TextField name="familyId" label="Family ID" value={addExpenseForm.familyId} onChange={handleAddExpenseChange} />*/}
            {/*    <Button type="submit" variant="contained" color="primary">*/}
            {/*        Add*/}
            {/*    </Button>*/}
            {/*</form>*/}
            <table>
                <thead>
                <tr>
                    <th>Descriere</th>
                    <th>Nume utilizator</th>
                    <th>Categorie</th>
                    <th>Nume familie</th>
                    <th>Actualizează</th>
                    <th>Șterge</th>
                </tr>
                </thead>
                <tbody>
                {expenses &&
                    expenses
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((expense) => {
                            const user = users.find(u => u.id === expense.userId);
                            const category = categories.find(c => c.id === expense.category_id);
                            const family = families.find(f => f.id === expense.familyId);
                            return (
                                <tr key={expense.id} className="expense-row" onClick={() => setFilteredExpense(expense)}>
                                    <td>{expense.description}</td>
                                    <td>{user ? user.username : 'N/A'}</td>
                                    <td>{category ? category.name : 'N/A'}</td>
                                    <td>{family ? family.name : 'N/A'}</td>
                                    <td>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenUpdateModal(expense)}>
                                            Actualizează
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="contained" color="secondary" onClick={() => deleteExpense(expense.id)}>
                                            Șterge
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
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
            {filteredExpense && (
                <div className="selected-expense">
                    <Typography variant="h6">Detalii cheltuială selectată</Typography>
                    <div>ID: {filteredExpense.id}</div>
                    <div>Date: {filteredExpense.date}</div>
                    <div>Description: {filteredExpense.description}</div>
                    <div>Amount: {filteredExpense.amount}</div>
                    <div>User ID: {filteredExpense.userId}</div>
                    <div>Category ID: {filteredExpense.category_id}</div>
                    <div>Family ID: {filteredExpense.familyId}</div>
                    {/*<Button variant="contained" color="primary" onClick={() => deleteExpense(filteredExpense.id)}>*/}
                    {/*    Delete*/}
                    {/*</Button>*/}
                    {/*<form onSubmit={handleUpdateExpense}>*/}
                    {/*    <TextField*/}
                    {/*        name="date"*/}
                    {/*        label="Date"*/}
                    {/*        value={filteredExpense.date}*/}
                    {/*        onChange={handleUpdateExpenseChange}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        name="description"*/}
                    {/*        label="Description"*/}
                    {/*        value={filteredExpense.description}*/}
                    {/*        onChange={handleUpdateExpenseChange}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        name="amount"*/}
                    {/*        label="Amount"*/}
                    {/*        value={filteredExpense.amount}*/}
                    {/*        onChange={handleUpdateExpenseChange}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        name="userId"*/}
                    {/*        label="User ID"*/}
                    {/*        value={filteredExpense.userId}*/}
                    {/*        onChange={handleUpdateExpenseChange}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        name="category_id"*/}
                    {/*        label="Category ID"*/}
                    {/*        value={filteredExpense.category_id}*/}
                    {/*        onChange={handleUpdateExpenseChange}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        name="familyId"*/}
                    {/*        label="Family ID"*/}
                    {/*        value={filteredExpense.familyId}*/}
                    {/*        onChange={handleUpdateExpenseChange}*/}
                    {/*    />*/}
                    {/*    <Button type="submit" variant="contained" color="primary">*/}
                    {/*        Update*/}
                    {/*    </Button>*/}
                    {/*</form>*/}
                </div>
            )}
            <Dialog open={openAddModal} onClose={handleCloseAddModal}>
                <DialogTitle>Adaugă cheltuială</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleAddExpense}>
                        <TextField name="date" label="Date" value={addExpenseForm.date} onChange={handleAddExpenseChange} />
                        <TextField name="description" label="Description" value={addExpenseForm.description} onChange={handleAddExpenseChange} />
                        <TextField name="amount" label="Amount" value={addExpenseForm.amount} onChange={handleAddExpenseChange} />
                        <TextField name="userId" label="User ID" value={addExpenseForm.userId} onChange={handleAddExpenseChange} />
                        <TextField name="category_id" label="Category ID" value={addExpenseForm.category_id} onChange={handleAddExpenseChange} />
                        <TextField name="familyId" label="Family ID" value={addExpenseForm.familyId} onChange={handleAddExpenseChange} />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddModal} color="primary">
                        Anulează
                    </Button>
                    <Button onClick={handleAddExpense} color="primary">
                        Adaugă
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openUpdateModal} onClose={handleCloseUpdateModal}>
                <DialogTitle>Update Expense</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleUpdateExpense}>
                        <TextField
                            name="date"
                            label="Date"
                            value={expenseToUpdate && expenseToUpdate.date}
                            onChange={handleUpdateExpenseChange}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={expenseToUpdate && expenseToUpdate.description}
                            onChange={handleUpdateExpenseChange}
                        />
                        <TextField
                            name="amount"
                            label="Amount"
                            value={expenseToUpdate && expenseToUpdate.amount}
                            onChange={handleUpdateExpenseChange}
                        />
                        <TextField
                            name="userId"
                            label="User ID"
                            value={expenseToUpdate && expenseToUpdate.userId}
                            onChange={handleUpdateExpenseChange}
                        />
                        <TextField
                            name="category_id"
                            label="Category ID"
                            value={expenseToUpdate && expenseToUpdate.category_id}
                            onChange={handleUpdateExpenseChange}
                        />
                        <TextField
                            name="familyId"
                            label="Family ID"
                            value={expenseToUpdate && expenseToUpdate.familyId}
                            onChange={handleUpdateExpenseChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal} color="primary">
                        Anulează
                    </Button>
                    <Button onClick={handleUpdateExpense} color="primary">
                        Actualizează
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ExpensesTable;
