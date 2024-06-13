import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
// import styles from './login.module.css'; // Import the CSS module

function Login({ setIsAuthenticated }) {

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        const requestData = {
            email: Email,
            password: Password,
        };
        try {
            const response = await axios.post('/api/users/userLogin', requestData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setIsAuthenticated(true);
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                // 
                setError(error.response.data.message);
            }
        }
    };
    return (
       
            <div className={styles.form}>
                <h2>Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.input}>
                        <div className={styles.inputBox}>
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                id="username"
                                value={Email}
                                placeholder="Username"
                            />
                        </div>
                        <div className={styles.inputBox}>
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                value={Password}
                                placeholder="Password"
                            />
                        </div>
                        <div className={styles.inputBox}>
                            <input type="submit" value="Sign In" />
                        </div>
                    </div>
                </form>
                <p className={styles.forgot}>
                    Forgot Password? <a href="#">Click Here</a>
                </p>
            </div>
        
    );
};

export default Login;
