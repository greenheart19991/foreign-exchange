const path = require('path');
const program = require('commander');

program
    .command('up', 'Run migrations up', { executableFile: path.resolve(__dirname, './commands/up.js') })
    .command('down', 'Revert migrations', { executableFile: path.resolve(__dirname, './commands/down.js') })
    .command('create', 'Generate new migration file', {
        executableFile: path.resolve(__dirname, './commands/create.js')
    });

program.parse(process.argv);
