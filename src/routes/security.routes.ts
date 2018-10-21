import { Express, Request, Response } from "express-serve-static-core";
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import * as Dal from 'kubot-dal';
import { CryptoService } from 'rsa-provider';
import { KeyPair } from 'rsa-provider/typings/types.export';

export function mapSecurityRoutes(app: Express) {

    app.post('/api/ws/login', async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateLogin()) {
                return res.badRequest('Expecting identifiers');
            }

            let user = await Dal.Manipulation.SessionStore.get(req.body.login);
            if (user != null && user.password === req.body.password) {
                let keyPair: KeyPair = await CryptoService.GetKeyPair('kubot-ws');

                let gracePeriod = req.body.expiresIn || 120;
                let expirationDate = moment().add(gracePeriod, 'seconds');

                const jwtBearerToken = jwt.sign({ guild: req.body.login }, keyPair.privateKey, {
                    algorithm: 'RS256',
                    expiresIn: gracePeriod
                });

                return res.status(200).json({
                    status: 200,
                    token: jwtBearerToken,
                    expirationDate: JSON.stringify(expirationDate)
                });
            } else {
                return res.status(401).json({
                    status: 401,
                    data: null
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    });
}