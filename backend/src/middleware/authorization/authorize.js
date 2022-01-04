const httpStatus = require('http-status-codes');

const authorize = (validator) => async (req, res, next) => {
    const isValid = await validator(req);

    if (!isValid) {
        return res.status(httpStatus.FORBIDDEN)
            .json({ message: httpStatus.getStatusText(httpStatus.FORBIDDEN) });
    }

    return next();
};

module.exports = authorize;
