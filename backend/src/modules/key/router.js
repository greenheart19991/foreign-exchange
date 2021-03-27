const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { getSchema, createSchema, removeSchema } = require('./params');
const { isMyKey, isForMe } = require('./access/interface');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

// it's an odd api design, but it's temporary
// (until Key has separate id and User could have many Keys).

router.route('/')
    .get(
        validator.query(getSchema.query),
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

router.route('/')
    .delete(
        validator.query(removeSchema.query),
        authenticate,
        authorize(
            isMyKey
        ),
        controller.remove
    );

module.exports = router;
