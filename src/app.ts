import debug = require('debug');
import express = require('express');
import { Express, Response } from "express-serve-static-core";
import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as cors from 'cors';

import { Configuration as KubotDalConfiguration } from 'kubot-dal';
import { Configuration as RsaStoreConfiguration } from 'rsa-provider';
KubotDalConfiguration.Setup('mongodb://127.0.0.1:27017', 'kubot-ts');
RsaStoreConfiguration.Setup('127.0.0.1:27017', 'cryptography-db');

import { mapGuildRoutes } from './routes/guild.routes';
import { mapSecurityRoutes } from './routes/security.routes';
import { mapStaticRoutes } from './routes/static.routes';
import { extendsImplementation } from './middleware/extends.implementation.middleware';

let app: Express = express();
app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(extendsImplementation);

app.get('/', (req, res) => {
    res.send('Nothing to see here. See /api');
});
app.get('/api/', (req, res) => {
    res.send('This is Kubot-ws API.');
});
mapGuildRoutes(app);
mapSecurityRoutes(app);
mapStaticRoutes(app);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});