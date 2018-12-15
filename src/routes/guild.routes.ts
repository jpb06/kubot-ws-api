import { Express, Request, Response } from "express-serve-static-core";

import * as Dal from 'kubot-dal';
import { isAuthenticated } from './../middleware/permissions.validation.middleware';

export function mapGuildRoutes(app: Express) {

    app.post('/api/kubot/guild', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateId()) {
                return res.answer(400, 'Expecting an id');
            }

            let guild = await Dal.Manipulation.GuildsStore.get(req.body.id);

            return res.populate(guild);
        } catch (error) {
            return res.answer(500, error.message);
        }
    });

    app.post('/api/kubot/saveguild', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateGuild()) {
                return res.answer(400, 'Expecting a guild');
            }

            let guild = req.body.guild as Dal.Types.GuildConfiguration;
            let result = await Dal.Manipulation.GuildsStore.set(guild);

            if (result) {
                return res.answer(200, 'success');
            } else {
                throw Error('Persistence failure: unable to save data');
            }
        } catch (error) {
            return res.answer(500, error.message);
        }
    });

    app.post('/api/kubot/regions', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateId()) {
                return res.answer(400, 'Expecting an id');
            }

            let regions = await Dal.Manipulation.RegionWatchStore.get(req.body.id);

            return res.populate(regions);
        } catch (error) {
            return res.answer(500, error.message);
        }
    });

    app.post('/api/kubot/factions', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateId()) {
                return res.answer(400, 'Expecting an id');
            }

            let factions = await Dal.Manipulation.FactionWatchStore.get(req.body.id);

            return res.populate(factions);
        } catch (error) {
            return res.answer(500, error.message);
        }
    });

    app.post('/api/kubot/savefactions', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateFactions()) {
                return res.answer(400, 'Expecting an array of factions');
            }

            let factions = req.body.factions as Array<Dal.Types.WatchedFaction>;
            let result = await Dal.Manipulation.FactionWatchStore.set(req.body.id, factions);

            if (result) {
                return res.answer(200, 'success');
            } else {
                throw Error('Persistence failure: unable to save data');
            }
        } catch (error) {
            return res.answer(500, error.message);
        }
    });



}