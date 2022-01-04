// Passwords encrypted with bcrypt.
// Salt rounds = 10.

module.exports = [
    {
        role: 'user',
        first_name: 'Hyman',
        last_name: 'Beatty',
        email: 'hyman.beatty@gmail.com',
        // password: 'hyman.beatty',
        password: '$2b$10$EKieWVREsxEtQyFE59a5eu2j2Zymh./sztR7LNYZKvVg9JLAMEqNS',
        is_active: true
    },
    {
        role: 'user',
        first_name: 'Bret',
        last_name: 'Cummings',
        email: 'bret.cummings@gmail.com',
        // password: 'bret.cummings',
        password: '$2b$10$uahDWTIIhLDwXgzCTkXpceTKBNwy7Zwa6R11U.MckdbwfirRiDRdO',
        is_active: true
    },
    {
        role: 'user',
        first_name: 'Alexander',
        last_name: 'Crist',
        email: 'alexander.crist@gmail.com',
        // password: 'alexander.crist',
        password: '$2b$10$VBLoal8bNBX6LCudk5yTyes64owtSizX.6d9cENjCxN9GKsnJFEou',
        is_active: false
    },
    {
        role: 'user',
        first_name: 'Eudora',
        last_name: 'Hand',
        email: 'eudora.hand@gmail.com',
        // password: 'eudora.hand',
        password: '$2b$10$uZyQ3k0BDzkW/nvUoYKOduRoKwO19CGja3fMMoHxHPjKyRSBCgkWu',
        is_active: true
    },
    {
        role: 'admin',
        first_name: 'Ruby',
        last_name: 'Bogisich',
        email: 'ruby.bogisich@gmail.com',
        // password: 'ruby.bogisich',
        password: '$2b$10$MMm9aLnXc5bN78LUsIxbqeq4CJ2nYMcpNmk1F22/DhprGeryCeCwi',
        is_active: false
    },
    {
        role: 'admin',
        first_name: 'Edyth',
        last_name: 'Crooks',
        email: 'edyth.crooks@gmail.com',
        // password: 'edyth.crooks',
        password: '$2b$10$NDWt28cnadeBmHsefVzGzelHJ2SDCUXBWKnm71GXMW/Iayt6HNbGC',
        is_active: true
    }
];
