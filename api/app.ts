require('dotenv').config();
import express = require('express');
import {NextFunction, Request, Response} from "express";
import session = require('express-session');
import {CorsOptions} from "cors";
import cors = require('cors');
import Keycloak = require('keycloak-connect');
import {Token} from "keycloak-connect";

const port = process.env.PORT || 8000;

const corsOptions: CorsOptions = {
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}
const memoryStore: session.MemoryStore = new session.MemoryStore();
const keycloakOptions: Keycloak.KeycloakOptions = {
    store: memoryStore,
}
const keycloak = new Keycloak(keycloakOptions);

const app = express();

app.use(session({
    secret: 'sprint-8',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

app.use(keycloak.middleware());
app.use(cors(corsOptions));
app.use((err: any, req: Request, res: any, next: NextFunction) => {
    if (err) {
        return res.status(err.statusCode || 500).json(err.message);
    }
    next()
});

app.all('/reports', keycloak.protect(protheticRoleCheck), (_, res: Response) => {
    res.status(200).json({data: ['report1', 'report2', 'report3']});
})

app.get('/public', (req: Request, res: Response) => {
    res.status(200).json({data: ['public route']});
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function protheticRoleCheck(accessToken: Token, req: Request): boolean {
    return accessToken.hasRealmRole('prothetic_user')
}
