import { Response } from "express-serve-static-core";

export abstract class ResponseBroker {
    public static Reply(data: any, res: Response): Response {
        if (data === undefined) {
            return res.status(404).json({
                status: 'Not found',
                data: null
            });
        }
        else {
            return res.status(200).json({
                status: 'Success',
                data: data
            });
        }
    }
}