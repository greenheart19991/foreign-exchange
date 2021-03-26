const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { or, and, hasRole } = require('../../middleware/authorization/validators/interface');
const { ROLE_USER, ROLE_ADMIN } = require('../../constants/roles');
const { listSchema, createSchema } = require('./params');
const { isMyOrders, isForMe } = require('./access/interface');
const controller = require('./controller');

const router = Router();
const validator = createValidator();

router.route('/')
    .get(
        validator.query(listSchema.query),
        authenticate,
        authorize(
            or(
                hasRole([ROLE_ADMIN]),
                isMyOrders
            )
        ),
        controller.list
    );

router.route('/')
    .post(
        validator.body(createSchema.body),
        authenticate,
        authorize(
            and(
                hasRole([ROLE_USER]),
                isForMe
            )
        ),
        controller.create
    );

module.exports = router;
