module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(e => {
            req.flash("error", e.message)
            return res.redirect(req.originalUrl)
        });
    }
}