/// <binding BeforeBuild='clean' AfterBuild='generatePackage, moveReadme, zip' Clean='clean' />
const gulp = require('gulp');
const rimraf = require('rimraf');
const fs = require('fs-extra');
const util = require('util');
const GulpSSH = require('gulp-ssh');

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

/* Deploy  tasks */
gulp.task('srv_send', async () => {
    const exec = util.promisify(require('child_process').exec);

    const { stdout, stderr } = await exec(`.\\pscp.exe -P ${settings.port} -l ${settings.user} -i ${settings.priPath} ./release/kubotwsapi_${pckg.version}.zip ${settings.user}@${settings.srvAddress}:${settings.destPath}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
});

gulp.task('srv_deploy', () => {
    let gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: {
            host: settings.srvAddress,
            port: settings.port,
            username: settings.user,
            privateKey: fs.readFileSync(settings.priPath)
        }
    });

    return gulpSSH
        .shell([`sudo ${settings.deployScriptPath}`], { filePath: `${pckg.version}_deploy.log` })
        .on('data', function (file) { console.log(file.contents.toString()) })
        .pipe(gulp.dest('logs'))
});