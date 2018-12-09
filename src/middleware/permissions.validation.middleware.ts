import * as jwt from 'jsonwebtoken';
import { KeyPair } from 'rsa-provider/typings/types.export';
import { CryptoService } from 'rsa-provider';
import { Request, Response, NextFunction } from 'express';
import * as Dal from 'kubot-dal';
import { RequestHandlerParams } from 'express-serve-static-core';

function verifyHeaders(
    req: Request,
    res: Response
): string {
    let authorizationHeaders = req.headers.authorization || '';
    let chunks = authorizationHeaders.split(' ');

    if (chunks.length === 0 || chunks[0] !== 'Bearer' || chunks[1].length === 0) {
        return '';
    }

    return chunks[1];
}

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let token = verifyHeaders(req, res);
        if (token === '') {
            return res.status(401).json({
                status: 401,
                message: 'Not logged in'
            });
        }

        let keyPair: KeyPair = await CryptoService.GetKeyPair('kubot-ws');

        let result = jwt.verify(token, keyPair.publicKey);
        res.locals.login = (<any>result).guild;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 401,
                message: 'Token has expired'
            });
        } else if (error.name === 'JsonWebTokenError' && error.message.startsWith('jwt subject invalid')) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid token'
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    }
};

export function HasRole(
    role: string
): RequestHandlerParams {
    return async function (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | undefined> {
        try {
            if (res.locals.login === null) {
                return sendNotAuthorizedResponse(res);
            }

            let roles = await Dal.Manipulation.SessionStore.getPermissions(res.locals.login);

            if ((roles === null || !Array.isArray(roles)) || roles.indexOf(role) === -1) {
                return sendNotAuthorizedResponse(res);
            }

            next();
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    }
}

function sendNotAuthorizedResponse(res: Response): Response {
    return res.status(401).json({
        status: 401,
        message: 'Not authorized'
    });
}