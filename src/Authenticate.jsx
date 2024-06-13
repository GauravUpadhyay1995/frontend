import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Authenticate() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("tok="+token)

            navigate('/login');
        }
    }, []);


}

export default Authenticate;
