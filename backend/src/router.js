const Router = require('express-promise-router');
const authRouter = require('./modules/auth/router');
const userRouter = require('./modules/user/router');
const subscriptionRouter = require('./modules/subscription/router');

const router = Router();

router.use(authRouter);
router.use('/users', userRouter);
router.use('/subscriptions', subscriptionRouter);

module.exports = router;
