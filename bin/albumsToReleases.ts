import 'dotenv/config';
import makeDebug from 'debug';
import path from 'path';
import { writeFile } from 'fs/promises';

import { SearchResponse, Release } from './types';
import records from '../data/input.json';
import discogs from './discogs';
import releasesToHtml from './releasesToHtml';

const debug = makeDebug('mucore:albumsToReleases');

(async function albumsToReleases() {
    const output = [];
    
    for (const { album, artist } of records) {
        const searchResponse = await discogs<SearchResponse>(
            `/database/search?artist=${artist}&release_title=${album}&per_page=1&type=release&country=US`
        );
        
        if (typeof searchResponse === 'undefined' || searchResponse.results.length === 0) {
            debug('No results found from search results for %s', `${artist} - ${album}`);
            continue;
        }

        const { id } = searchResponse.results[0];

        const release = await discogs<Release>(`/releases/${id}`);

        if (typeof release === 'undefined') {
            debug(
                'Can\'t find release for %s, original search result was %o',
                `${artist} - ${album}`,
                searchResponse.results[0]
            );
            continue;
        }

        debug('Found release %s (%d)', release.uri, release.id);

        output.push(release);
    }

    debug('Finished querying record data');

    // useful for debugging the content or using in tests
    if (process.env.OUTPUT_RAW_JSON) {
        await writeFile(path.join(__dirname, '../data/output.json'), JSON.stringify(output));
    }

    await releasesToHtml(output);
})();