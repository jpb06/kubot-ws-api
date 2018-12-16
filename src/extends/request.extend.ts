declare namespace Express {
    export interface Request {
        validateId: () => boolean;
        validateLogin: () => boolean;
        validateGuild: () => boolean;
        validateFactions: () => boolean;
        validateRegions: () => boolean;
        validateStarSystems: () => boolean;
    }
}