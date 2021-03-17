const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const { loginSchema } = require('./params');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

router.route('/login')
    .post(
        validator.body(loginSchema.body),
        controller.login
    );

module.exports = router;
