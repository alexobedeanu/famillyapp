import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Select, MenuItem, List, ListItem, Avatar, Button } from '@material-ui/core';
import { AuthContext } from '../context/authContext';
import './FamilyUsersPage.css';

const FamilyUsersPage = () => {
    const { authState } = useContext(AuthContext);
    const { token } = authState;
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState("");
    const [familyUsers, setFamilyUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/families', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setFamilies(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFamilies();
        fetchUsers();
    }, [token]);

    const handleChangeFamily = async (event) => {
        const familyId = event.target.value;
        setSelectedFamily(familyId);
        try {
            const response = await axios.get(`http://localhost:8080/api/families/${familyId}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setFamilyUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddUserToFamily = async (userId, familyId) => {
        try {
            await axios.post(`http://localhost:8080/api/users/${userId}/families/${familyId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            handleChangeFamily({ target: { value: familyId } });
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveUserFromFamily = async (userId, familyId) => {
        if (window.confirm("Sunteți sigur că doriți să ștergeți acest utilizator din familie?")) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${userId}/families/${familyId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                handleChangeFamily({ target: { value: familyId } });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Paper className="FamilyUsersPage">
            <div className="FamilyUsersPage-header">
                <Typography className="FamilyUsersPage-title">Family Members</Typography>
                <Select
                    value={selectedFamily}
                    onChange={handleChangeFamily}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Selectați familia
                    </MenuItem>
                    {families.map((family) => (
                        <MenuItem key={family.id} value={family.id}>
                            {family.name}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    value={selectedUser}
                    onChange={(event) => setSelectedUser(event.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Selectați utilizatorul
                    </MenuItem>
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>

                <Button variant="contained" color="primary" onClick={() => handleAddUserToFamily(selectedUser, selectedFamily)}>
                    Adaugă la familie
                </Button>
            </div>

            <List className="FamilyUsersPage-list">
                {familyUsers.map(user => (
                    <ListItem key={user.id} className="FamilyUsersPage-listItem">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar className="FamilyUsersPage-userIcon">
                                {user.username.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Typography>{user.username}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleRemoveUserFromFamily(user.id, selectedFamily)}>
                                Șterge
                            </Button>
                        </div>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default FamilyUsersPage;
