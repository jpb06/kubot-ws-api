declare namespace Express {
    export interface Response {
        populate: (data: any) => Response
        answer: (status: number, message: string) => Response
    }
}