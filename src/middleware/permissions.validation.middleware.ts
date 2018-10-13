import * as jwt from 'jsonwebtoken';
import { KeyPair } from 'rsa-store/typings/types.export';
import { CryptoService } from 'rsa-store';
import { Request, Response, NextFunction } from 'express';

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let authorizationHeaders = req.headers.authorization || '';
        let chunks = authorizationHeaders.split(' ');

        if (chunks.length === 0 || chunks[0] !== 'Bearer' || chunks[1].length === 0) {
            return res.status(401).json({
                status: 401,
                message: 'Not logged in'
            });
        }

        let keyPair: KeyPair = await CryptoService.GetKeyPair('kubot-ws');

        jwt.verify(chunks[1], keyPair.publicKey);

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