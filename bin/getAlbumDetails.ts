import 'dotenv/config';
import makeDebug from 'debug';

import { SearchResponse, Release, Output } from './types';
import records from '../data/input.json';
import discogs from './discogs';
import writeJsonFile from './writeJsonFile';

const debug = makeDebug('mucore:getAlbumDetails');

const transformRelease = (album: string, artist: string, release: Release): Output => {
    return {
        album,
        artist,
        videos: Array.isArray(release.videos) ? release.videos.map((video) => {
            delete video.description;
            return video;
        }) : [],
        images: Array.isArray(release.images) ? release.images.filter((image) => image.type === 'primary').map((image) => {
            delete image.uri150;
            delete image.type;
            return image;
        }) : []
    }
}

(async function getAlbumDetails() {
    const output = [];
    
    for (const { album, artist } of records.slice(0, 10)) {
        const searchResponse = await discogs<SearchResponse>(
            `/database/search?artist=${artist}&release_title=${album}&per_page=1&type=release`
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

        output.push(transformRelease(album,artist, release));
    }

    writeJsonFile<Output[]>(output);
})();