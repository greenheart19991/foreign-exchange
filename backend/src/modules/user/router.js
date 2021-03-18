const Router = require('express-promise-router');
const authenticate = require('../../middleware/authenticate');
const controller = require('./controller');

const router = Router();

router.route('/')
    .get(
        authenticate,
        controller.list
    );

module.exports = router;
