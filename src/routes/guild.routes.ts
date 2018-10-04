﻿import { Express } from "express-serve-static-core";

import * as Dal from 'kubot-dal';

export abstract class GuildRoutes {

    public static Map(app: Express) {
        app.post('/api/kubot/guild', async (req, res) => {
            if (!req.validateId()) {
                return res.badRequest('Expecting an id');
            }

            let guild = await Dal.Manipulation.GuildsStore.get(req.body.id);

            return res.populate(guild);
        });
        app.post('/api/kubot/regions', async (req, res) => {
            if (!req.validateId()) {
                return res.badRequest('Expecting an id');
            }

            let regions = await Dal.Manipulation.RegionWatchStore.get(req.body.id);

            return res.populate(regions);
        });
        app.post('/api/kubot/factions', async (req, res) => {
            if (!req.validateId()) {
                return res.badRequest('Expecting an id');
            }

            let factions = await Dal.Manipulation.FactionWatchStore.get(req.body.id);

            return res.populate(factions);
        });

    }
}