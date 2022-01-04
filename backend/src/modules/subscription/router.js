const Router = require('express-promise-router');
const { createValidator } = require('express-joi-validation');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization/authorize');
const { or, hasRole } = require('../../middleware/authorization/validators/interface');
const { ROLE_ADMIN } = require('../../constants/roles');
const { listSchema, getSchema, createSchema, archiveSchema } = require('./params');
const { isPublishedOnly } = require('./access/interface');
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
                isPublishedOnly
            )
        ),
        controller.list
    );

router.route('/')
    .post(
        validator.body(createSchema.body),
        authenticate,
        authorize(
            hasRole([ROLE_ADMIN])
        ),
        controller.create
    );

router.route('/:id')
    .get(
        validator.params(getSchema.params),
        authenticate,
        controller.get
    );

router.route('/:id')
    .delete(
        validator.params(archiveSchema.params),
        authenticate,
        authorize(
            hasRole([ROLE_ADMIN])
        ),
        controller.archive
    );

module.exports = router;
