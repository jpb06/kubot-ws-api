import debug = require('debug');
import express = require('express');
import { Express, Response } from "express-serve-static-core";
import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as cors from 'cors';

import { apiConfig } from './config/api.config.interface';

import { Configuration as KubotDalConfiguration } from 'kubot-dal';
import { Configuration as RsaStoreConfiguration } from 'rsa-vault';

KubotDalConfiguration.Setup(apiConfig());
RsaStoreConfiguration.Setup(apiConfig());

import { mapAdminRoutes } from './routes/admin.routes';
import { mapGuildRoutes } from './routes/guild.routes';
import { mapSecurityRoutes } from './routes/security.routes';
import { mapStaticRoutes } from './routes/static.routes';
import { extendsImplementation } from './middleware/extends.implementation.middleware';

let app: Express = express();
app.use(cors({
    origin: apiConfig().srvURLs,
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

var server = app.listen(app.get('port'), apiConfig().expressListeningIPAddress, function () {
    debug('Express server listening on port ' + server.address().port);
});