import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';

function PostLogin() {
    const { authState: { user } } = useContext(AuthContext);

    return (
        <div>
            <h1>Bine ați venit, {user}!</h1>
            <p>Aici vor fi funcționalitățile aplicației...</p>
        </div>
    );
}

export default PostLogin;
