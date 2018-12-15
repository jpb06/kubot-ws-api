import { Express, Request, Response } from "express-serve-static-core";

import * as Dal from 'kubot-dal';
import { isAuthenticated, HasRole } from './../middleware/permissions.validation.middleware';

export function mapAdminRoutes(app: Express) {

    app.post('/api/kubot/admin/setstarsystems', isAuthenticated, HasRole('admin'), async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateStarSystems()) {
                return res.answer(400, 'Expecting a list of star systems');
            }

            let result = await Dal.Manipulation.StarSystemsStore.set(req.body.starsystems);

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