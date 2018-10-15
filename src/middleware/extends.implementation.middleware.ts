import { Request, Response, NextFunction } from 'express';
import * as Dal from 'kubot-dal';

export function extendsImplementation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.populate = function (data: any): Response {
        if (data === undefined) {
            return res.status(404).json({
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: data
            });
        }
    }
    res.badRequest = function (message: string): Response {
        return res.status(400).json({
            status: 400,
            message: message
        });
    }
    req.validateId = function (): boolean {
        if (req.body.id === undefined || req.body.id === '') {
            return false;
        }

        return true;
    }
    req.validateLogin = function (): boolean {
        if ((req.body.login === undefined || req.body.login === '') ||
            (req.body.password === undefined || req.body.password === '')) {
            return false;
        }

        return true;
    }
    req.validateGuild = function (): boolean {
        if (req.body.guild === undefined || !Dal.Types.PersistedTypesValidation.IsGuildConfiguration(req.body.guild)) {
            return false;
        }

        return true;
    }
    next();
}