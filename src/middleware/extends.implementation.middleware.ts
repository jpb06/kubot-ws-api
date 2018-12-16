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
    res.answer = function (
        status: number,
        message: string
    ): Response {
        return res.status(status).json({
            status: status,
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
    req.validateFactions = function (): boolean {
        if (req.body.factions === undefined || !Array.isArray(req.body.factions)) {
            return false;
        }

        for (let i = 0; i < req.body.factions.length; i++) {
            if (!Dal.Types.PersistedTypesValidation.IsWatchedFaction(req.body.factions[i])) {
                return false;
            }
        }

        return true;
    }
    req.validateRegions = function (): boolean {
        if (req.body.regions === undefined || !Array.isArray(req.body.regions)) {
            return false;
        }

        for (let i = 0; i < req.body.regions.length; i++) {
            if (!Dal.Types.PersistedTypesValidation.IsWatchedRegion(req.body.regions[i])) {
                return false;
            }
        }

        return true;
    }
    req.validateStarSystems = function (): boolean {
        if (req.body.starsystems === undefined || !Array.isArray(req.body.starsystems)) {
            return false;
        }

        for (let i = 0; i < req.body.starsystems.length; i++) {
            if (!Dal.Types.PersistedTypesValidation.IsStarSystem(req.body.starsystems[i])) {
                return false;
            }
        }

        return true;
    }

    next();
}