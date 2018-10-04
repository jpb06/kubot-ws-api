import debug = require('debug');
import express = require('express');
import { Express, Response } from "express-serve-static-core";
import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as cors from 'cors';

import { Configuration as KubotDalConfiguration } from 'kubot-dal';
import { Configuration as RsaStoreConfiguration } from 'rsa-store';
KubotDalConfiguration.Setup('mongodb://127.0.0.1:27017', 'kubot-ts');
RsaStoreConfiguration.Setup('127.0.0.1:27017', 'cryptography-db');

import { GuildRoutes } from './routes/guild.routes';
import { WebsiteRoutes } from './routes/website.routes';

let app: Express = express();
app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.populate = function (data: any): Response {
        if (data === undefined) {
            return res.status(404).json({
                status: 'Not found',
                data: null
            });
        } else {
            return res.status(200).json({
                status: 'Success',
                data: data
            });
        }
    }
    res.badRequest = function (message: string): Response {
        return res.status(400).json({
            status: message,
            data: null
        });
    }
    req.validateId = function (): boolean {
        if (req.body.id === undefined || req.body.id === '') {
            return false;
        }

        return true;
    }
    req.validateLogin = function (): boolean {
        if ((req.body.login === undefined || req.body.login === '') ||
            (req.body.password === undefined || req.body.password === '')) {
            return false;
        }

        return true;
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Nothing to see here. See /api');
});
app.get('/api/', (req, res) => {
    res.send('This is Kubot-ws API.');
});
GuildRoutes.Map(app);
WebsiteRoutes.Map(app);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});