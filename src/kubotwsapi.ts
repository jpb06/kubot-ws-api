import debug = require('debug');
import express = require('express');
import { Express, Response } from "express-serve-static-core";
import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as cors from 'cors';

import * as ConfigData from './config/current.config.json';

import { Configuration as KubotDalConfiguration } from 'kubot-dal';
import { Configuration as RsaStoreConfiguration } from 'rsa-provider';

KubotDalConfiguration.Setup(`mongodb://${(<any>ConfigData).srvIPAddress}:${(<any>ConfigData).mongodbPort}`, 'kubot-ts');
RsaStoreConfiguration.Setup(`${(<any>ConfigData).srvIPAddress}:${(<any>ConfigData).mongodbPort}`, 'cryptography-db');

import { mapAdminRoutes } from './routes/admin.routes';
import { mapGuildRoutes } from './routes/guild.routes';
import { mapSecurityRoutes } from './routes/security.routes';
import { mapStaticRoutes } from './routes/static.routes';
import { extendsImplementation } from './middleware/extends.implementation.middleware';

let app: Express = express();
app.use(cors({
    origin: (<any>ConfigData).srvURLs,
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
mapAdminRoutes(app);
mapGuildRoutes(app);
mapSecurityRoutes(app);
mapStaticRoutes(app);

app.set('port', 3000);

var server = app.listen(app.get('port'), (<any>ConfigData).expressListeningIPAddress, function () {
    debug('Express server listening on port ' + server.address().port);
});