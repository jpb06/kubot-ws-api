import { Response } from "express";

export abstract class InputValidator {
    public static validate(id: string, res: Response): Response {
        if (id === undefined || id === '') {
            return res.status(400).json({
                status: 'Expecting an id',
                data: null
            });
        }
        else {
            return res;
        }
    }
}
