import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        token: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setAuthState({ user: decodedToken.sub, token });
        }
    }, []);

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        setAuthState({ user: decodedToken.sub, token });
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
