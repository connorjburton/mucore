import makeDebug from 'debug';

import { name, version } from '../package.json';

const BASE = 'https://api.discogs.com';
const RATE_LIMIT_REMAINING = 'X-Discogs-Ratelimit-Remaining';
const debug = makeDebug('mucore:discogs');

const wait = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default async function discogs<Type>(url: string): Promise<Type|undefined> {
    try {
        const path = `${BASE}${url}`;
        debug(`Making request to ${path}`);
        const response = await fetch(path, {
            headers: {
                Authorization: `Discogs key=${process.env.DISCOGS_KEY}, secret=${process.env.DISCOGS_SECRET}`,
                'User-Agent': `${name}/${version} node/${process.versions.node}`
            }
        });

        if (response.status === 429) {
            debug('Hit rate limit, waiting 60 seconds and will try again');
            await wait(1000 * 60);
            return await discogs(url);
        }

        if (!response.ok) {
            throw new Error(await response.text());
        }

        debug(
            `Request to %s successful, rate limit remaining %s`,
            path,
            `${response.headers.get(RATE_LIMIT_REMAINING)}`
        );

        return await response.json();
    } catch (e) {
        console.error('Error requesting discogs', e);
    }
}