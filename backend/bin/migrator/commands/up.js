const program = require('commander');
const { umzug, sequelize } = require('../config/umzug');

const migrateAll = async () => umzug.up();

const migrateTo = async (id) => umzug.up({ to: id });

const controller = async (cmd, args) => {
    if (args) {
        program.outputHelp();
        process.exitCode = 1;

        return;
    }

    try {
        if (cmd.to) {
            await migrateTo(cmd.to);
        } else {
            await migrateAll();
        }
    } catch (e) {
        console.error(e);
        process.exitCode = 1;
    } finally {
        sequelize.close();
    }
};

program
    .option('-t, --to <migration_id>', 'Run migrations up from first to <migration_id> (inclusive)')
    .action(controller);

program.parse(process.argv);
