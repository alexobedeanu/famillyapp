import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import './PostLogin.css';

function PostLogin() {
    const { authState: { user } } = useContext(AuthContext);

    return (
        <div className="post-login">
            <h1>Bine ați venit, {user}!</h1>
        </div>
    );
}


export default PostLogin;
