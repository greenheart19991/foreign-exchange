const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const { loginSchema, logoutSchema } = require('./params');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

router.route('/login')
    .post(
        validator.body(loginSchema.body),
        controller.login
    );

router.route('/logout')
    .post(
        authenticate,
        validator.body(logoutSchema.body),
        controller.logout
    );

module.exports = router;
