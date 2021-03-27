const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { getSchema } = require('./params');
const { isMyKey } = require('./access/interface');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

// It's a bit odd api design, but it's temporary
// (until Key has separate id and User could have many Keys).
// It seemed to be the closest to acceptable
// solution from resource point of view for current
// domain schema.

router.route('/')
    .get(
        validator.query(getSchema.query),
        authenticate,
        authorize(
            isMyKey
        ),
        controller.get
    );

module.exports = router;
