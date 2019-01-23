import { Express, Request, Response } from "express-serve-static-core";

import * as Dal from 'kubot-dal';
import { CacheService } from './../caching/cache.service';
import { isAuthenticated } from './../middleware/permissions.validation.middleware';

export function mapStaticRoutes(app: Express) {

    app.post('/api/static/systems', isAuthenticated, async (
        req: Request,
        res: Response
    ) => {
        try {
            let systems = await Dal.Manipulation.StarSystemsStore.getAll();

            return res.populate(systems);
        } catch (error) {
            return res.answer(500, error.message);
        }
    });

    app.get('/api/static/guildscount', async (
        req: Request,
        res: Response
    ) => {
        try {
            let guildsCount = await CacheService.getGuildCount();
            
            return res.status(200).json({
                status: 200,
                data: guildsCount
            });
        } catch (error) {
            return res.answer(500, error.message);
        }
    });
}