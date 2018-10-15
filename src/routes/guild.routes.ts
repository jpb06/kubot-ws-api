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
                return res.badRequest('Expecting an id');
            }

            let guild = await Dal.Manipulation.GuildsStore.get(req.body.id);

            return res.populate(guild);
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    });

    app.post('api/kubot/saveguild', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateId()) {
                return res.badRequest('Expecting a guild');
            }

            let guild = req.body.guild as Dal.Types.GuildConfiguration;
            let result = await Dal.Manipulation.GuildsStore.set(guild);

            if (result) {
                return res.status(200).json({
                    status: 200
                });
            } else {
                throw Error('Persistence failure: unable to save data');
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    });

    app.post('/api/kubot/regions', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateId()) {
                return res.badRequest('Expecting an id');
            }

            let regions = await Dal.Manipulation.RegionWatchStore.get(req.body.id);

            return res.populate(regions);
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    });

    app.post('/api/kubot/factions', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateId()) {
                return res.badRequest('Expecting an id');
            }

            let factions = await Dal.Manipulation.FactionWatchStore.get(req.body.id);

            return res.populate(factions);
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    });


}