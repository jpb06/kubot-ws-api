import * as moment from 'moment';

import * as Dal from 'kubot-dal';

export abstract class CacheService {
    private static guildsCount: number;
    private static guildsCountLifetime: number = 20;
    private static guildsCountLastFetch: string = '';

    public static async getGuildCount(): Promise<number> {
        let now = moment();

        if (this.guildsCountLastFetch.length === 0 ||
            moment(this.guildsCountLastFetch).add(this.guildsCountLifetime, 'm').isBefore(now)) {

            let guilds = await Dal.Manipulation.GuildsStore.getAll();
            this.guildsCount = guilds.length;
            this.guildsCountLastFetch = now.toLocaleString();
        }

        return this.guildsCount;
    }

}