const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Обработчик для Callback URL
app.get('/pipedrive/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('No authorization code provided.');
    }

    try {
        const response = await axios.post('https://oauth.pipedrive.com/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://1d31-2a01-e0a-a9e-9f30-adfe-4bb0-66ea-60b.ngrok-free.app/pipedrive/callback', // Обновите на текущий ngrok URL
            client_id: '9eb24d108673c154', // Ваш фактический Client ID
            client_secret: '3d1be9d537a426631b267bfb0c6a5191155f0d73' // Ваш фактический Client Secret
        });

        const { access_token } = response.data;

        // Сохраните токен доступа в вашей базе данных или используйте его для взаимодействия с API Pipedrive
        console.log('Access Token:', access_token);

        res.send('Authorization successful! You can close this tab.');
    } catch (error) {
        if (error.response) {
            // Сервер ответил статусом, отличным от 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            // Запрос был сделан, но ответа не получено
            console.error('Error request data:', error.request);
        } else {
            // Произошла ошибка в настройке запроса
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
        res.status(500).send('An error occurred during the authorization process.');
    }
});

// Обработчик для корневого URL
app.get('/', (req, res) => {
    res.send('Welcome to the API server!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
