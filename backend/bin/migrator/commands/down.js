const path = require('path');
const program = require('commander');
const { umzug, sequelize } = require('../config/umzug');

const revertLast = async () => {
    const migrations = await umzug.executed();
    if (migrations.length === 0) {
        throw new Error('Already at initial state');
    }

    const last = migrations[migrations.length - 1];
    const lastId = path.basename(last.file, '.js');

    return umzug.down(lastId);
};

const revertTo = async (id) => umzug.down({ to: id });

const controller = async (...args) => {
    if (args.length > 1) {
        program.outputHelp();
        process.exitCode = 1;

        return;
    }

    const cmd = args[args.length - 1];
    try {
        if (cmd.to) {
            await revertTo(cmd.to);
        } else {
            await revertLast();
        }
    } catch (e) {
        console.error(e);
        process.exitCode = 1;
    } finally {
        sequelize.close();
    }
};

program
    .option('-t, --to <migration_id>', 'Revert migrations from last to <migration_id> (inclusive)')
    .action(controller);

program.parse(process.argv);
