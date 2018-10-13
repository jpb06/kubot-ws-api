import { Request, Response, NextFunction } from 'express';

export function extendsImplementation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.populate = function (data: any): Response {
        if (data === undefined) {
            return res.status(404).json({
                status: 'Not found',
                data: null
            });
        } else {
            return res.status(200).json({
                status: 'Success',
                data: data
            });
        }
    }
    res.badRequest = function (message: string): Response {
        return res.status(400).json({
            status: message,
            data: null
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
    next();
}