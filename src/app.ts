import debug = require('debug');
import express = require('express');

import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import { InputValidator } from "./input.validator";
import { ResponseBroker } from "./response.broker";

import * as Dal from 'kubot-dal';
Dal.Configuration.Setup('mongodb://127.0.0.1:27017', 'kubot-ts');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('Nothing to see here. See /api');
});
app.get('/api/', (req, res) => {
    res.send('This is Kubot-ws API.');
});
app.post('/api/guild', async (req, res) => {
    InputValidator.validate(req.body.id, res);

    let guild = await Dal.Manipulation.GuildsStore.get(req.body.id);
    return ResponseBroker.Reply(guild, res);
});
app.post('/api/regions', async (req, res) => {
    InputValidator.validate(req.body.id, res);

    let regions = await Dal.Manipulation.RegionWatchStore.get(req.body.id);
    return ResponseBroker.Reply(regions, res);
});
app.post('/api/factions', async (req, res) => {
    InputValidator.validate(req.body.id, res);

    let factions = await Dal.Manipulation.FactionWatchStore.get(req.body.id);
    return ResponseBroker.Reply(factions, res);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
