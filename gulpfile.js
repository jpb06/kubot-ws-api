﻿/// <binding BeforeBuild='clean, useDevConfig' AfterBuild='generatePackage, moveReadme, zip' Clean='clean' />
const gulp = require('gulp');
const fs = require('fs-extra');

const zipUtil = require('./build-logic/zip.util.js');
const fsUtil = require('./build-logic/fs.util.js');
const deployCommands = require('./build-logic/deploy.commands.js');

var pckg = require('./package.json');

gulp.task('generatePackage', async () => {
    await fsUtil.generatePackage();
});

gulp.task('moveReadme', async () => {
    await fs.copy('./README.md', './dist/README.md');
});

gulp.task('useDevConfig', async () => {
    await fsUtil.useDevConfig();
});

gulp.task('clean', async () => {
    await fsUtil.cleanDist();
});

gulp.task('zip', async () => {
    await zipUtil.zipDirectory('./dist', `./release/kubotwsapi_${pckg.version}.zip`);
});

gulp.task('deploy', async () => {
    await fsUtil.cleanDist();

    await fsUtil.useProdConfig();

    await deployCommands.build();

    await fsUtil.generatePackage();

    await zipUtil.zipDirectory('./dist', `./release/kubotwsapi_${pckg.version}.zip`);

    await deployCommands.sendFileToDeployServer();

    return deployCommands.deploy();

});