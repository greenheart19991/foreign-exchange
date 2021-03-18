const Router = require('express-promise-router');
const authRouter = require('./modules/auth/router');
const userRouter = require('./modules/user/router');

const router = Router();

router.use(authRouter);
router.use('/users', userRouter);

module.exports = router;
