import { Express, Request, Response } from "express-serve-static-core";
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as cryptoUtil from './../security/crypto.util';

import * as Dal from 'kubot-dal';
import { VaultService, Types } from 'rsa-vault';

export function mapSecurityRoutes(app: Express) {

    app.post('/api/ws/login', async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.validateLogin()) {
                return res.answer(400, 'Expecting identifiers');
            }

            let user = await Dal.Manipulation.SessionStore.get(req.body.login);
            if (user === null) return res.status(401).json({
                status: 401,
                data: null
            });

            let isPasswordValid = await cryptoUtil.verify(req.body.password, user.password)
            if (isPasswordValid) {
                let keyPair: Types.ApplicationKeys = await VaultService.GetKeyPair('kubot-ws');

                let gracePeriod = req.body.expiresIn || 120;
                let expirationDate = moment().add(gracePeriod, 'seconds');

                const jwtBearerToken = jwt.sign({ guild: req.body.login }, keyPair.privateKey, {
                    algorithm: 'RS256',
                    expiresIn: gracePeriod
                });

                return res.status(200).json({
                    status: 200,
                    token: jwtBearerToken,
                    roles: user.roles,
                    expirationDate: JSON.stringify(expirationDate)
                });
            } else {
                return res.status(401).json({
                    status: 401,
                    data: null
                });
            }
        } catch (error) {
            return res.answer(500, error.message);
        }
    });
}