/**
 * 对res进行扩展异常处理
 * @param req
 * @param res
 * @param next
 */
exports.resExtend = function (req, res, next) {

    res.render404 = function (error) {
        return res.status(404).render('notify/notify', {error: error});
    };

    res.renderError = function (error, statusCode) {
        if (statusCode === undefined) {
            statusCode = 400;
        }
        return res.status(statusCode).render('notify/notify', {error: error});
    };
    res.sendError = function (err, errorMessage, statusCode) {
        if (statusCode === undefined) {
            statusCode = 400;
        }
        return res.status(statusCode).send({error: err, message: errorMessage});
    }
    next();
};
