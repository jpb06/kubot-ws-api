import * as expressJwt from 'express-jwt';
import { KeyPair } from 'rsa-store/typings/types.export';
import { CryptoService } from 'rsa-store';

export abstract class PermissionLogic {

    public static async IsAuthenticated(): Promise<expressJwt.RequestHandler> {
        let keyPair: KeyPair = await CryptoService.GetKeyPair('kubot-ws');

        return expressJwt({
            secret: keyPair.publicKey
        });
    } 
}