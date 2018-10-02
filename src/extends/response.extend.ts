declare namespace Express {
    export interface Response {
        populate: (data: any) => Response
        badRequest: (message: string) => Response
    }
}