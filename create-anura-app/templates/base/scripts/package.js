import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import archiver from 'archiver';
import pc from 'picocolors';
function build(ts) {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/manifest.json'))
    );

    const output = fs.createWriteStream(
        path.join(path.dirname(fileURLToPath(import.meta.url)), `${manifest.package}.app.zip`)
    );
    const archive = archiver('zip', {
        zlib: { level: 0 }
    });

    output.on('close', function () {
        console.log(pc.green(`Finished building app package: ${manifest.package}`));
        console.log(pc.yellow(`${archive.pointer()} total bytes`));
    });

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.warn(pc.yellow(err));
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);
    ts === true ? archive.directory(path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'), false) : archive.directory(path.join(path.dirname(fileURLToPath(import.meta.url)), 'src'), false);
    archive.finalize();
}

export { build };
