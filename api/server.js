const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

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
            redirect_uri: 'https://iframe-pipedrive.vercel.app/', // Замените на ваш фактический Callback URL
            client_id: '9eb24d108673c154', // Замените на ваш фактический Client ID
            client_secret: '3d1be9d537a426631b267bfb0c6a5191155f0d73' // Замените на ваш фактический Client Secret
        });

        const { access_token } = response.data;

        // Сохраните токен доступа в вашей базе данных или используйте его для взаимодействия с API Pipedrive
        console.log('Access Token:', access_token);

        res.send('Authorization successful! You can close this tab.');
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error);
        res.status(500).send('An error occurred during the authorization process.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});