const Router = require('express-promise-router');
const authRouter = require('./modules/auth/router');

const router = Router();

router.use(authRouter);

module.exports = router;
