// Passwords encrypted with bcrypt.
// Salt rounds = 10.

module.exports = [
    {
        role: 'admin',
        first_name: 'Admin',
        last_name: 'FE',
        email: 'admin@foreignexchange.com',
        // password: 'admin-foreign-exchange',
        password: '$2b$10$aMz0siKR1QQD.V.MMR0zK.s9OI0w/Pw8bI8FFtarC/xjRaAS2Feza',
        is_active: true
    }
];
