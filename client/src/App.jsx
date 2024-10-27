import { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from './components/Profile';
import LoginScreen from './components/LoginScreen';

function App() {
    const [profileData, setProfileData] = useState(null);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/profile', {
                headers: { access_token: localStorage.getItem('spotify_access_token') },
            });
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        const token = new URLSearchParams(window.location.hash).get('#access_token');
        if (token) {
            localStorage.setItem('spotify_access_token', token);
            fetchProfile();
        }
    }, []);

    return (
        <div className="App">
            {profileData ? (
                <Profile data={profileData} />
            ) : (
                <LoginScreen />
            )}
        </div>
    );
}

export default App;
