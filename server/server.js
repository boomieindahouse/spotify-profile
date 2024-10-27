// server/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const path = require('path'); // เพิ่มการนำเข้า path

const app = express();
app.use(cors());
app.use(express.json());

// การกำหนดค่าตัวแปร
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// ฟังก์ชันเพื่อสร้างสตริงสุ่ม
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// เส้นทางสำหรับการล็อกอิน
app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read user-follow-read playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        redirect_uri: REDIRECT_URI,
        state,
    })}`;
    res.redirect(authUrl);
});

// เส้นทางสำหรับการ callback
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        }), {
            headers: {
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// เส้นทางสำหรับโปรไฟล์
app.get('/profile', async (req, res) => {
    const { access_token } = req.headers;
    try {
        const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        res.json(profileResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// เส้นทางสำหรับการ logout
app.post('/logout', (req, res) => {
    res.status(200).send('Logged out successfully');
});

// เส้นทางหลักสำหรับ React
app.use(express.static(path.join(__dirname, '../client/dist'))); // เส้นทางไปยังไฟล์ React

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
