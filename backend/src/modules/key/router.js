const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { getSchema, createSchema, removeSchema } = require('./params');
const { isMyKey, isForMe } = require('./access/interface');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

// it's a bit odd resource design, but it's temporary
// (until Key has separate id and User can have many Keys).

router.route('/:userId')
    .get(
        validator.params(getSchema.params),
        authenticate,
        authorize(
            isMyKey
        ),
        controller.get
    );

router.route('/')
    .post(
        validator.body(createSchema.body),
        authenticate,
        authorize(
            isForMe
        ),
        controller.create
    );

router.route('/:userId')
    .delete(
        validator.params(removeSchema.params),
        authenticate,
        authorize(
            isMyKey
        ),
        controller.remove
    );

module.exports = router;
