import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import makeDebug from 'debug';

import { Image, Release, Track } from './types';

const debug = makeDebug('mucore:releasesToHtml');

const renderTrack = ({ title, duration }: Track): string => `<li>${title}${duration ? ` (${duration})` : ''}</li>`;

const renderTracklist = (tracklist?: Track[]): string => {
    if (typeof tracklist === 'undefined' || tracklist.length === 0) {
        return '';
    }

    return `
        <b>Tracklist</b>
        <ul>
            ${tracklist.map((track) => renderTrack(track)).join('')}
        </ul>
    `;
}

const renderImage = (images?: Image[]): string => {
    if (typeof images === 'undefined' || !('uri150' in images[0])) {
        return '';
    }

    return `<img src="${images[0].uri150}" />`;
}

const renderRelease = (release: Release): string => {
    const name = `${release.artists_sort} - ${release.title}`;
    debug('Building HTML for release %s', name);
    return `
        <article data-id="${release.id}">
            <label>
                ${name}
                <input type="checkbox" />
            </label>
            ${renderImage(release.images)}
            <details>
                <summary>Details</summary>
                <a href="${release.uri}" target="_blank">Discogs</a> <span class="external-link">&#8599;</span><br />
                ${renderTracklist(release.tracklist)}
            </details>
        </article>
    `;
};

export default async function releasesToHtml(releases: Release[]) {
    // we load assets in via readFile so that IDEs can hint, lint, whatever, when editing them
    // if we were to code them directly in the template we get none of those benefits
    // we may want to load these assets via script/style tags in the future to take advantge of caching/minification
    // depending on how big they get
    const html = `
        <!doctype html>
        <html lang="en">
            <head>
                <meta chartset="utf-8">
                <title>MUCore</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <style>
                    ${await readFile(path.join(__dirname, 'assets/style.css'))}
                </style>
            </head>

            <body>
                <div class="wrapper">
                    ${releases.map((release) => renderRelease(release)).join('')}
                </div>
            </body>

            <script type="text/javascript">

            </script>
        </html>
    `;

    await writeFile(path.join(__dirname, '../dist/index.html'), html);
}