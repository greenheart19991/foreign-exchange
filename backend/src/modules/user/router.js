const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { or, hasRole } = require('../../middleware/authorization/validators/interface');
const { ROLE_ADMIN } = require('../../constants/roles');
const { listSchema, getSchema } = require('./params');
const { isMe } = require('./access/interface');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

router.route('/')
    .get(
        validator.query(listSchema.query),
        authenticate,
        authorize(
            hasRole([ROLE_ADMIN])
        ),
        controller.list
    );

router.route('/me')
    .get(
        authenticate,
        controller.getMyself
    );

router.route('/:id')
    .get(
        validator.params(getSchema.params),
        authenticate,
        authorize(
            or(
                hasRole([ROLE_ADMIN]),
                isMe
            )
        ),
        controller.get
    );

module.exports = router;
