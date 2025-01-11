require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Keycloak = require('keycloak-connect');

const app = express();
const port = process.env.PORT || 8000;

const keycloak = new Keycloak({}, {
    serverUrl: process.env.KEYCLOAK_SERVER_URL,
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET,
    bearerOnly: true,
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(keycloak.middleware());

app.get('/reports', keycloak.protect((accessToken) => accessToken.hasRealmRole('prothetic_user')), (req, res) => {
    res.json({
        message: 'This is a protected API endpoint.',
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});