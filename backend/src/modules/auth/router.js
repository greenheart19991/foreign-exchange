const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const { loginSchema, logoutSchema, signupSchema } = require('./params');
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

router.route('/signup')
    .post(
        validator.body(signupSchema.body),
        controller.signup
    );

module.exports = router;
