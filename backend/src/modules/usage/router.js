const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { or, hasRole } = require('../../middleware/authorization/validators/interface');
const { ROLE_ADMIN } = require('../../constants/roles');
const { getSchema } = require('./params');
const { isMyUsage } = require('./access/interface');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

router.route('/')
    .get(
        validator.query(getSchema.query),
        authenticate,
        authorize(
            or(
                hasRole([ROLE_ADMIN]),
                isMyUsage
            )
        ),
        controller.get
    );

module.exports = router;
