const Router = require('express-promise-router');
const authRouter = require('./modules/auth/router');
const userRouter = require('./modules/user/router');
const keyRouter = require('./modules/key/router');
const usageRouter = require('./modules/usage/router');
const subscriptionRouter = require('./modules/subscription/router');
const orderRouter = require('./modules/order/router');
const grantRouter = require('./modules/grant/router');

const router = Router();

router.use(authRouter);
router.use('/users', userRouter);
router.use('/keys', keyRouter);
router.use('/usage', usageRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/orders', orderRouter);
router.use('/grants', grantRouter);

module.exports = router;
