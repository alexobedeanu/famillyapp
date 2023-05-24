import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialToken = localStorage.getItem('token');
    const [authState, setAuthState] = useState({
        user: null,
        token: initialToken,
    });

    useEffect(() => {
        if (initialToken) {
            const decodedToken = jwtDecode(initialToken);
            setAuthState((prevState) => ({
                ...prevState,
                user: decodedToken.sub,
            }));
        }
    }, []);

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        setAuthState((prevState) => ({
            ...prevState,
            user: decodedToken.sub,
            token: token,
        }));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuthState({ user: null, token: null });
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
