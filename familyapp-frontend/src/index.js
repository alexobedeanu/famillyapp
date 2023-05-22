import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/authContext'; // importa AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider> {/* wrap App in AuthProvider */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();