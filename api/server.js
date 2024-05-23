require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;

// Настройка сервера для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Обработчик для Callback URL
app.get('/pipedrive/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('No authorization code provided.');
    }

    console.log('Authorization code received:', code);

    try {
        const response = await axios.post('https://oauth.pipedrive.com/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.BASE_URL}/pipedrive/callback`, // Используем переменные окружения
            client_id: process.env.CLIENT_ID, // Используем переменные окружения
            client_secret: process.env.CLIENT_SECRET // Используем переменные окружения
        });

        console.log('Response from Pipedrive token exchange:', response.data);

        const { access_token } = response.data;

        // Сохраните токен доступа в вашей базе данных или используйте его для взаимодействия с API Pipedrive
        console.log('Access Token:', access_token);

        res.send('Authorization successful! You can close this tab.');
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred during the authorization process.');
    }
});

// Обработчик для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
