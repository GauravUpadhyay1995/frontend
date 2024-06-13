import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserType = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const DecryptToken = jwtDecode(token);
                const userId = DecryptToken.id;

                try {
                    const response = await axios.post(`api/users/getUserProfile`, { userId },
                        { headers: { Authorization: `Bearer ${token}` } });
                    setUserData(response.data.data);

                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        getUser();
    }, []);

    return userData;
};

export default UserType;
