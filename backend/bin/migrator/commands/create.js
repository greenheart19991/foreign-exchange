const fs = require('fs');
const path = require('path');
const program = require('commander');
const config = require('../config/config');

const pad = (number, digitsCount) => {
    let prefix = '';

    for (let p = 1; p <= digitsCount - 1; p += 1) {
        if (number < 10 ** p) {
            prefix += '0';
        }
    }

    return `${prefix}${number}`;
};

const toTimeString = (date) => {
    const YYYY = date.getUTCFullYear();
    const MM = pad(date.getUTCMonth() + 1, 2);
    const DD = pad(date.getUTCDate(), 2);

    const hh = pad(date.getUTCHours(), 2);
    const mm = pad(date.getUTCMinutes(), 2);
    const ss = pad(date.getUTCSeconds(), 2);
    const SSS = pad(date.getUTCMilliseconds(), 3);

    return `${YYYY}${MM}${DD}${hh}${mm}${ss}${SSS}`;
};

const createMigrationFile = (migrationName) => {
    if (!migrationName) {
        throw new Error('Name for migration is not specified');
    }

    const prefix = toTimeString(new Date());
    const id = `${prefix}_${migrationName}`;
    const ext = 'js';

    const templatePath = path.resolve(__dirname, `../templates/migration.${ext}`);
    const destPath = path.resolve(__dirname, `../../../migrations/${config.env}/${id}.${ext}`);

    fs.copyFileSync(templatePath, destPath, fs.constants.COPYFILE_EXCL);
};

const controller = (migrationName, cmd, args) => {
    if (args) {
        program.outputHelp();
        process.exitCode = 1;

        return;
    }

    try {
        createMigrationFile(migrationName);
    } catch (e) {
        console.error(e);
        process.exitCode = 1;
    }
};

program
    .arguments('<migration_name>')
    .action(controller);

program.parse(process.argv);
