import { Express } from "express-serve-static-core";
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import * as Dal from 'kubot-dal';
import { CryptoService } from 'rsa-store';
import { KeyPair } from 'rsa-store/typings/types.export';

export abstract class WebsiteRoutes {
    
    public static Map(app: Express) {

        app.post('/api/ws/login', async (req, res) => {
            try {
                if (!req.validateLogin()) {
                    return res.badRequest('Expecting identifiers');
                }

                let user = await Dal.Manipulation.SessionStore.get(req.body.login);
                if (user != null && user.password === req.body.password) {
                    let keyPair: KeyPair = await CryptoService.GetKeyPair('kubot-ws');

                    let gracePeriod = req.body.expiresIn || 120;
                    let expirationDate = moment().add(gracePeriod, 'seconds');

                    const jwtBearerToken = jwt.sign({}, keyPair.privateKey, {
                        algorithm: 'RS256',
                        expiresIn: gracePeriod,
                        subject: user.token
                    });

                    return res.status(200).json({
                        status: 'Success',
                        token: jwtBearerToken,
                        expirationDate: JSON.stringify(expirationDate)
                    });
                } else {
                    return res.status(401).json({
                        status: 'Not authorized',
                        data: null
                    });
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
}