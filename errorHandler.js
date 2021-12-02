const {getModel, getReason, returnTo } = require("./utilities/mongooseErrors");

module.exports = (err, req, res, next) => {
    const { statusCode = 500 } = err;
    const returnUrl = returnTo(req) || "/login"
    switch (err.name){
        case "CastError":
            const model = getModel(err)
            err.message = `Sorry, no ${model} matches that ID`;
            return res.status(statusCode).render("error", { err })
        case "ValidationError":
            req.flash("error", getReason(err))
            return res.redirect(returnUrl)
        case "MissingUsernameError":
        case "MissingPasswordError":
        case "IncorrectPasswordError":
            req.flash("error", err.message)
            return res.redirect(returnUrl)
        case "AuthenticationError":
            req.flash("error", err.message)
            req.flash("error-more-info", err.moreInfo)
            return res.redirect("/login")
        case "IneligibilityError":
            req.flash("error", err.message)
            req.flash("error-more-info", err.moreInfo)
            return res.redirect("/households/find-or-create")
    }
    if (!err.message) err.message = "Something went wrong."
    res.status(statusCode).render("error", { err })
}