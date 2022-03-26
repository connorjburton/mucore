import path from 'path';

import { writeFile } from 'fs/promises';

export default async function writeJsonFile<Type>(output: Type) {
    await writeFile(path.join(__dirname, '../data/output.json'), JSON.stringify(output));
}