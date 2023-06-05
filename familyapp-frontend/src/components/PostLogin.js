import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';

function PostLogin() {
    const { authState: { user } } = useContext(AuthContext);

    return (
        <div>
            <h1>Bine ați venit, {user}!</h1>
        </div>
    );
}

export default PostLogin;
