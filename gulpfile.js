/// <binding BeforeBuild='clean' AfterBuild='generatePackage, moveReadme, zip' Clean='clean' />
const gulp = require('gulp');
const rimraf = require('rimraf');
const fs = require('fs-extra');
const util = require('util');

const zipUtil = require('./build-logic/zip.util.js');
const settings = require('./build-logic/private/private.config.js');

var pckg = require('./package.json');

gulp.task('generatePackage', () => {
    const package = JSON.parse(fs.readFileSync('./package.json').toString());

    let distPackage = {
        name: package.name,
        version: package.version,
        description: package.version,
        main: package.main,
        types: package.types,
        author: package.author,
        dependencies: package.dependencies
    };

    fs.writeFile('./dist/package.json', JSON.stringify(distPackage, null, 2), 'utf8', (err) => {
        if (err) console.log('Error while writing dist package.json file:', err);
    });
});

gulp.task('moveReadme', () => {
    fs.unlink('./dist/README.md', function (err) {
        if (err === null || (err && err.code === 'ENOENT')) {
            fs.createReadStream('./README.md').pipe(fs.createWriteStream('./dist/README.md'));
        } else if (err) {
            console.error('Error while moving readme:', err);
        }
    });
});

gulp.task('clean', () => {
    rimraf('./dist', (err) => {
        console.log('Error during clean:', err);
    });
});

gulp.task('zip', async () => {
    await zipUtil.zipDirectory('./dist', `./release/kubotwsapi_${pckg.version}.zip`);
});

gulp.task('sendfordeploy', async () => {
    const exec = util.promisify(require('child_process').exec);

    const { stdout, stderr } = await exec(`.\\pscp.exe -P ${settings.port} -l ${settings.user} -i ${settings.priPath} ./release/kubotwsapi_${pckg.version}.zip ${settings.user}@${settings.srvAddress}:${settings.destPath}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
});

